import { redirect } from "next/navigation";
import { DEMO_ADDRESS } from "@/lib/data";

export default function Home() {
  redirect(`/dashboard/${DEMO_ADDRESS}`);
}
