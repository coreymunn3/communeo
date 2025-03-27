import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * @swagger
 * /api/link-preview:
 *   get:
 *     summary: Generate link preview for a URL
 *     description: |
 *       Fetches metadata for a URL to generate a link preview, including title, description, and image.
 *       Has special handling for Twitter/X and Facebook Marketplace links.
 *     tags: [Utilities]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: The URL to generate a preview for
 *     responses:
 *       200:
 *         description: Link preview metadata
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LinkPreview'
 *       400:
 *         description: Missing URL parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest) {
  auth.protect();
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // check if URL is x/twitter link
    if (url.includes("x.com") || url.includes("twitter.com")) {
      const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(
        url
      )}`;
      const oembedResponse = await fetch(oembedUrl);
      const oembedData = await oembedResponse.json();
      const { html, author_name, author_url } = oembedData;

      // Extract the image from the HTML (if available)
      const $ = cheerio.load(html);
      const tweetText = $("p").text().trim(); // Extract tweet text
      // Extract media (images/videos) from the oEmbed HTML
      const media: string[] = [];
      $("img").each((_, element) => {
        const src = $(element).attr("src");
        if (src && !src.includes("profile_images")) {
          media.push(src);
        }
      });

      return NextResponse.json({
        title: tweetText,
        description: `Tweet by ${author_name}`,
        author_name,
        author_url,
        image: media[0] || "/images/xlogo.jpeg",
        url: url,
      });
    }

    // check if URL is facebook marketplace
    if (url.includes("facebook.com/marketplace")) {
      // use puppeteer to render the facebook page and get the page content for rendering a link preview
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      // visit the page
      await page.goto(url, { waitUntil: "networkidle2" });
      // extract page content
      const content = await page.content();
      await browser.close();
      // scrape it
      const $ = cheerio.load(content);
      return NextResponse.json({
        title: $("title").text() || "Facebook Marketplace Listing",
        description: $('meta[property="og:description"]').attr("content") || "",
        author_name: "Facebook Marketplace",
        author_url: null,
        image: $('meta[property="og:image"]').attr("content") || null,
        url,
      });
    }

    // otherwise just fetch the link with default og metadeata
    const response = await fetch(url);
    const html = await response.text();
    // Load HTML into Cheerio
    const $ = cheerio.load(html);
    // Extract OpenGraph metadata
    const metadata = {
      title:
        $('meta[property="og:title"]').attr("content") || $("title").text(),
      description:
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content"),
      image: $('meta[property="og:image"]').attr("content") || null,
      author_name:
        $('meta[name="author"]').attr("content") ||
        $('meta[property="article:author"]').attr("content") ||
        $('meta[property="og:site_name"]').attr("content") ||
        null,
      author_url: null, // Non-Twitter links typically don't have an author URL
      url,
    };

    return NextResponse.json(metadata, { status: 200 });
  } catch (error) {
    console.error(`Error fetching link metadata: ${url}, ${error}`);
    return NextResponse.json(
      {
        title: "Oops! This link appears to be broken",
        description: "Unable to generate link preview",
        image: "broken",
        author_name: null,
        author_url: null,
        url: url,
      },
      { status: 200 }
    );
  }
}
