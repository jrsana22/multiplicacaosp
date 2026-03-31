import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "REGIONAL") {
    redirect("/dashboard/regional");
  }

  if (user.role === "LIDER") {
    redirect("/dashboard/lider");
  }

  return null;
}
