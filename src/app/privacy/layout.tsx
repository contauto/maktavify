import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy - Maktavify | Your Data Stays Private",
    description:
        "Read Maktavify's privacy policy. All JSON, GraphQL, and XML data processing happens in your browser. We never store or transmit your data.",
    openGraph: {
        title: "Privacy Policy - Maktavify",
        description:
            "Your data never leaves your browser. Read our full privacy policy.",
        url: "https://maktavify.com/privacy",
    },
    alternates: {
        canonical: "https://maktavify.com/privacy",
    },
};

export default function PrivacyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
