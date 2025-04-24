"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function NewsletterForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="relative">
        <input
          type="email"
          placeholder="Your email"
          className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button 
          size="icon"
          className="absolute right-1 top-1"
          type="submit"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}