import { NextResponse } from "next/server";
import { getApiDocs } from "@/lib/swagger";

/**
 * @swagger
 * /api/swagger:
 *   get:
 *     summary: Get OpenAPI specification
 *     description: Returns the OpenAPI specification for the Communeo API
 *     tags: [Utilities]
 *     responses:
 *       200:
 *         description: OpenAPI specification in JSON format
 */
export async function GET() {
  const spec = getApiDocs();
  return NextResponse.json(spec);
}
