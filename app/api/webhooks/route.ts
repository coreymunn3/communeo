import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { ClerkWebhookEvent } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/webhooks:
 *   post:
 *     summary: Handle Clerk authentication webhooks
 *     description: |
 *       Processes webhooks from Clerk authentication service to synchronize user data with the application database.
 *       Handles user creation, updates, and deletion events.
 *     tags: [Utilities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Clerk webhook payload
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Invalid webhook payload or missing headers
 *       500:
 *         description: Server error during webhook processing
 */
export async function POST(req: Request) {
  const CLERK_WEBHOOK_SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!CLERK_WEBHOOK_SIGNING_SECRET) {
    throw new Error(
      "Error: Please add CLERK_WEBHOOK_SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Error: Missing Svix headers");
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: ClerkWebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const eventType = evt.type;
  const { id, username, email_addresses, first_name, last_name, image_url } =
    evt.data;
  const email_address = email_addresses[0]?.email_address;
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log("Webhook payload:", body);

  if (!id || !username || !email_address) {
    console.error(
      "Incomplete Webhook Payload: missing id, username, or email_address"
    );
    return new Response(
      "Incomplete Webhook Payload: missing id, username, or email_address",
      {
        status: 400,
      }
    );
  }

  switch (evt.type) {
    case "user.created":
    case "user.updated":
      try {
        await prisma.app_user.upsert({
          where: { id },
          update: {
            username: username,
            email: email_address,
            clerk_id: id,
            first_name: first_name || "",
            last_name: last_name || "",
            avatar_url: image_url,
          },
          create: {
            username: username,
            email: email_address,
            clerk_id: id,
            first_name: first_name || "",
            last_name: last_name || "",
            avatar_url: image_url,
          },
        });
      } catch (error) {
        console.error(error);
        return new NextResponse(
          `Unable to ${evt.type} user ${email_address}: ${error}`,
          {
            status: 500,
          }
        );
      }

      break;
    case "user.deleted":
      try {
        await prisma.app_user.delete({ where: { id } });
      } catch (error) {
        console.error(error);
        return new NextResponse(
          `Unable to ${evt.type} user ${email_address}: ${error}`,
          {
            status: 500,
          }
        );
      }

      break;
    default:
      throw new Error(`Unhandled Event Type from Clerk webhook: ${evt.type}`);
  }

  return new Response("Webhook received", { status: 200 });
}
