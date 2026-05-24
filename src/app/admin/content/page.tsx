import { getAllHomepageSections } from "@/actions/content";
import { ContentClient } from "@/components/features/admin/content-client";

export const metadata = {
  title: "Content Management | Admin | Aura",
};

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const result = await getAllHomepageSections();
  const sections = 'success' in result && result.data ? result.data : [];

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-heading tracking-widest uppercase">Content Management</h2>
          <p className="text-muted-foreground mt-2 font-light">
            Manage your storefront homepage campaigns, editorial sections, and luxury banners.
          </p>
        </div>
      </div>
      <ContentClient initialSections={sections} />
    </div>
  );
}
