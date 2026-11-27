import nodemailer from "nodemailer";

export type MailNotification = { title: string; content: string; replyTo?: string };
export type MailResult = { delivered: boolean; reason?: "not_configured" | "delivery_failed" };
function header(value: string): string { return value.replace(/[\r\n\u0000]/g, " ").slice(0, 240); }

/** SMTP acceptance, not final inbox delivery. No user messages or transport errors are logged. */
export async function sendNotification(input: MailNotification): Promise<MailResult> {
  const host = process.env.SMTP_HOST?.trim();
  const from = process.env.SMTP_FROM?.trim();
  const to = process.env.SMTP_TO?.trim() || "info@digitalguards.ca";
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD;
  const port = Number(process.env.SMTP_PORT || "587");
  if (!host || !from || !Number.isInteger(port) || port < 1 || port > 65535 || Boolean(user) !== Boolean(password) || [host, from, to, user ?? ""].some(value => /[\r\n\u0000]/.test(value))) return { delivered: false, reason: "not_configured" };
  let transport: ReturnType<typeof nodemailer.createTransport> | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    transport = nodemailer.createTransport({
      host, port, secure: port === 465,
      requireTLS: port !== 465,
      ...(user && password ? { auth: { user, pass: password } } : {}),
      connectionTimeout: 8_000, greetingTimeout: 8_000, socketTimeout: 10_000,
      logger: false, debug: false,
    });
    const timeout = new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error("delivery_timeout")), 12_000); });
    const result = await Promise.race([transport.sendMail({
      from, to, subject: header(input.title), text: input.content,
      ...(input.replyTo ? { replyTo: header(input.replyTo) } : {}),
      disableFileAccess: true, disableUrlAccess: true,
    }), timeout]);
    if (!result.accepted?.length || result.rejected?.length) return { delivered: false, reason: "delivery_failed" };
    return { delivered: true };
  } catch {
    console.warn("[mail] delivery_failed");
    return { delivered: false, reason: "delivery_failed" };
  } finally {
    if (timer) clearTimeout(timer);
    try { transport?.close(); } catch { /* Cleanup must not expose transport details or change persisted success. */ }
  }
}
