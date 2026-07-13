import { createFileRoute } from "@tanstack/react-router";
import { StorePageShell } from "@/components/store/StorePageShell";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <StorePageShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">About Us</h1>
          <p className="mt-2 text-muted-foreground">
            Learn more about AutoForge Robotics and our mission.
          </p>
        </div>
        <div className="prose max-w-none text-sm text-muted-foreground space-y-4">
          <p>
            Welcome to AutoForge Robotics — India's one-stop shop for robotics, electronics, drones, 3D printing, and maker supplies.
          </p>
          <p>
            Our mission is to empower makers, students, researchers, and hobbyists with high-quality components and tools to bring their ideas to life.
          </p>
          <h3 className="text-lg font-bold text-foreground">Our Story</h3>
          <p>
            Founded with a passion for innovation, AutoForge Robotics started as a small project to provide affordable and reliable parts to the maker community. Today, we serve thousands of customers across India, from educational institutions to DIY enthusiasts.
          </p>
          <h3 className="text-lg font-bold text-foreground">What We Offer</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Development Boards & Microcontrollers</li>
            <li>Sensors & Modules</li>
            <li>Drone Parts & Accessories</li>
            <li>3D Printers & Filaments</li>
            <li>Motors, Drivers & Actuators</li>
            <li>IoT & Wireless Solutions</li>
            <li>DIY & Maker Kits</li>
          </ul>
        </div>
      </div>
    </StorePageShell>
  );
}
