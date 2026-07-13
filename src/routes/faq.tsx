import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { StorePageShell } from "@/components/store/StorePageShell";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export const Route = createFileRoute("/faq")({
  component: FAQPage,
});

function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "How do I place an order?",
      answer: "You can place an order by adding items to your cart, proceeding to checkout, and completing the payment process.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and wallets.",
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping usually takes 3-7 business days depending on your location and product availability.",
    },
    {
      question: "Can I track my order?",
      answer: "Yes! Once your order is shipped, you will receive a tracking number via email and SMS.",
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 7 days of delivery for most products. Please refer to our Returns Policy for details.",
    },
    {
      question: "Do you offer COD (Cash on Delivery)?",
      answer: "Yes, we offer COD on selected products and locations.",
    },
  ];

  return (
    <StorePageShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Frequently Asked Questions</h1>
          <p className="mt-2 text-muted-foreground">
            Find answers to common questions about our products and services.
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between"
              >
                <span className="font-semibold text-foreground">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-sm text-muted-foreground">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </StorePageShell>
  );
}
