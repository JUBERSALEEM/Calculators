import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Calculators — verified, privacy-first online calculators",
  description:
    "Working calculators you can trust. Percentage change, BMI, wind chill, heat index, length " +
    "conversion and more — all formulas verified against authoritative sources, all calculations " +
    "run in your browser.",
  metadataBase: new URL("http://localhost:3000"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en",
    siteName: "Calculators",
    title: "Calculators — verified, privacy-first online calculators",
    description:
      "Working calculators you can trust. All formulas verified against authoritative sources.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <html lang="en" className="sans">
        <body className="min-h-svg flex flex-col">
          <Header />
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ThemeProvider>
  );
}
