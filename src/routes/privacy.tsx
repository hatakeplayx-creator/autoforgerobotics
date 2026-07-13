import { createFileRoute } from "@tanstack/react-router";
import { StorePageShell } from "@/components/store/StorePageShell";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <StorePageShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Privacy Policy</h1>
          <p className="mt-2 text-muted-foreground">
            Last updated: July 2026
          </p>
        </div>
        <div className="prose max-w-none text-sm text-muted-foreground space-y-4">
          <section>
            <h2 className="text-xl font-bold text-foreground">1. Introduction</h2>
            <p>
              Welcome to AutoForge Robotics. We respect your privacy and are committed to protecting your personal data.
              This privacy policy will inform you about how we look after your personal data when you visit our website.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground">2. Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Personal identification information (Name, email address, phone number, etc.)</li>
              <li>Payment information</li>
              <li>Billing and delivery address</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground">3. How We Use Your Information</h2>
            <p>We use the information we collect in various ways, including to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>To provide and maintain our service</li>
              <li>To process your orders and payments</li>
              <li>To communicate with you about your orders</li>
              <li>To improve our website and services</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground">3. Data Security</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet is 100% secure.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground">4. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us.</p>
          </section>
        </div>
      </div>
    </StorePageShell>
  );
}
