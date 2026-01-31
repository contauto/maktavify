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
    default: "Maktavify - Free JSON, GraphQL & XML Beautifier, Formatter & Comparison Tool",
    template: "%s | Maktavify"
  },
  description: "Free online JSON beautifier, GraphQL formatter, and XML beautifier. Format, validate, compare and convert JSON, XML, GraphQL instantly. No signup required. Fast, secure, browser-based developer tool.",
  keywords: [
    // Primary keywords
    "JSON beautifier",
    "JSON formatter",
    "JSON validator",
    "JSON viewer",
    "JSON compare",
    "JSON diff",
    "JSON to XML",
    "JSON pretty print",
    "format JSON online",
    "beautify JSON",
    // GraphQL keywords
    "GraphQL formatter",
    "GraphQL beautifier",
    "GraphQL validator",
    "GraphQL compare",
    "format GraphQL",
    "GraphQL pretty print",
    // XML keywords
    "XML beautifier",
    "XML formatter",
    "XML validator",
    "XML compare",
    "XML to JSON",
    "XML to JSON converter",
    "format XML online",
    "beautify XML",
    // General keywords
    "developer tools",
    "online formatter",
    "code beautifier",
    "data formatter",
    "free online tools",
    "web developer tools",
    "API testing tools",
    "JSON tree viewer",
    "JSON table view"
  ],
  authors: [{ name: "Berkemaktav", url: "https://berkemaktav.com" }],
  creator: "Berkemaktav",
  publisher: "Berkemaktav",
  metadataBase: new URL("https://maktavify.com"),
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
    title: "Maktavify - Free JSON, GraphQL & XML Beautifier Tool",
    description: "Free online tool to format, beautify, validate and compare JSON, GraphQL, and XML. Convert between formats instantly. No signup required.",
    images: [
      {
        url: "https://maktavify.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Maktavify - JSON, GraphQL & XML Beautifier Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maktavify - Free JSON, GraphQL & XML Beautifier",
    description: "Free online tool to format, beautify and compare JSON, GraphQL, and XML. No signup required.",
    images: ["https://maktavify.com/og-image.png"],
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
            "@graph": [
              {
                "@type": "WebSite",
                "name": "Maktavify",
                "url": "https://maktavify.com",
                "description": "Free online JSON, GraphQL and XML beautifier, formatter and comparison tool",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://maktavify.com/?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@type": "SoftwareApplication",
                "name": "Maktavify",
                "description": "Free online tool to format, beautify, validate and compare JSON, GraphQL, and XML",
                "url": "https://maktavify.com",
                "applicationCategory": "DeveloperApplication",
                "operatingSystem": "Any",
                "browserRequirements": "Requires JavaScript enabled",
                "softwareVersion": "1.0",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "5",
                  "ratingCount": "1",
                  "bestRating": "5",
                  "worstRating": "1"
                },
                "featureList": [
                  "JSON Beautifier & Formatter",
                  "GraphQL Beautifier & Formatter",
                  "XML Beautifier & Formatter",
                  "JSON Comparison Tool",
                  "GraphQL Comparison Tool",
                  "XML Comparison Tool",
                  "XML to JSON Converter",
                  "JSON to XML Converter",
                  "Tree View for JSON",
                  "Table View for JSON",
                  "Dark Mode Support",
                  "Multiple Theme Options",
                  "Multi-language Support (EN/TR)"
                ],
                "author": {
                  "@type": "Person",
                  "name": "Berkemaktav",
                  "url": "https://berkemaktav.com"
                }
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What is Maktavify?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Maktavify is a free online tool to format, beautify, validate and compare JSON, GraphQL, and XML data. It works entirely in your browser with no signup required."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is Maktavify free to use?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, Maktavify is completely free to use. No signup or payment required."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is my data safe with Maktavify?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, all data processing happens in your browser. Your data is never sent to any server."
                    }
                  }
                ]
              }
            ]
          })}
        </Script>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
