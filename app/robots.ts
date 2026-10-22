export const dynamic = "force-static";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/calculators", "/calculators/", "/about", "/privacy", "/terms"],
        disallow: ["/__next/", "/_next/", "/api/", "/_vercel/"],
      },
    ],
    sitemap: "http://localhost:3000/sitemap.xml",
  };
}
