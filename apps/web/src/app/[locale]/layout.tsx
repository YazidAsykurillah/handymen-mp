import type { Metadata } from "next";
import localFont from "next/font/local";
import { getMessages } from "next-intl/server";
import { Providers } from "@/components/providers/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import "./globals.css";

const inter = localFont({
  src: [
    {
      path: "../../../public/fonts/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Inter-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

const outfit = localFont({
  src: [
    {
      path: "../../../public/fonts/Outfit-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Outfit-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-outfit",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages: any = await getMessages();
  const t = messages.home?.hero;

  return {
    title: locale === "id" ? "Cari Tukang - Tempat cari tukang profesional dan terpercaya" : "Cari Tukang - Find professional and trusted handymen",
    description: locale === "id" 
      ? "Platform untuk menemukan tukang profesional di Indonesia"
      : "Platform to find professional handymen in Indonesia",
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Providers locale={locale} messages={messages}>
          <Navbar />
          <div className="flex-1 flex flex-col relative min-h-0">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
