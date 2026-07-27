import { isKdsAuthenticated } from "@/app/actions/kds";
import { redirect } from "next/navigation";

export default async function KdsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await isKdsAuthenticated();

  if (!isAuthenticated) {
    redirect("/kds/login");
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans">
      {children}
    </div>
  );
}
