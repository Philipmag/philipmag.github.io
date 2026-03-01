/*
 * Guide: Email Basics — Comprehensive email safety guide for seniors
 */

import { Mail, AlertTriangle, Shield, Eye, Trash2, Link2, UserX } from "lucide-react";
import ArticleLayout, {
  ArticleSection,
  ArticleParagraph,
  ArticleTip,
  ArticleCard,
  ArticleStepList,
  ArticleQuiz,
} from "@/components/ArticleLayout";

const tableOfContents = [
  { id: "understanding-email", label: "Understanding Email" },
  { id: "spotting-phishing", label: "Spotting Phishing Emails" },
  { id: "red-flags", label: "Red Flags to Watch For" },
  { id: "safe-practices", label: "Safe Email Practices" },
  { id: "what-to-do", label: "What to Do If You're Unsure" },
  { id: "quiz", label: "Test Your Knowledge" },
];

export default function EmailBasics() {
  return (
    <ArticleLayout
      title="Email Basics & Safety"
      subtitle="Learn how to use email safely, recognize suspicious messages, and protect yourself from phishing scams — explained in plain language."
      icon={Mail}
      readTime="8 min read"
      difficulty="Beginner"
      tableOfContents={tableOfContents}
    >
      <ArticleSection id="understanding-email" title="Understanding Email">
        <ArticleParagraph>
          Email is one of the most useful tools on the internet. It lets you stay in touch with family, receive important updates from your bank or doctor, and even shop online. But just like regular mail, not every email you receive is trustworthy. Some emails are sent by scammers who want to trick you into sharing personal information or clicking on dangerous links.
        </ArticleParagraph>
        <ArticleParagraph>
          The good news is that staying safe with email is straightforward once you know what to look for. This guide will walk you through the basics of email safety, help you recognize suspicious messages, and give you simple steps to protect yourself.
        </ArticleParagraph>
        <ArticleTip title="Remember" variant="tip">
          You don't need to be a computer expert to stay safe. Just being careful and knowing what to look for is already a huge step in the right direction.
        </ArticleTip>
      </ArticleSection>

      <ArticleSection id="spotting-phishing" title="Spotting Phishing Emails">
        <ArticleParagraph>
          "Phishing" is when scammers send fake emails that look like they come from a real company — like your bank, Amazon, or the government. Their goal is to trick you into clicking a link, downloading an attachment, or sharing sensitive information like passwords or credit card numbers.
        </ArticleParagraph>
        <ArticleParagraph>
          Phishing emails have become very convincing. They often use real company logos, professional-looking layouts, and urgent language to make you act quickly without thinking. Here's how to spot them:
        </ArticleParagraph>

        <ArticleCard title="Check the Sender's Email Address" icon={Eye}>
          Look carefully at who sent the email. A real email from your bank might come from "support@yourbank.com," but a fake one might come from "support@yourbank-secure-update.com." If the address looks unusual or has extra words, it's likely fake.
        </ArticleCard>

        <ArticleCard title="Look for Urgent or Threatening Language" icon={AlertTriangle}>
          Scammers want you to panic. Phrases like "Your account will be closed in 24 hours!" or "Immediate action required!" are designed to make you act without thinking. Real companies rarely send emails with this kind of pressure.
        </ArticleCard>

        <ArticleCard title="Hover Over Links Before Clicking" icon={Link2}>
          Before clicking any link in an email, hover your mouse over it (don't click). A small box will appear showing where the link actually goes. If the web address looks strange or doesn't match the company's real website, don't click it.
        </ArticleCard>

        <ArticleCard title="Watch for Generic Greetings" icon={UserX}>
          If an email says "Dear Customer" or "Dear User" instead of your actual name, be cautious. Most legitimate companies will address you by name because they have your information on file.
        </ArticleCard>
      </ArticleSection>

      <ArticleSection id="red-flags" title="Red Flags to Watch For">
        <ArticleParagraph>
          Here are the most common warning signs that an email might be a scam. If you notice even one of these, proceed with caution:
        </ArticleParagraph>

        <ArticleStepList
          steps={[
            {
              title: "Unexpected attachments",
              description:
                "If you weren't expecting a file from someone, don't open it. Attachments can contain viruses that infect your computer. This includes PDFs, Word documents, and especially .exe files.",
            },
            {
              title: "Spelling and grammar mistakes",
              description:
                "While minor typos happen, phishing emails often contain noticeable grammatical errors, awkward phrasing, or unusual capitalization. Professional companies carefully proofread their communications.",
            },
            {
              title: "Requests for personal information",
              description:
                "Your bank, the IRS, and Medicare will never ask for your password, Social Security number, or credit card details via email. If an email asks for this, it's almost certainly a scam.",
            },
            {
              title: "Too-good-to-be-true offers",
              description:
                "Emails claiming you've won a lottery, inherited money from a stranger, or can get a free gift card are almost always scams. If it sounds too good to be true, it probably is.",
            },
            {
              title: "Mismatched URLs or suspicious links",
              description:
                "The text of a link might say 'www.yourbank.com' but actually lead somewhere completely different. Always hover over links to check the real destination before clicking.",
            },
          ]}
        />

        <ArticleTip title="Important Rule" variant="warning">
          When in doubt, don't click. If you receive a suspicious email that claims to be from your bank or a company you use, close the email and go directly to that company's website by typing the address in your browser. You can also call them using the phone number on their official website or on the back of your card.
        </ArticleTip>
      </ArticleSection>

      <ArticleSection id="safe-practices" title="Safe Email Practices">
        <ArticleParagraph>
          Following these simple habits will significantly reduce your risk of falling for email scams:
        </ArticleParagraph>

        <ArticleCard title="Never Share Passwords via Email" icon={Shield}>
          No legitimate company will ever ask you to send your password in an email. If someone asks for your password, it's a scam — no exceptions.
        </ArticleCard>

        <ArticleCard title="Delete Suspicious Emails" icon={Trash2}>
          If an email looks suspicious, the safest thing to do is delete it. You won't miss anything important — real companies will contact you through other means if something is truly urgent.
        </ArticleCard>

        <ArticleCard title="Keep Your Email Software Updated" icon={Shield}>
          Make sure your email app or web browser is always up to date. Updates often include security improvements that help protect you from new threats.
        </ArticleCard>

        <ArticleParagraph>
          It's also a good idea to use a strong, unique password for your email account and enable two-factor authentication if available. Your email is the gateway to many of your other accounts — if someone gains access to it, they could reset passwords for your bank, shopping, and social media accounts.
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection id="what-to-do" title="What to Do If You're Unsure">
        <ArticleParagraph>
          If you receive an email and you're not sure whether it's real or a scam, here's what to do:
        </ArticleParagraph>

        <ArticleStepList
          steps={[
            {
              title: "Don't click any links or open attachments",
              description:
                "Leave the email alone for now. Don't interact with anything in it until you've verified it's legitimate.",
            },
            {
              title: "Contact the company directly",
              description:
                "Look up the company's phone number on their official website (not from the email) and call them to ask if they sent the message.",
            },
            {
              title: "Ask someone you trust",
              description:
                "Show the email to a family member, friend, or caregiver who can help you determine if it's real. There's no shame in asking for a second opinion.",
            },
            {
              title: "Use our Scam Analyzer",
              description:
                "Copy and paste the email text into our AI Scam Analyzer on the homepage. It will analyze the message and tell you if it looks suspicious.",
            },
          ]}
        />

        <ArticleTip title="You're Doing Great" variant="important">
          The fact that you're reading this guide means you're already taking steps to protect yourself. Scammers rely on people not knowing these tricks — now you do.
        </ArticleTip>
      </ArticleSection>

      <ArticleSection id="quiz" title="Test Your Knowledge">
        <ArticleParagraph>
          Let's see how much you've learned. Try these quick questions:
        </ArticleParagraph>

        <ArticleQuiz
          question="You receive an email from 'support@amaz0n-security.com' asking you to verify your account. What should you do?"
          options={[
            "Click the link and enter your password",
            "Reply with your account details",
            "Delete the email and go to Amazon.com directly",
            "Forward it to your friends",
          ]}
          correctIndex={2}
          explanation="The email address contains a zero instead of an 'o' and has extra words — classic signs of a phishing email. Always go directly to the real website instead of clicking links in suspicious emails."
        />

        <ArticleQuiz
          question="Which of these is a red flag in an email?"
          options={[
            "The email addresses you by your full name",
            "The email says 'Dear Valued Customer'",
            "The email comes from a company you regularly use",
            "The email has a professional-looking logo",
          ]}
          correctIndex={1}
          explanation="Generic greetings like 'Dear Valued Customer' are a common sign of phishing. Legitimate companies that have your account will usually address you by name."
        />
      </ArticleSection>
    </ArticleLayout>
  );
}
