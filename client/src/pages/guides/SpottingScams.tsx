/*
 * Guide: Spotting Scams — Comprehensive scam identification guide for seniors
 */

import {
  ShieldAlert,
  Phone,
  Mail,
  MessageSquare,
  Heart,
  Banknote,
  UserX,
  AlertTriangle,
  Shield,
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
  { id: "why-seniors-targeted", label: "Why Seniors Are Targeted" },
  { id: "common-scam-types", label: "Common Scam Types" },
  { id: "warning-signs", label: "Universal Warning Signs" },
  { id: "real-examples", label: "Real-World Examples" },
  { id: "protecting-yourself", label: "Protecting Yourself" },
  { id: "if-you-were-scammed", label: "If You Were Scammed" },
  { id: "quiz", label: "Test Your Knowledge" },
];

export default function SpottingScams() {
  return (
    <ArticleLayout
      title="Spotting Scams: A Complete Guide"
      subtitle="Learn to recognize the most common scams targeting seniors, understand the tactics scammers use, and know exactly what to do to protect yourself."
      icon={ShieldAlert}
      readTime="12 min read"
      difficulty="Beginner"
      tableOfContents={tableOfContents}
    >
      <ArticleSection id="why-seniors-targeted" title="Why Seniors Are Targeted">
        <ArticleParagraph>
          Scammers specifically target older adults for several reasons. Seniors often have retirement savings, own their homes, and have good credit — making them attractive targets. Many older adults are also more trusting and polite, less likely to hang up on a caller, and may be less familiar with the latest technology tricks that scammers use.
        </ArticleParagraph>
        <ArticleParagraph>
          According to the FBI's Internet Crime Complaint Center, Americans over 60 lost more than $3.4 billion to online scams in a single year. The average loss per victim was over $33,000. These are not small-time tricks — they are sophisticated operations run by organized criminals.
        </ArticleParagraph>
        <ArticleTip title="There's No Shame in Being Targeted" variant="important">
          Being targeted by a scammer doesn't mean you're gullible or foolish. These criminals are professionals who spend their entire day perfecting their tricks. Even tech-savvy people fall for scams. What matters is learning to recognize the signs.
        </ArticleTip>
      </ArticleSection>

      <ArticleSection id="common-scam-types" title="Common Scam Types">
        <ArticleParagraph>
          Scammers use many different approaches, but most fall into a few common categories. Understanding these types will help you recognize them immediately:
        </ArticleParagraph>

        <ArticleCard title="The Grandparent Scam" icon={Phone}>
          A caller pretends to be your grandchild (or a police officer, lawyer, or doctor calling on their behalf) and claims to be in trouble — arrested, in an accident, or stranded somewhere. They beg you to send money immediately and ask you not to tell anyone. The real trick: they use vague language ("Hi Grandma, it's me!") and let you fill in the name yourself.
        </ArticleCard>

        <ArticleCard title="Tech Support Scams" icon={AlertTriangle}>
          You receive a phone call, pop-up message, or email claiming your computer has a virus or security problem. The scammer poses as a technician from Microsoft, Apple, or your internet provider and asks for remote access to your computer or payment to "fix" the problem. Real tech companies never contact you this way.
        </ArticleCard>

        <ArticleCard title="Government Impersonation Scams" icon={UserX}>
          Scammers pretend to be from the IRS, Social Security Administration, or Medicare. They may claim you owe back taxes, your Social Security number has been "suspended," or you need to verify your Medicare information. Real government agencies communicate primarily by mail and never demand immediate payment or threaten arrest over the phone.
        </ArticleCard>

        <ArticleCard title="Romance Scams" icon={Heart}>
          Scammers create fake profiles on dating sites or social media and build a relationship over weeks or months. Once trust is established, they invent a crisis — a medical emergency, travel problem, or business deal — and ask for money. These scams are particularly devastating because they exploit genuine emotions.
        </ArticleCard>

        <ArticleCard title="Phishing & Smishing" icon={Mail}>
          Fake emails (phishing) or text messages (smishing) that look like they come from your bank, a delivery service, or a company you use. They contain links to fake websites designed to steal your login credentials or personal information. The messages often create urgency: "Your account has been locked" or "Confirm your delivery."
        </ArticleCard>

        <ArticleCard title="Investment & Cryptocurrency Scams" icon={Banknote}>
          Promises of guaranteed high returns with no risk. Scammers may use fake testimonials, professional-looking websites, and pressure tactics to get you to invest. Cryptocurrency scams are especially common because transactions are difficult to reverse. Remember: if an investment sounds too good to be true, it is.
        </ArticleCard>
      </ArticleSection>

      <ArticleSection id="warning-signs" title="Universal Warning Signs">
        <ArticleParagraph>
          While scams come in many forms, they almost always share certain characteristics. If you notice any of these signs, stop and think before taking action:
        </ArticleParagraph>

        <ArticleStepList
          steps={[
            {
              title: "Urgency and pressure",
              description:
                "Scammers create a sense of emergency to prevent you from thinking clearly. 'Act now or lose your account!' 'Send money today or your grandchild goes to jail!' Real situations rarely require instant action.",
            },
            {
              title: "Unusual payment methods",
              description:
                "Requests for gift cards, wire transfers, cryptocurrency, or cash are almost always scams. Legitimate businesses and government agencies accept standard payment methods and never ask for gift cards.",
            },
            {
              title: "Requests for secrecy",
              description:
                "'Don't tell anyone about this.' 'Keep this between us.' Scammers isolate their victims to prevent them from getting advice. If someone asks you to keep a financial transaction secret, it's a scam.",
            },
            {
              title: "Unsolicited contact",
              description:
                "If you didn't initiate the contact — whether it's a phone call, email, text, or social media message — be extra cautious. Scammers reach out to you; legitimate organizations usually wait for you to contact them.",
            },
            {
              title: "Too good to be true",
              description:
                "Free vacations, lottery winnings, guaranteed investment returns, miracle health cures — if an offer seems unbelievably good, it's because it isn't real.",
            },
            {
              title: "Emotional manipulation",
              description:
                "Scammers play on your emotions — fear, love, sympathy, greed, or guilt. If a message makes you feel a strong emotion and then asks for money or information, take a step back.",
            },
          ]}
        />
      </ArticleSection>

      <ArticleSection id="real-examples" title="Real-World Examples">
        <ArticleParagraph>
          Understanding how scams work in practice can help you spot them. Here are some real scenarios (with details changed to protect victims):
        </ArticleParagraph>

        <ArticleTip title="Example: The Fake Bank Alert" variant="warning">
          Margaret, 72, received a text message: "ALERT: Unusual activity detected on your Chase account. Click here to verify: chase-secure-verify.com." The link led to a website that looked exactly like Chase's real site. She entered her username and password, which the scammers immediately used to access her real account. The real Chase website is chase.com — the scam URL had extra words added.
        </ArticleTip>

        <ArticleTip title="Example: The Grandchild in Trouble" variant="warning">
          Robert, 78, received a phone call: "Grandpa, it's me, I'm in trouble." Robert said, "Tommy?" and the caller said, "Yes, it's Tommy. I was in a car accident and I need $5,000 for bail. Please don't tell Mom and Dad." Robert was about to send money via wire transfer when his daughter called and confirmed Tommy was safe at home.
        </ArticleTip>

        <ArticleTip title="Example: The Tech Support Pop-Up" variant="warning">
          Helen, 69, was browsing the internet when a loud alarm sounded and a pop-up appeared: "WARNING: Your computer is infected! Call Microsoft Support immediately: 1-800-XXX-XXXX." She called the number, and the person asked for remote access to her computer and $299 for "virus removal." Microsoft never displays phone numbers in pop-up warnings.
        </ArticleTip>
      </ArticleSection>

      <ArticleSection id="protecting-yourself" title="Protecting Yourself">
        <ArticleParagraph>
          The best defense against scams is a combination of awareness and simple habits. Here's your action plan:
        </ArticleParagraph>

        <ArticleCard title="Pause Before Acting" icon={Shield}>
          The most powerful anti-scam tool is simply pausing. When you receive an unexpected message or call that creates urgency, take a breath. Tell the caller you'll call back. Close the email. Give yourself time to think clearly. Scammers rely on quick reactions.
        </ArticleCard>

        <ArticleCard title="Verify Independently" icon={Search}>
          If someone claims to be from your bank, the government, or a company, hang up and call the organization directly using a number you know is real (from their website, your statement, or the back of your card). Never use a phone number provided in the suspicious message.
        </ArticleCard>

        <ArticleCard title="Talk to Someone You Trust" icon={MessageSquare}>
          Before sending money or sharing personal information, talk to a family member, friend, or financial advisor. Scammers want you to act alone and in secret. Getting a second opinion is one of the most effective ways to avoid being scammed.
        </ArticleCard>

        <ArticleCard title="Register on the Do Not Call List" icon={Phone}>
          Register your phone number at donotcall.gov to reduce telemarketing calls. While this won't stop all scam calls, it means that most unsolicited calls you receive are more likely to be scams.
        </ArticleCard>
      </ArticleSection>

      <ArticleSection id="if-you-were-scammed" title="If You Were Scammed">
        <ArticleParagraph>
          If you think you've been scammed, act quickly but don't panic. Many people feel embarrassed, but remember — scammers are professionals and anyone can be a victim. Here's what to do:
        </ArticleParagraph>

        <ArticleStepList
          steps={[
            {
              title: "Stop all contact with the scammer",
              description:
                "Don't respond to any more messages, calls, or emails from them. Block their number and email address if possible.",
            },
            {
              title: "Contact your bank immediately",
              description:
                "If you sent money or shared financial information, call your bank using the number on the back of your card. They may be able to stop or reverse the transaction.",
            },
            {
              title: "Change your passwords",
              description:
                "If you shared any login credentials, change those passwords immediately. Start with your email, then your bank, and any other accounts that use the same password.",
            },
            {
              title: "Report the scam",
              description:
                "File a report with the FTC at reportfraud.ftc.gov, your local police department, and the FBI's Internet Crime Complaint Center at ic3.gov. Your report helps protect others.",
            },
            {
              title: "Monitor your accounts",
              description:
                "Keep a close eye on your bank statements and credit reports for the next several months. Consider placing a fraud alert or credit freeze with the three major credit bureaus.",
            },
          ]}
        />

        <ArticleTip title="You Are Not Alone" variant="important">
          Millions of people are targeted by scams every year, and many fall victim. There is no shame in being scammed. What matters is taking action quickly and reporting it so others can be protected too.
        </ArticleTip>
      </ArticleSection>

      <ArticleSection id="quiz" title="Test Your Knowledge">
        <ArticleParagraph>
          Let's see how well you can spot the scams:
        </ArticleParagraph>

        <ArticleQuiz
          question="You receive a call from someone claiming to be your grandchild who needs bail money. What's the best first step?"
          options={[
            "Send the money immediately — they sound upset",
            "Ask them to prove they're your grandchild by answering a personal question",
            "Hang up and call your grandchild directly on their known phone number",
            "Give them your credit card number over the phone",
          ]}
          correctIndex={2}
          explanation="Always verify independently. Hang up and call your grandchild (or their parents) on a number you already have. Scammers can be very convincing, but they can't answer your grandchild's real phone."
        />

        <ArticleQuiz
          question="A pop-up on your computer says it's infected and gives you a phone number to call. What should you do?"
          options={[
            "Call the number immediately",
            "Close the browser window and run your own antivirus software",
            "Give them remote access to fix it",
            "Enter your credit card to pay for the repair",
          ]}
          correctIndex={1}
          explanation="These pop-ups are fake. Close the browser (you may need to force-quit it). Real security software doesn't display phone numbers in browser pop-ups. Run your own trusted antivirus program instead."
        />

        <ArticleQuiz
          question="Which payment method is a major red flag if someone asks you to use it?"
          options={[
            "Credit card",
            "Check",
            "Gift cards",
            "Bank transfer through your bank's app",
          ]}
          correctIndex={2}
          explanation="Gift cards are a favorite payment method for scammers because they're nearly impossible to trace or reverse. No legitimate business, government agency, or family member in genuine trouble will ask you to pay with gift cards."
        />
      </ArticleSection>
    </ArticleLayout>
  );
}
