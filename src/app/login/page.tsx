"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      } else if (result?.ok) {
        toast.success("Welcome back");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl });
    } catch {
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-outfit font-light tracking-tight mb-2">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">Sign in to your Aura account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="login-email" className="block text-xs uppercase tracking-wider mb-2">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground transition-colors disabled:opacity-50"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-xs uppercase tracking-wider mb-2">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground transition-colors disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-black w-3.5 h-3.5" />
              <span className="text-muted-foreground">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-4 text-xs uppercase tracking-widest hover:bg-black/90 transition-colors dark:bg-white dark:text-black dark:hover:bg-white/90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-4 text-muted-foreground">Or continue with</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleOAuthSignIn("google")}
            disabled={isLoading}
            className="border py-3 text-xs uppercase tracking-wider hover:border-foreground transition-colors disabled:opacity-50"
          >
            Google
          </button>
          <button
            onClick={() => handleOAuthSignIn("github")}
            disabled={isLoading}
            className="border py-3 text-xs uppercase tracking-wider hover:border-foreground transition-colors disabled:opacity-50"
          >
            GitHub
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline underline-offset-4 hover:text-foreground transition-colors">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
