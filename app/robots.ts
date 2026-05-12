import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/cart", "/checkout", "/checkout/success", "/api/"],
            },
        ],
        sitemap: "https://ccb.farm/sitemap.xml",
    };
}
