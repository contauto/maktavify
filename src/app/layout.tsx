import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { SettingsProvider } from "@/context/SettingsContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Maktavify - JSON, GraphQL & XML Beautifier Tool",
    template: "%s | Maktavify"
  },
  description: "Free online tool to format, beautify, and compare JSON, GraphQL, and XML. Convert between XML and JSON. Fast, secure, and easy to use developer tool.",
  keywords: [
    "JSON beautifier",
    "JSON formatter",
    "GraphQL formatter",
    "XML beautifier",
    "XML formatter",
    "JSON to XML converter",
    "XML to JSON converter",
    "JSON compare",
    "XML compare",
    "JSON validator",
    "XML validator",
    "developer tools",
    "online formatter",
    "code beautifier",
    "JSON viewer"
  ],
  authors: [{ name: "Berkemaktav", url: "https://berkemaktav.com" }],
  creator: "Berkemaktav",
  publisher: "Berkemaktav",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://maktavify.com",
    siteName: "Maktavify",
    title: "Maktavify - JSON, GraphQL & XML Beautifier Tool",
    description: "Free online tool to format, beautify, and compare JSON, GraphQL, and XML. Convert between XML and JSON.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Maktavify - JSON, GraphQL & XML Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maktavify - JSON, GraphQL & XML Beautifier Tool",
    description: "Free online tool to format, beautify, and compare JSON, GraphQL, and XML. Convert between XML and JSON.",
    images: ["/og-image.png"],
    creator: "@berkemaktav",
  },
  alternates: {
    canonical: "https://maktavify.com",
    languages: {
      'en': 'https://maktavify.com',
      'tr': 'https://maktavify.com?lang=tr',
    },
  },
  category: "technology",
  verification: {
    google: "your-google-verification-code",
  },
  other: {
    'theme-color': '#4f46e5',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XNZVRQJG1B"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-XNZVRQJG1B');
                    `}
        </Script>
        <Script id="structured-data" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Maktavify",
            "description": "Free online tool to format, beautify, and compare JSON, GraphQL, and XML",
            "url": "https://maktavify.com",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "author": {
              "@type": "Person",
              "name": "Berkemaktav",
              "url": "https://berkemaktav.com"
            }
          })}
        </Script>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
