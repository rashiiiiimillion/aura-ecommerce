"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { registerUser } from "@/actions/auth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await registerUser({ name, email, password });

      if ("success" in result && result.success) {
        toast.success("Account created successfully");
        const signInResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (signInResult?.ok) {
          router.push("/");
          router.refresh();
        }
      } else {
        toast.error("error" in result ? result.error : "Registration failed");
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
      await signIn(provider, { callbackUrl: "/" });
    } catch {
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-outfit font-light tracking-tight mb-2">Create Account</h1>
          <p className="text-muted-foreground text-sm">Join Aura for an exclusive shopping experience</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="register-name" className="block text-xs uppercase tracking-wider mb-2">Full Name</label>
            <input id="register-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} className="w-full border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground transition-colors disabled:opacity-50" placeholder="Your full name" />
          </div>
          <div>
            <label htmlFor="register-email" className="block text-xs uppercase tracking-wider mb-2">Email</label>
            <input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className="w-full border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground transition-colors disabled:opacity-50" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="register-password" className="block text-xs uppercase tracking-wider mb-2">Password</label>
            <input id="register-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} disabled={isLoading} className="w-full border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground transition-colors disabled:opacity-50" placeholder="Minimum 8 characters" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-black text-white py-4 text-xs uppercase tracking-widest hover:bg-black/90 transition-colors dark:bg-white dark:text-black dark:hover:bg-white/90 disabled:opacity-50 flex items-center justify-center gap-2">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Create Account"
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
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-foreground transition-colors">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
