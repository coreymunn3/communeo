import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

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
        image:
          media[0] ||
          "https://pbs.twimg.com/card_img/1882916950201802752/SUFG9nGN?format=png&name=900x900",
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
      { error: "Failed to fetch link metadata" },
      { status: 500 }
    );
  }
}
