import { isTakeawayAuthenticated } from "@/app/actions/takeaway";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TakeawayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await isTakeawayAuthenticated();

  if (!isAuthenticated) {
    redirect("/takeaway/login");
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-[#0F0A0A] text-white font-sans">
      {children}
    </div>
  );
}
