import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "OBELS DAVE LOGISTICS LIMITED | Nigeria's Premier Trucking & Logistics",
  description:
    "Enterprise-grade logistics and trucking management platform. Full Truckload (FTL) and Less-Than-Truckload (LTL) shipping across Nigeria with real-time GPS tracking, dynamic pricing, and automated waybill generation.",
  keywords: ["logistics", "trucking", "Nigeria", "freight", "shipping", "FTL", "LTL", "cargo"],
  icons: {
    icon: '/obels-logo-icon.png',
    shortcut: '/obels-logo-icon.png',
    apple: '/obels-logo-icon.png',
  },
  openGraph: {
    title: "OBELS DAVE LOGISTICS LIMITED | Nigeria's Premier Trucking & Logistics",
    description: "Enterprise-grade logistics and trucking management platform. FTL and LTL shipping across Nigeria.",
    images: [{ url: '/obels-logo-icon.png', width: 512, height: 512 }],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${montserrat.variable} antialiased`} style={{ fontFamily: "'Montserrat', system-ui, sans-serif" }}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
