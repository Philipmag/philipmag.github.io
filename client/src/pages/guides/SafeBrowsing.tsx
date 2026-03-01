/*
 * Guide: Safe Browsing — Comprehensive internet safety guide for seniors
 */

import {
  Globe,
  Lock,
  ShoppingCart,
  Wifi,
  Shield,
  AlertTriangle,
  Eye,
  Download,
  CreditCard,
  Search,
} from "lucide-react";
import ArticleLayout, {
  ArticleSection,
  ArticleParagraph,
  ArticleTip,
  ArticleCard,
  ArticleStepList,
  ArticleQuiz,
} from "@/components/ArticleLayout";

const tableOfContents = [
  { id: "browsing-basics", label: "Browsing Basics" },
  { id: "secure-websites", label: "Recognizing Secure Websites" },
  { id: "safe-shopping", label: "Safe Online Shopping" },
  { id: "public-wifi", label: "Public Wi-Fi Safety" },
  { id: "downloads-updates", label: "Downloads & Updates" },
  { id: "social-media", label: "Social Media Safety" },
  { id: "quiz", label: "Test Your Knowledge" },
];

export default function SafeBrowsing() {
  return (
    <ArticleLayout
      title="Safe Browsing & Internet Safety"
      subtitle="Navigate the internet with confidence. Learn how to browse safely, shop securely, and protect your personal information online."
      icon={Globe}
      readTime="11 min read"
      difficulty="Beginner"
      tableOfContents={tableOfContents}
    >
      <ArticleSection id="browsing-basics" title="Browsing Basics">
        <ArticleParagraph>
          The internet is a wonderful resource for staying connected, learning new things, managing finances, and shopping from the comfort of your home. But just like driving a car, using the internet safely requires knowing some basic rules of the road.
        </ArticleParagraph>
        <ArticleParagraph>
          A web browser is the program you use to access the internet — common ones include Google Chrome, Safari, Microsoft Edge, and Firefox. When you type a web address (URL) into the browser's address bar, it takes you to that website. Understanding a few key concepts will help you stay safe every time you go online.
        </ArticleParagraph>

        <ArticleCard title="Use a Trusted Browser" icon={Globe}>
          Stick with well-known browsers like Google Chrome, Safari, Microsoft Edge, or Firefox. These browsers have built-in security features that warn you about dangerous websites and block known threats. Make sure your browser is always updated to the latest version.
        </ArticleCard>

        <ArticleCard title="Check the Address Bar" icon={Eye}>
          Always look at the web address (URL) in your browser's address bar. Make sure you're on the website you intended to visit. Scammers create fake websites with addresses that look similar to real ones — for example, "amaz0n.com" (with a zero) instead of "amazon.com."
        </ArticleCard>

        <ArticleTip title="Bookmark Your Important Sites" variant="tip">
          Save bookmarks for websites you visit regularly — your bank, email, favorite shopping sites, and healthcare portals. Using bookmarks instead of typing the address or clicking links in emails ensures you always go to the real website.
        </ArticleTip>
      </ArticleSection>

      <ArticleSection id="secure-websites" title="Recognizing Secure Websites">
        <ArticleParagraph>
          When you share personal information online — like entering a password, making a payment, or filling out a form — it's crucial that the website is secure. Here's how to tell:
        </ArticleParagraph>

        <ArticleCard title="Look for HTTPS and the Padlock" icon={Lock}>
          A secure website's address starts with "https://" (note the 's' for secure) and shows a padlock icon in the address bar. This means the connection between your computer and the website is encrypted — like sending a letter in a sealed envelope instead of on a postcard. Never enter passwords or payment information on a site without HTTPS.
        </ArticleCard>

        <ArticleCard title="Check for Trust Indicators" icon={Shield}>
          Legitimate websites usually have clear contact information, a physical address, a privacy policy, and professional design. If a website looks poorly made, has broken images, or lacks contact details, be cautious about sharing any information.
        </ArticleCard>

        <ArticleStepList
          steps={[
            {
              title: "Look at the URL carefully",
              description:
                "Check for misspellings, extra characters, or unusual domain extensions. 'paypal.com' is real; 'paypa1-secure.com' is fake. The important part is what comes right before '.com' (or '.org', '.gov').",
            },
            {
              title: "Verify the padlock icon",
              description:
                "Click on the padlock icon in your browser's address bar to see the website's security certificate. It should show the company name and confirm the connection is secure.",
            },
            {
              title: "Be wary of pop-ups",
              description:
                "Legitimate websites rarely use aggressive pop-ups asking for personal information. If a pop-up appears asking for your password, credit card, or Social Security number, close it immediately.",
            },
            {
              title: "Trust your instincts",
              description:
                "If something feels off about a website — the design looks unprofessional, the prices are unbelievably low, or the content has many errors — trust your gut and leave the site.",
            },
          ]}
        />
      </ArticleSection>

      <ArticleSection id="safe-shopping" title="Safe Online Shopping">
        <ArticleParagraph>
          Online shopping is convenient and can save you time and money. But it also requires some precautions to protect your financial information. Follow these guidelines for a safe shopping experience:
        </ArticleParagraph>

        <ArticleCard title="Shop from Trusted Retailers" icon={ShoppingCart}>
          Stick to well-known retailers like Amazon, Walmart, Target, and other established stores. If you find a deal on an unfamiliar website, research the company first. Search for reviews and check the Better Business Bureau (bbb.org) before making a purchase.
        </ArticleCard>

        <ArticleCard title="Use a Credit Card, Not a Debit Card" icon={CreditCard}>
          Credit cards offer much better fraud protection than debit cards. If a scammer makes unauthorized charges on your credit card, you can dispute them and you're typically not liable. With a debit card, the money is taken directly from your bank account and can be harder to recover.
        </ArticleCard>

        <ArticleCard title="Be Skeptical of Unbelievable Deals" icon={AlertTriangle}>
          If a website offers a brand-name product at 90% off, it's almost certainly a scam. Scammers create fake shopping sites with incredible deals to collect credit card numbers. Compare prices across multiple retailers — if one price is dramatically lower, it's a red flag.
        </ArticleCard>

        <ArticleTip title="After You Shop" variant="tip">
          Always save your order confirmation emails and check your credit card statements regularly. If you see a charge you don't recognize, contact your credit card company immediately. Most companies have a 60-day window for disputing charges.
        </ArticleTip>
      </ArticleSection>

      <ArticleSection id="public-wifi" title="Public Wi-Fi Safety">
        <ArticleParagraph>
          Public Wi-Fi networks — like those in coffee shops, libraries, airports, and hotels — are convenient but can be risky. Because these networks are open to everyone, it's possible for others to intercept the data you send and receive.
        </ArticleParagraph>

        <ArticleCard title="Avoid Sensitive Activities on Public Wi-Fi" icon={Wifi}>
          Never log into your bank account, make purchases, or enter passwords when connected to public Wi-Fi. Wait until you're on your secure home network or use your phone's cellular data instead. If you must use public Wi-Fi, stick to casual browsing like reading news articles.
        </ArticleCard>

        <ArticleCard title="Verify the Network Name" icon={Search}>
          Scammers sometimes create fake Wi-Fi networks with names similar to legitimate ones. For example, a coffee shop's real network might be "CoffeeShop_WiFi" while a fake one could be "CoffeeShop_Free_WiFi." Ask an employee for the exact network name before connecting.
        </ArticleCard>

        <ArticleTip title="Consider a VPN" variant="important">
          A VPN (Virtual Private Network) encrypts all your internet traffic, making it safe to use even on public Wi-Fi. Many VPN services are affordable and easy to set up. Ask a tech-savvy family member to help you install one on your devices.
        </ArticleTip>
      </ArticleSection>

      <ArticleSection id="downloads-updates" title="Downloads & Updates">
        <ArticleParagraph>
          Keeping your devices updated and being careful about what you download are two of the most important things you can do to stay safe online.
        </ArticleParagraph>

        <ArticleCard title="Keep Everything Updated" icon={Download}>
          Software updates often include security fixes that protect you from newly discovered threats. Enable automatic updates on your computer, phone, and tablet. This includes your operating system (Windows, macOS, iOS, Android), your web browser, and any apps you use.
        </ArticleCard>

        <ArticleCard title="Only Download from Official Sources" icon={Shield}>
          When installing new apps or programs, only download them from official sources: the Apple App Store, Google Play Store, or the software company's official website. Avoid downloading software from pop-up ads, email links, or unfamiliar websites — these often contain malware.
        </ArticleCard>

        <ArticleCard title="Install Antivirus Software" icon={Shield}>
          A good antivirus program provides an extra layer of protection by scanning for and blocking malicious software. Windows comes with built-in protection (Windows Defender), and Mac computers have XProtect. For additional protection, consider reputable options like Norton, Bitdefender, or Malwarebytes.
        </ArticleCard>
      </ArticleSection>

      <ArticleSection id="social-media" title="Social Media Safety">
        <ArticleParagraph>
          Social media platforms like Facebook, Instagram, and YouTube are great for staying connected with family and friends. However, they also present unique safety challenges:
        </ArticleParagraph>

        <ArticleCard title="Limit What You Share" icon={Eye}>
          Avoid posting personal details like your full birthdate, home address, phone number, vacation plans, or financial information. Scammers use this information for identity theft or to craft convincing scam messages. Even seemingly harmless details can be pieced together to compromise your security.
        </ArticleCard>

        <ArticleCard title="Adjust Your Privacy Settings" icon={Lock}>
          Review your privacy settings on each social media platform. Set your profile to "Friends Only" so that strangers can't see your posts, photos, or personal information. Most platforms have a privacy checkup tool that walks you through the settings step by step.
        </ArticleCard>

        <ArticleCard title="Be Cautious with Friend Requests" icon={AlertTriangle}>
          Don't accept friend requests from people you don't know in real life. Scammers create fake profiles to gain access to your personal information or to build trust before attempting a scam. If you receive a request from someone you think you know but aren't sure, verify by contacting them through another method.
        </ArticleCard>

        <ArticleTip title="The Duplicate Friend Scam" variant="warning">
          A common trick: scammers copy a friend's profile (name, photo, and all) and send you a friend request. If you accept, they may message you pretending to be your friend and ask for money or personal information. If you get a friend request from someone you're already friends with, it's almost certainly a scam. Contact your real friend to let them know.
        </ArticleTip>
      </ArticleSection>

      <ArticleSection id="quiz" title="Test Your Knowledge">
        <ArticleParagraph>
          Let's check how well you can navigate the internet safely:
        </ArticleParagraph>

        <ArticleQuiz
          question="You're about to enter your credit card number on a website. What should you check first?"
          options={[
            "That the website has colorful graphics",
            "That the URL starts with 'https://' and shows a padlock icon",
            "That the website has a search bar",
            "That the website loads quickly",
          ]}
          correctIndex={1}
          explanation="The 'https://' and padlock icon indicate that the connection is encrypted, meaning your credit card information will be transmitted securely. Never enter payment information on a site without these indicators."
        />

        <ArticleQuiz
          question="You're at a coffee shop and need to check your bank balance. What's the safest approach?"
          options={[
            "Connect to the coffee shop's Wi-Fi and log in",
            "Ask the barista for the Wi-Fi password first, then log in",
            "Wait until you're home on your secure network, or use your phone's cellular data",
            "Use any available open Wi-Fi network",
          ]}
          correctIndex={2}
          explanation="Public Wi-Fi networks are not secure for sensitive activities like banking. Use your home network or cellular data instead. If you must use public Wi-Fi, use a VPN to encrypt your connection."
        />

        <ArticleQuiz
          question="A pop-up appears saying you need to download a 'critical security update' from an unfamiliar website. What should you do?"
          options={[
            "Download it immediately — security is important",
            "Close the pop-up and update your software through official channels instead",
            "Click the link to learn more about the update",
            "Share the link with friends so they can update too",
          ]}
          correctIndex={1}
          explanation="Legitimate software updates come through your device's built-in update system or the official app store — never through pop-up ads or unfamiliar websites. These pop-ups are a common way to trick people into installing malware."
        />
      </ArticleSection>
    </ArticleLayout>
  );
}
