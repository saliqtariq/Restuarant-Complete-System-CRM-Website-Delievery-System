export function getRequiredEnv(name: string, options?: { minLength?: number }): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  if (options?.minLength && value.length < options.minLength) {
    throw new Error(`Environment variable ${name} must be at least ${options.minLength} characters long`);
  }

  return value;
}

export function getOptionalEnv(name: string): string | undefined {
  return process.env[name] || undefined;
}

export function assertProductionSecrets(): void {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "ADMIN_SESSION_SECRET",
    "ADMIN_USERNAME",
    "ADMIN_PASSWORD",
    "KDS_SESSION_SECRET",
    "KDS_PASSWORD",
    "RESEND_API_KEY",
    "OTP_PEPPER",
  ] as const;

  for (const key of required) {
    const value = getOptionalEnv(key);
    if (!value || value.trim().length === 0) {
      throw new Error(`Missing required production secret: ${key}`);
    }
  }
}
