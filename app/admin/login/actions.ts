"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const user = formData.get("username");
  const pass = formData.get("password");

  if (user === "admin" && pass === "abraham123") {
    // In a real app, this should be an encrypted JWT session token.
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", { 
      secure: process.env.NODE_ENV === "production", 
      httpOnly: true, 
      path: "/",
      maxAge: 60 * 60 * 24 // 1 day
    });
    
    redirect("/dashboard");
  }

  return { error: "Invalid username or password" };
}
