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
  description: "Free online JSON beautifier, GraphQL formatter, and XML beautifier. Format, validate, compare and convert JSON, XML, GraphQL instantly. No signup required. Fast, secure, browser-based developer tool by Maktavify.",
  keywords: [
    // Primary JSON keywords
    "JSON beautifier", "JSON formatter", "JSON validator", "JSON viewer",
    "JSON compare", "JSON diff", "JSON to XML", "JSON pretty print",
    "format JSON online", "beautify JSON", "JSON editor online",
    "JSON lint", "JSON checker", "JSON minifier", "JSON parser online",
    "JSON tree viewer", "JSON table view", "JSON stringify online",
    "best JSON formatter", "JSON viewer online free",
    // Long-tail JSON
    "format JSON online free", "JSON beautifier online free",
    "pretty print JSON online", "JSON formatter with tree view",
    "validate JSON online", "compare two JSON files online",
    "JSON diff tool online", "JSON to XML converter online free",
    // GraphQL keywords
    "GraphQL formatter", "GraphQL beautifier", "GraphQL validator",
    "GraphQL compare", "format GraphQL", "GraphQL pretty print",
    "GraphQL formatter online", "GraphQL query formatter",
    "best GraphQL formatter", "format GraphQL query online",
    // XML keywords
    "XML beautifier", "XML formatter", "XML validator", "XML compare",
    "XML to JSON", "XML to JSON converter", "format XML online",
    "beautify XML", "XML viewer online", "XML formatter online free",
    "XML pretty print", "convert XML to JSON online free",
    // Turkish keywords
    "JSON düzenleyici", "JSON biçimlendirici", "JSON güzelleştirici",
    "JSON karşılaştırma", "XML dönüştürücü", "online JSON düzenleme",
    "ücretsiz JSON formatter", "JSON doğrulayıcı",
    // General / brand keywords
    "developer tools", "online formatter", "code beautifier",
    "data formatter", "free online tools", "web developer tools",
    "API testing tools", "Maktavify", "maktavify.com"
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
  other: {
    'google-site-verification': 'your-google-verification-code',
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
            "@graph": [
              {
                "@type": "WebSite",
                "name": "Maktavify",
                "url": "https://maktavify.com",
                "description": "Free online JSON, GraphQL and XML beautifier, formatter and comparison tool",
                "inLanguage": ["en", "tr"],
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://maktavify.com/?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@type": "Organization",
                "name": "Maktavify",
                "url": "https://maktavify.com",
                "logo": "https://maktavify.com/icon-512.png",
                "sameAs": [
                  "https://berkemaktav.com"
                ],
                "contactPoint": {
                  "@type": "ContactPoint",
                  "email": "info@berkemaktav.com",
                  "contactType": "customer support"
                }
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://maktavify.com" },
                  { "@type": "ListItem", "position": 2, "name": "About", "item": "https://maktavify.com/about" },
                  { "@type": "ListItem", "position": 3, "name": "Contact", "item": "https://maktavify.com/contact" },
                  { "@type": "ListItem", "position": 4, "name": "Privacy Policy", "item": "https://maktavify.com/privacy" }
                ]
              },
              {
                "@type": "SoftwareApplication",
                "name": "Maktavify - JSON, GraphQL & XML Beautifier",
                "description": "Free online tool to format, beautify, validate and compare JSON, GraphQL, and XML. Convert between formats instantly. No signup required.",
                "url": "https://maktavify.com",
                "applicationCategory": "DeveloperApplication",
                "operatingSystem": "Any",
                "browserRequirements": "Requires JavaScript enabled",
                "softwareVersion": "2.0",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "ratingCount": "50",
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
                  "name": "Berke Maktav",
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
                      "text": "Yes, Maktavify is completely free to use with no limits. No signup, no payment, no ads."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is my data safe with Maktavify?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Absolutely. All data processing happens locally in your browser. Your JSON, GraphQL, or XML data is never sent to any server. Nothing is stored or logged."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How do I format JSON online?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Simply paste your JSON into Maktavify and click the format button. Your JSON will be instantly beautified with proper indentation and syntax highlighting. You can also view it as a tree or table."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can I compare two JSON files?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes! Maktavify has a built-in comparison tool. Switch to Compare mode, paste two JSON objects, and instantly see the differences highlighted side by side."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How do I convert XML to JSON?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Go to the XML tab, paste your XML, select the XML to JSON conversion option, and click format. Your XML will be instantly converted to a clean JSON structure."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Does Maktavify support GraphQL formatting?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, Maktavify supports GraphQL query formatting and beautification using the Prettier engine. Switch to the GraphQL tab and paste your query."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can I use Maktavify on mobile?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, Maktavify is fully responsive and works great on mobile devices, tablets, and desktops. It can also be installed as a PWA (Progressive Web App) for offline-like access."
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
