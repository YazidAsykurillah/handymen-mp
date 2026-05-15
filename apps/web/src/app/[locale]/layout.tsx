import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import { Providers } from "@/components/providers/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import "./globals.css";

const fontSans = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';
const fontHeading = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

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
      className="h-full antialiased"
      style={{ 
        // @ts-ignore
        '--font-inter': fontSans,
        // @ts-ignore
        '--font-outfit': fontHeading 
      } as React.CSSProperties}
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
