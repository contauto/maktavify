import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us - Maktavify | Get in Touch",
    description:
        "Contact the Maktavify team for feature requests, bug reports, or general inquiries. We'd love to hear from you.",
    openGraph: {
        title: "Contact Maktavify",
        description:
            "Get in touch with the Maktavify team. Send feedback, feature requests, or report bugs.",
        url: "https://maktavify.com/contact",
    },
    alternates: {
        canonical: "https://maktavify.com/contact",
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
