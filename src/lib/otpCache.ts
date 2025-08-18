// Manages OTPs, failed-attempt lockouts, and resend cooldowns entirely in memory.

type OtpRecord = { otp: string; expires: number };
type RateRecord = { count: number; blockedUntil: number };

// In-memory stores keyed by email
const otpCache = new Map<string, OtpRecord>();
const attemptsCache = new Map<string, RateRecord>();
const resendCache = new Map<string, RateRecord>();

/**
 * Generate and store a new 6-digit OTP
 */
export function generateAndStoreOtp(email: string): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 10 * 60_000; // 10 minutes
  otpCache.set(email, { otp, expires });
  // Reset per-email state
  attemptsCache.delete(email);
  resendCache.delete(email);
  return otp;
}

/**
 * Enforce resend cooldown: 1 send per 3 minutes
 */
export function checkAndMarkResend(email: string): { ok: boolean; error?: string } {
  const now = Date.now();
  const rec = resendCache.get(email) ?? { count: 0, blockedUntil: 0 };

  if (rec.blockedUntil > now) {
    const wait = Math.ceil((rec.blockedUntil - now) / 1000);
    return { ok: false, error: `Please wait ${wait}s before requesting another OTP.` };
  }

  // Mark send and set 3m cooldown
  rec.count++;
  rec.blockedUntil = now + 3 * 60_000;
  resendCache.set(email, rec);
  return { ok: true };
}

/**
 * Verify an incoming OTP, enforce 3-strike lockout of 2 minutes
 */
export function verifyOtp(email: string, input: string): { ok: boolean; error?: string } {
  const now = Date.now();
  const attempt = attemptsCache.get(email) ?? { count: 0, blockedUntil: 0 };

  // Check lockout
  if (attempt.blockedUntil > now) {
    const wait = Math.ceil((attempt.blockedUntil - now) / 1000);
    return { ok: false, error: `Too many attempts. Try again in ${wait}s.` };
  }

  const rec = otpCache.get(email);
  if (!rec || rec.expires < now || rec.otp !== input) {
    attempt.count++;
    // Lock out after 3 wrong
    if (attempt.count >= 3) {
      attempt.blockedUntil = now + 2 * 60_000; // 2 minutes
      attempt.count = 0;
    }
    attemptsCache.set(email, attempt);
    return { ok: false, error: 'Invalid or expired OTP.' };
  }

  // Success: clear state
  otpCache.delete(email);
  attemptsCache.delete(email);
  return { ok: true };
}
