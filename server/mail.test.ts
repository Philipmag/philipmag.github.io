import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ sendMail: vi.fn(), close: vi.fn(), createTransport: vi.fn() }));
vi.mock("nodemailer", () => ({ default: { createTransport: mocks.createTransport } }));
import { sendNotification } from "./mail";
beforeEach(() => {
  vi.resetAllMocks();
  mocks.createTransport.mockReturnValue({ sendMail: mocks.sendMail, close: mocks.close });
  for (const name of ["SMTP_HOST", "SMTP_FROM", "SMTP_USER", "SMTP_PASSWORD", "SMTP_TO", "SMTP_PORT"]) vi.stubEnv(name, "");
});
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });
const message = { title: "A contact message", content: "Private user message", replyTo: "sender@example.com" };
function configure() { vi.stubEnv("SMTP_HOST", "smtp.example.com"); vi.stubEnv("SMTP_FROM", "Digital Guardians <noreply@example.com>"); vi.stubEnv("SMTP_PORT", "587"); }
describe("optional SMTP", () => {
  it("fails explicitly without configured host and sender", async () => {
    expect(await sendNotification(message)).toEqual({ delivered: false, reason: "not_configured" }); expect(mocks.createTransport).not.toHaveBeenCalled();
  });
  it("requires matching optional auth credentials", async () => {
    configure(); vi.stubEnv("SMTP_USER", "test-user");
    expect((await sendNotification(message)).delivered).toBe(false); expect(mocks.createTransport).not.toHaveBeenCalled();
  });
  it("uses default recipient and TLS for port 587, with accepted delivery only", async () => {
    configure(); mocks.sendMail.mockResolvedValue({ accepted: ["info@digitalguards.ca"], rejected: [] });
    expect(await sendNotification(message)).toEqual({ delivered: true });
    expect(mocks.createTransport).toHaveBeenCalledWith(expect.objectContaining({ requireTLS: true, secure: false, logger: false, debug: false }));
    expect(mocks.sendMail).toHaveBeenCalledWith(expect.objectContaining({ to: "info@digitalguards.ca", replyTo: "sender@example.com", disableFileAccess: true, disableUrlAccess: true })); expect(mocks.close).toHaveBeenCalledOnce();
  });
  it("uses implicit TLS and configured credentials on port 465", async () => {
    configure(); vi.stubEnv("SMTP_PORT", "465"); vi.stubEnv("SMTP_USER", "user"); vi.stubEnv("SMTP_PASSWORD", "fake-password"); mocks.sendMail.mockResolvedValue({ accepted: ["info@digitalguards.ca"] });
    await sendNotification(message);
    expect(mocks.createTransport).toHaveBeenCalledWith(expect.objectContaining({ secure: true, auth: { user: "user", pass: "fake-password" } }));
  });
  it.each([{ accepted: [], rejected: [] }, { accepted: ["one@example.com"], rejected: ["other@example.com"] }])("does not report success without complete recipient acceptance", async response => {
    configure(); mocks.sendMail.mockResolvedValue(response);
    expect(await sendNotification(message)).toEqual({ delivered: false, reason: "delivery_failed" });
  });
  it("sanitizes errors without logging SMTP credentials or submitted message", async () => {
    configure(); mocks.sendMail.mockRejectedValue(new Error("fake-password Private user message")); const log = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect((await sendNotification(message)).delivered).toBe(false); expect(log).toHaveBeenCalledWith("[mail] delivery_failed"); expect(mocks.close).toHaveBeenCalledOnce();
  });
  it("strips subject header injection", async () => {
    configure(); mocks.sendMail.mockResolvedValue({ accepted: ["info@digitalguards.ca"] });
    await sendNotification({ ...message, title: "Hello\r\nBcc: attacker@example.com" });
    expect(mocks.sendMail.mock.calls[0][0].subject).not.toMatch(/[\r\n]/);
  });
});
