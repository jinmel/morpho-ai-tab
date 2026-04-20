import { DashboardView } from "./DashboardView";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  return <DashboardView address={address} />;
}
