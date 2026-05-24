import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/features/dashboard/profile-form";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-light tracking-tight uppercase">Settings</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2">Manage your account preferences</p>
      </div>

      <div className="max-w-xl">
        <ProfileForm user={session.user} />
      </div>
    </div>
  );
}
