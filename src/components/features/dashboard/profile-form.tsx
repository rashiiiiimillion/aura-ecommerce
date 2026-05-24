"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateUserProfile } from "@/actions/auth";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type ProfileValues = z.infer<typeof profileSchema>;

export function ProfileForm({ user }: { user: any }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
    },
  });

  const onSubmit = async (data: ProfileValues) => {
    setIsLoading(true);
    try {
      const result = await updateUserProfile(user.id, data);
      if ("success" in result && result.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(("error" in result ? result.error : "Failed to update profile"));
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-[10px] uppercase tracking-widest text-muted-foreground">Full Name</Label>
        <Input 
          id="name" 
          {...form.register("name")} 
          className="rounded-none border-border/50 focus:border-black transition-colors"
        />
        {form.formState.errors.name && (
          <p className="text-[10px] text-red-500 uppercase tracking-wide">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-muted-foreground">Email Address</Label>
        <Input 
          id="email" 
          {...form.register("email")} 
          className="rounded-none border-border/50 focus:border-black transition-colors"
        />
        {form.formState.errors.email && (
          <p className="text-[10px] text-red-500 uppercase tracking-wide">{form.formState.errors.email.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={isLoading}
        className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 rounded-none px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-medium transition-all"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
}
