"use server";

import { supabaseAdmin } from "@/backend/supabaseServer";
import { requireAdmin } from "@/lib/auth/admin";
import { revalidatePath } from "next/cache";

export type Driver = {
  id: string;
  name: string;
  phone: string;
  cnic: string;
  email: string;
  home_address: string;
  branch: string;
  status: "Active" | "Offline" | "On Delivery";
};

export async function getDrivers(): Promise<Driver[]> {
  await requireAdmin();
  const { data, error } = await supabaseAdmin
    .from("drivers")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("getDrivers error:", error);
    return [];
  }
  return data ?? [];
}

export async function getDriversByBranch(branchName: string): Promise<Driver[]> {
  await requireAdmin();

  if (branchName === "All Branches") {
    return getDrivers();
  }

  const { data, error } = await supabaseAdmin
    .from("drivers")
    .select("*")
    .eq("branch", branchName)
    .order("name", { ascending: true });

  if (error) {
    console.error("getDriversByBranch error:", error);
    return [];
  }
  return data ?? [];
}

export async function createDriver(
  input: Omit<Driver, "id">
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await supabaseAdmin.from("drivers").insert([input]);

  if (error) {
    console.error("createDriver error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/drivers");
  return { success: true };
}

export async function updateDriver(
  id: string,
  input: Partial<Omit<Driver, "id">>
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await supabaseAdmin
    .from("drivers")
    .update(input)
    .eq("id", id);

  if (error) {
    console.error("updateDriver error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/drivers");
  return { success: true };
}

export async function deleteDriver(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await supabaseAdmin
    .from("drivers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteDriver error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/drivers");
  return { success: true };
}

export async function updateDriverStatus(
  id: string,
  status: "Active" | "Offline" | "On Delivery"
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  return updateDriver(id, { status });
}
