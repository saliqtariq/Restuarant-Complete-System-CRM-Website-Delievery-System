import { randomInt } from "crypto";

export function generateOtpCode(): string {
  return randomInt(100000, 1000000).toString();
}
