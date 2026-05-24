"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { saveProduct } from "@/actions/admin-products";
import { ImageUpload } from "@/components/features/admin/image-upload";
import { productSchema } from "@/lib/validations";

type ProductValues = z.infer<typeof productSchema>;

export function ProductForm({ initialData, categories }: { initialData?: any, categories: any[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!initialData);

  const defaultValues: Partial<ProductValues> = initialData ? {
    id: initialData.id,
    name: initialData.name,
    slug: initialData.slug,
    description: initialData.description,
    price: Number(initialData.price),
    comparePrice: initialData.comparePrice ? Number(initialData.comparePrice) : undefined,
    categoryId: initialData.categoryId,
    images: initialData.images || [],
    sku: initialData.inventory?.sku || "",
    inventory: initialData.inventory?.quantity || 0,
    isFeatured: initialData.isFeatured,
    isActive: initialData.isActive,
  } : {
    name: "",
    slug: "",
    description: "",
    price: 0,
    categoryId: categories[0]?.id || "",
    images: [],
    sku: "",
    inventory: 0,
    isFeatured: false,
    isActive: true,
  };

  const form = useForm<ProductValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues,
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    form.setValue("name", newName, { shouldValidate: true, shouldDirty: true });
    
    if (!isSlugManuallyEdited) {
      const generatedSlug = newName
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      
      form.setValue("slug", generatedSlug, { shouldValidate: true, shouldDirty: true });
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    form.setValue("slug", e.target.value, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (data: ProductValues) => {
    if (isUploading) {
      toast.error("Please wait for images to finish uploading.");
      return;
    }

    setIsLoading(true);
    
    const result = await saveProduct(data);

    if (result.success) {
      toast.success(initialData ? "Product updated successfully" : "Product created successfully");
      form.reset(data); // Ensures dirty state is cleared
      router.push("/admin/products");
      router.refresh();
    } else {
      if (result.error?.toLowerCase().includes("slug")) {
        form.setError("slug", { type: "server", message: result.error });
        toast.error("URL Slug is already taken or invalid.");
      } else {
        toast.error(result.error || "Something went wrong");
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link 
          href="/admin/products" 
          className="group flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
          Back to Products
        </Link>
        <h1 className="text-3xl font-heading font-light tracking-tight uppercase">
          {initialData ? "Edit Product" : "New Product"}
        </h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
        toast.error("Please fix the validation errors before submitting.");
        console.log("Form validation errors:", errors);
      })} className="space-y-8">
        <div className="p-8 border border-border/50 bg-white dark:bg-[#111] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Product Name</Label>
              <Input 
                {...form.register("name")} 
                onChange={handleNameChange}
                className="rounded-none border-border/50" 
              />
              {form.formState.errors.name && <p className="text-[10px] text-red-500 uppercase tracking-wide">{form.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">URL Slug</Label>
              <Input 
                {...form.register("slug")} 
                onChange={handleSlugChange}
                className="rounded-none border-border/50" 
              />
              <div className="flex justify-end items-start mt-1 min-h-[16px]">
                {form.formState.errors.slug && <p className="text-[10px] text-red-500 uppercase tracking-wide text-right ml-2">{form.formState.errors.slug.message}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Description</Label>
            <Textarea {...form.register("description")} className="rounded-none border-border/50 min-h-[120px]" />
            {form.formState.errors.description && <p className="text-[10px] text-red-500 uppercase tracking-wide">{form.formState.errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Price (₹)</Label>
              <Input type="number" step="0.01" {...form.register("price")} className="rounded-none border-border/50" />
              {form.formState.errors.price && <p className="text-[10px] text-red-500 uppercase tracking-wide">{form.formState.errors.price.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Compare at Price (₹)</Label>
              <Input type="number" step="0.01" {...form.register("comparePrice")} className="rounded-none border-border/50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Category</Label>
            <select 
              {...form.register("categoryId")} 
              className="flex h-10 w-full rounded-none border border-border/50 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {form.formState.errors.categoryId && <p className="text-[10px] text-red-500 uppercase tracking-wide">{form.formState.errors.categoryId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Product Images</Label>
            <Controller
              name="images"
              control={form.control}
              render={({ field }) => (
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                  onUploadStart={() => setIsUploading(true)}
                  onUploadEnd={() => setIsUploading(false)}
                />
              )}
            />
            {form.formState.errors.images && <p className="text-[10px] text-red-500 uppercase tracking-wide">{form.formState.errors.images.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">SKU</Label>
              <Input {...form.register("sku")} className="rounded-none border-border/50 uppercase" />
              {form.formState.errors.sku && <p className="text-[10px] text-red-500 uppercase tracking-wide">{form.formState.errors.sku.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Inventory Quantity</Label>
              <Input type="number" {...form.register("inventory")} className="rounded-none border-border/50" />
              {form.formState.errors.inventory && <p className="text-[10px] text-red-500 uppercase tracking-wide">{form.formState.errors.inventory.message}</p>}
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...form.register("isFeatured")} className="rounded-none border-border/50 text-foreground focus:ring-foreground accent-black dark:accent-white" />
              <span className="text-xs font-medium">Featured Product</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...form.register("isActive")} className="rounded-none border-border/50 text-foreground focus:ring-foreground accent-black dark:accent-white" />
              <span className="text-xs font-medium">Active (Visible)</span>
            </label>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading || isUploading}
          className="w-full md:w-auto h-12 rounded-none bg-foreground text-background hover:bg-foreground/90 text-[10px] uppercase tracking-widest px-10"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isUploading ? (
            "Uploading Images..."
          ) : (
            initialData ? "Save Changes" : "Create Product"
          )}
        </Button>
      </form>
    </div>
  );
}
