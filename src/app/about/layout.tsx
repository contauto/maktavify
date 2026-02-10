import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us - Maktavify | Free JSON, GraphQL & XML Tool",
    description:
        "Learn about Maktavify, a free online JSON beautifier, GraphQL formatter, and XML tool. Created by Berke Maktav. All processing happens in your browser — secure and private.",
    openGraph: {
        title: "About Maktavify - Free Developer Tools",
        description:
            "Discover Maktavify, the free online tool for formatting, beautifying, and comparing JSON, GraphQL, and XML data. Built with privacy in mind.",
        url: "https://maktavify.com/about",
    },
    alternates: {
        canonical: "https://maktavify.com/about",
    },
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
