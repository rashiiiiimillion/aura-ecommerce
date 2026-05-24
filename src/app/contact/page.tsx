"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent. We'll be in touch shortly.");
    setName(""); setEmail(""); setMessage("");
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-outfit font-light tracking-tight">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-light">Our client services team is available to assist you with any inquiry.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-xl font-outfit font-light tracking-tight mb-8">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="contact-name" className="block text-xs uppercase tracking-wider mb-2">Name</label>
                <input id="contact-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground transition-colors" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs uppercase tracking-wider mb-2">Email</label>
                <input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground transition-colors" placeholder="you@example.com" />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-xs uppercase tracking-wider mb-2">Message</label>
                <textarea id="contact-message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required className="w-full border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground transition-colors resize-none" placeholder="How can we help?" />
              </div>
              <button type="submit" className="bg-black text-white px-8 py-4 text-xs uppercase tracking-widest hover:bg-black/90 transition-colors inline-flex items-center gap-2 dark:bg-white dark:text-black dark:hover:bg-white/90">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <h2 className="text-xl font-outfit font-light tracking-tight mb-8">Client Services</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium mb-1">Email</h3>
                  <p className="text-sm text-muted-foreground">concierge@aura.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium mb-1">Phone</h3>
                  <p className="text-sm text-muted-foreground">+1 (800) AURA-LUX</p>
                  <p className="text-xs text-muted-foreground mt-1">Mon–Fri, 9am–6pm EST</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium mb-1">Flagship</h3>
                  <p className="text-sm text-muted-foreground">520 Madison Avenue<br />New York, NY 10022</p>
                </div>
              </div>
            </div>
            <div className="border-t pt-8 mt-8">
              <h3 className="text-sm font-medium uppercase tracking-wider mb-2">Hours</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Monday – Friday: 10am – 7pm</p>
                <p>Saturday: 11am – 6pm</p>
                <p>Sunday: 12pm – 5pm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
