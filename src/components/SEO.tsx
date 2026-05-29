import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  type?: "website" | "article";
  publishedDate?: string;
  modifiedDate?: string;
}

export default function SEO({
  title,
  description,
  keywords,
  canonicalPath,
  type = "website",
  publishedDate,
  modifiedDate,
}: SEOProps) {
  useEffect(() => {
    // Set document title
    document.title = `${title} | Digital Guardians`;

    // Set meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", description);
    } else {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      metaDesc.setAttribute("content", description);
      document.head.appendChild(metaDesc);
    }

    // Set keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute("content", keywords);
      } else {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        metaKeywords.setAttribute("content", keywords);
        document.head.appendChild(metaKeywords);
      }
    }

    // Set OG tags
    const setOG = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (tag) {
        tag.setAttribute("content", content);
      } else {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        tag.setAttribute("content", content);
        document.head.appendChild(tag);
      }
    };

    setOG("og:title", `${title} | Digital Guardians`);
    setOG("og:description", description);
    setOG("og:type", type);
    if (canonicalPath) {
      setOG("og:url", `https://digitalguards.ca${canonicalPath}`);
    }

    // Set canonical link
    if (canonicalPath) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute("href", `https://digitalguards.ca${canonicalPath}`);
      } else {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        canonical.setAttribute("href", `https://digitalguards.ca${canonicalPath}`);
        document.head.appendChild(canonical);
      }
    }

    // Article structured data
    if (type === "article") {
      const existingScript = document.querySelector('script[data-seo-article]');
      if (existingScript) existingScript.remove();

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-article", "true");
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "author": {
          "@type": "Organization",
          "name": "Digital Guardians",
        },
        "publisher": {
          "@type": "Organization",
          "name": "Digital Guardians",
          "logo": {
            "@type": "ImageObject",
            "url": "https://d2xsxph8kpxj0f.cloudfront.net/110291972/eUbA5NSXSrUDToa4RxQdTu/DigitalGuardianslogo5_479e26ca.png",
          },
        },
        ...(publishedDate && { "datePublished": publishedDate }),
        ...(modifiedDate && { "dateModified": modifiedDate }),
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://digitalguards.ca${canonicalPath || ""}`,
        },
      });
      document.head.appendChild(script);

      return () => {
        script.remove();
      };
    }
  }, [title, description, keywords, canonicalPath, type, publishedDate, modifiedDate]);

  return null;
}
