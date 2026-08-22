import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { HomeClient } from "@/components/HomeClient";

export default async function Home() {
  const session = await getSession();
  if (!session) {
    redirect("/giris");
  }

  return <HomeClient userName={session.name} />;
}
