/*
 * Guide: Passwords — Comprehensive password security guide for seniors
 */

import { KeyRound, Shield, Eye, Lock, Fingerprint, AlertTriangle, RefreshCw } from "lucide-react";
import ArticleLayout, {
  ArticleSection,
  ArticleParagraph,
  ArticleTip,
  ArticleCard,
  ArticleStepList,
  ArticleQuiz,
} from "@/components/ArticleLayout";

const tableOfContents = [
  { id: "why-passwords-matter", label: "Why Passwords Matter" },
  { id: "creating-strong-passwords", label: "Creating Strong Passwords" },
  { id: "password-managers", label: "Using a Password Manager" },
  { id: "two-factor-auth", label: "Two-Factor Authentication" },
  { id: "common-mistakes", label: "Common Mistakes to Avoid" },
  { id: "quiz", label: "Test Your Knowledge" },
];

export default function Passwords() {
  return (
    <ArticleLayout
      title="Creating & Managing Strong Passwords"
      subtitle="Learn how to create passwords that are hard to guess, easy to manage, and keep your accounts truly secure — no technical jargon required."
      icon={KeyRound}
      readTime="10 min read"
      difficulty="Beginner"
      tableOfContents={tableOfContents}
    >
      <ArticleSection id="why-passwords-matter" title="Why Passwords Matter">
        <ArticleParagraph>
          Your password is like the key to your front door. Just as you wouldn't use a flimsy lock on your home, you shouldn't use a weak password on your online accounts. Passwords protect your email, bank accounts, medical records, and personal information from people who want to steal them.
        </ArticleParagraph>
        <ArticleParagraph>
          Unfortunately, many people use passwords that are easy to guess — like "password123" or their pet's name. Cybercriminals have sophisticated tools that can try millions of password combinations in seconds. A weak password can be cracked in less than a minute, while a strong one could take centuries.
        </ArticleParagraph>
        <ArticleTip title="Did You Know?" variant="important">
          According to cybersecurity research, over 80% of data breaches involve weak or stolen passwords. Taking a few minutes to improve your passwords can dramatically reduce your risk.
        </ArticleTip>
      </ArticleSection>

      <ArticleSection id="creating-strong-passwords" title="Creating Strong Passwords">
        <ArticleParagraph>
          A strong password doesn't have to be impossible to remember. The key is making it long, unique, and unpredictable. Here are proven methods for creating passwords that are both strong and memorable:
        </ArticleParagraph>

        <ArticleCard title="Use a Passphrase" icon={KeyRound}>
          Instead of a single word, use a phrase of 4-6 random words strung together. For example: "purple-elephant-dances-tuesday" is much stronger than "P@ssw0rd" and easier to remember. The length alone makes it nearly impossible to crack.
        </ArticleCard>

        <ArticleCard title="Make It At Least 16 Characters" icon={Shield}>
          The longer your password, the harder it is to crack. Aim for at least 16 characters. A passphrase naturally achieves this. The National Institute of Standards and Technology (NIST) recommends length as the single most important factor in password strength.
        </ArticleCard>

        <ArticleCard title="Mix It Up" icon={RefreshCw}>
          Include a combination of uppercase letters, lowercase letters, numbers, and special characters (like ! @ # $). For example, you could modify your passphrase: "Purple-Elephant-Dances-Tuesday-42!"
        </ArticleCard>

        <ArticleCard title="Never Reuse Passwords" icon={AlertTriangle}>
          Every account should have its own unique password. If a scammer gets the password for one account and you use the same password everywhere, they can access all your accounts. This is called "credential stuffing" and it's very common.
        </ArticleCard>

        <ArticleStepList
          steps={[
            {
              title: "Think of a memorable sentence",
              description:
                "Pick something personal but not publicly known. For example: 'My grandson Tom scored 3 goals in soccer last Friday!'",
            },
            {
              title: "Turn it into a passphrase",
              description:
                "Take key words: 'grandson-Tom-3goals-soccer-Friday' — this is already a strong password at 35 characters.",
            },
            {
              title: "Add some complexity",
              description:
                "Swap a letter for a number or add a symbol: 'grandson-Tom-3goals-$occer-Friday!' — now it's even stronger.",
            },
            {
              title: "Test it mentally",
              description:
                "Can you remember it? Can you type it? If yes, you've got a great password. Write it down and store it somewhere safe until you've memorized it.",
            },
          ]}
        />
      </ArticleSection>

      <ArticleSection id="password-managers" title="Using a Password Manager">
        <ArticleParagraph>
          A password manager is like a secure digital vault that stores all your passwords in one place. You only need to remember one master password to unlock the vault, and the manager fills in your passwords automatically when you log into websites.
        </ArticleParagraph>
        <ArticleParagraph>
          This solves the biggest challenge with passwords: having a unique, strong password for every account without having to remember them all. Password managers can also generate random, ultra-strong passwords for you.
        </ArticleParagraph>

        <ArticleTip title="Recommended Password Managers" variant="tip">
          Several password managers are designed to be easy to use. Popular options include 1Password, Bitwarden (free), and the built-in password managers in Google Chrome and Apple Safari. Ask a family member or tech-savvy friend to help you set one up — it only takes about 15 minutes.
        </ArticleTip>

        <ArticleCard title="How Password Managers Work" icon={Lock}>
          When you create a new account or change a password, the manager saves it automatically. Next time you visit that website, it fills in your username and password for you. All your passwords are encrypted, meaning even if someone stole the vault file, they couldn't read your passwords without the master password.
        </ArticleCard>

        <ArticleCard title="What About Writing Passwords Down?" icon={Eye}>
          If you prefer not to use a password manager, writing passwords in a physical notebook kept in a secure location (like a locked drawer) is still better than using weak passwords or reusing the same password everywhere. Just make sure the notebook is not labeled "Passwords" on the cover and is kept away from your computer.
        </ArticleCard>
      </ArticleSection>

      <ArticleSection id="two-factor-auth" title="Two-Factor Authentication (2FA)">
        <ArticleParagraph>
          Two-factor authentication adds a second layer of security to your accounts. Even if someone steals your password, they still can't get in without the second factor — usually a code sent to your phone or generated by an app.
        </ArticleParagraph>
        <ArticleParagraph>
          Think of it like a bank vault that requires both a key and a combination. Having just one isn't enough to get in. This is one of the most effective ways to protect your accounts.
        </ArticleParagraph>

        <ArticleStepList
          steps={[
            {
              title: "Go to your account settings",
              description:
                "Look for 'Security,' 'Privacy,' or 'Two-Factor Authentication' in the settings menu of your email, bank, or social media account.",
            },
            {
              title: "Choose your second factor",
              description:
                "The most common option is receiving a text message with a code. Some services also offer authentication apps like Google Authenticator or Authy.",
            },
            {
              title: "Enter your phone number",
              description:
                "The service will send a code to your phone. Enter this code to confirm that 2FA is working.",
            },
            {
              title: "Save your backup codes",
              description:
                "Most services give you backup codes in case you lose your phone. Print these out and store them in a safe place.",
            },
          ]}
        />

        <ArticleTip title="Start with Your Email" variant="important">
          If you only enable 2FA on one account, make it your email. Your email is the master key to your online life — it's used to reset passwords for almost every other account you have.
        </ArticleTip>
      </ArticleSection>

      <ArticleSection id="common-mistakes" title="Common Mistakes to Avoid">
        <ArticleParagraph>
          Even well-meaning people make password mistakes that put them at risk. Here are the most common ones and how to avoid them:
        </ArticleParagraph>

        <ArticleCard title="Using Personal Information" icon={AlertTriangle}>
          Avoid using your name, birthday, address, pet's name, or grandchildren's names in passwords. This information is often publicly available on social media and is the first thing scammers try.
        </ArticleCard>

        <ArticleCard title="Sharing Passwords" icon={AlertTriangle}>
          Never share your passwords via email, text message, or phone call. No legitimate company or government agency will ever ask for your password. If someone does, it's a scam.
        </ArticleCard>

        <ArticleCard title="Using Simple Patterns" icon={AlertTriangle}>
          Passwords like "123456," "qwerty," "abc123," or "password" are among the first combinations hackers try. Avoid sequential numbers, keyboard patterns, and common words.
        </ArticleCard>

        <ArticleCard title="Never Changing Passwords" icon={AlertTriangle}>
          If you hear that a company you use has been hacked (a "data breach"), change your password for that service immediately. Also change it on any other accounts where you used the same password.
        </ArticleCard>
      </ArticleSection>

      <ArticleSection id="quiz" title="Test Your Knowledge">
        <ArticleParagraph>
          Let's check what you've learned about password security:
        </ArticleParagraph>

        <ArticleQuiz
          question="Which of these is the strongest password?"
          options={[
            "P@ssw0rd!",
            "john1952",
            "purple-elephant-dances-tuesday-42!",
            "123456789",
          ]}
          correctIndex={2}
          explanation="The passphrase 'purple-elephant-dances-tuesday-42!' is the strongest because it's long (35 characters), uses random words, includes numbers and symbols, and is hard to guess but easy to remember."
        />

        <ArticleQuiz
          question="What should you do if you hear a company you use has been hacked?"
          options={[
            "Nothing — they'll fix it",
            "Delete your account immediately",
            "Change your password for that service right away",
            "Stop using the internet",
          ]}
          correctIndex={2}
          explanation="When a data breach occurs, your password may have been exposed. Changing it immediately prevents anyone from using the stolen password to access your account."
        />

        <ArticleQuiz
          question="Why should you enable two-factor authentication on your email first?"
          options={[
            "Email is the most fun to use",
            "Email is used to reset passwords for other accounts",
            "Email companies require it",
            "It makes email faster",
          ]}
          correctIndex={1}
          explanation="Your email is the gateway to your other accounts. If someone gains access to your email, they can reset passwords for your bank, social media, and shopping accounts. Protecting it with 2FA is critical."
        />
      </ArticleSection>
    </ArticleLayout>
  );
}
