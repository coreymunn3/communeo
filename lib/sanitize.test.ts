import { sanitizeHtml } from "./sanitize";
import { sanitizeUrl } from "./clientSanitize";

describe("HTML Sanitization", () => {
  test("removes script tags", () => {
    const input = '<p>Hello</p><script>alert("XSS")</script>';
    const output = sanitizeHtml(input);
    expect(output).not.toContain("<script>");
  });

  test("removes onclick attributes", () => {
    const input =
      '<a href="https://example.com" onclick="alert(\'XSS\')">Link</a>';
    const output = sanitizeHtml(input);
    expect(output).not.toContain("onclick");
  });

  test("allows permitted tags", () => {
    const input = "<p><strong>Bold</strong> and <em>italic</em></p>";
    const output = sanitizeHtml(input);
    expect(output).toContain(
      "<p><strong>Bold</strong> and <em>italic</em></p>"
    );
  });

  test("allows blockquotes", () => {
    const input = "<blockquote>This is a quote</blockquote>";
    const output = sanitizeHtml(input);
    expect(output).toContain("<blockquote>This is a quote</blockquote>");
  });

  test("allows code blocks", () => {
    const input = "<pre><code>const x = 5;</code></pre>";
    const output = sanitizeHtml(input);
    expect(output).toContain("<pre><code>const x = 5;</code></pre>");
  });

  test("allows lists", () => {
    const input = "<ul><li>Item 1</li><li>Item 2</li></ul>";
    const output = sanitizeHtml(input);
    expect(output).toContain("<ul><li>Item 1</li><li>Item 2</li></ul>");
  });
});

describe("URL Sanitization", () => {
  test("adds https:// to URLs without protocol", () => {
    const input = "example.com";
    const output = sanitizeUrl(input);
    expect(output).toBe("https://example.com");
  });

  test("keeps https:// URLs as is", () => {
    const input = "https://example.com";
    const output = sanitizeUrl(input);
    expect(output).toBe("https://example.com");
  });

  test("keeps http:// URLs as is", () => {
    const input = "http://example.com";
    const output = sanitizeUrl(input);
    expect(output).toBe("http://example.com");
  });

  test("blocks javascript: URLs", () => {
    const input = 'javascript:alert("XSS")';
    const output = sanitizeUrl(input);
    expect(output).toBe("");
  });

  test("returns empty string for empty input", () => {
    const input = "";
    const output = sanitizeUrl(input);
    expect(output).toBe("");
  });
});
