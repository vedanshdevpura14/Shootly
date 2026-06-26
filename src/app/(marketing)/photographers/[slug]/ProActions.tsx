"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MessageCircle, CalendarCheck, Send, CreditCard } from "lucide-react";
import EnquireModal from "@/components/EnquireModal";
import ManualPaymentModal from "@/components/ManualPaymentModal";
import { Professional } from "@/types/photographer";

interface ProActionsProps {
  professional: Professional;
}

export default function ProActions({ professional }: ProActionsProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isEnquireOpen, setIsEnquireOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  
  const handleEnquire = () => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${window.location.pathname}`);
      return;
    }
    setIsEnquireOpen(true);
  };

  const handlePayBook = () => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${window.location.pathname}`);
      return;
    }
    setIsPaymentOpen(true);
  };

  const handleChat = () => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${window.location.pathname}`);
      return;
    }
    alert(`💬 Chat with ${professional.name} coming soon!`);
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <button 
          onClick={handleChat}
          className="flex-1 md:flex-none px-6 py-3 border border-white/20 rounded-full text-sm font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Chat
        </button>
        
        <button 
          onClick={handleEnquire}
          className="flex-1 md:flex-none px-6 py-3 bg-white text-zinc-900 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Enquire
        </button>

        <button 
          onClick={handlePayBook}
          className="flex-1 md:flex-none px-6 py-3 bg-amber-600 rounded-full text-sm font-medium hover:bg-amber-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20"
        >
          <CreditCard className="w-4 h-4" />
          Pay & Book
        </button>
      </div>

      {/* Modals */}
      {isEnquireOpen && (
        <EnquireModal 
          professional={professional} 
          isOpen={isEnquireOpen} 
          onClose={() => setIsEnquireOpen(false)} 
        />
      )}

      {isPaymentOpen && (
        <ManualPaymentModal 
          professional={professional} 
          isOpen={isPaymentOpen} 
          onClose={() => setIsPaymentOpen(false)} 
        />
      )}
    </>
  );
}