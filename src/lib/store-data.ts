import catDevBoards from "@/assets/cat-dev-boards.jpg";
import catDroneParts from "@/assets/cat-drone-parts.jpg";
import catBatteries from "@/assets/cat-batteries.jpg";
import cat3dPrinters from "@/assets/cat-3d-printers.jpg";
import catSensors from "@/assets/cat-sensors.jpg";
import catComponents from "@/assets/cat-components.jpg";
import catMotors from "@/assets/cat-motors.jpg";
import catModulesDisplays from "@/assets/cat-modules-displays.jpg";
import catIotWireless from "@/assets/cat-iot-wireless.jpg";
import catMechanicalTools from "@/assets/cat-mechanical-tools.jpg";
import catDiyKits from "@/assets/cat-diy-kits.jpg";
import catEvParts from "@/assets/cat-ev-parts.jpg";

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

import prodPrinter from "@/assets/prod-printer.jpg";
import prodAms from "@/assets/prod-ams.jpg";
import prodCarrier from "@/assets/prod-carrier.jpg";
import prodFpga from "@/assets/prod-fpga.jpg";
import prodLcdBoard from "@/assets/prod-lcd-board.jpg";
import prodCamera from "@/assets/prod-camera.jpg";
import prodLightSensor from "@/assets/prod-light-sensor.jpg";
import prodBreakout from "@/assets/prod-breakout.jpg";
import prodMiniBoard from "@/assets/prod-mini-board.jpg";
import prodMp3 from "@/assets/prod-mp3.jpg";
import prodDroneMotor from "@/assets/prod-drone-motor.jpg";

export interface Category {
  name: string;
  image: string;
}

export interface Product {
  name: string;
  sku: string;
  price: number;
  tag: string;
  image: string;
  reviews: number;
  outOfStock?: boolean;
  badge?: string;
}

export const heroBanners = [
  { image: hero1, alt: "AutoForge Robotics Innovation Challenge 2026" },
  { image: hero2, alt: "Mid Year 3D Printer Sale — up to 40% off" },
  { image: hero3, alt: "iDrive 16A Industrial DC Motor Driver now in stock" },
];

export const services = [
  { name: "PCB Manufacturing", emoji: "🟩" },
  { name: "3D Printing", emoji: "🖨️" },
  { name: "Laser Cutting", emoji: "🔦" },
  { name: "Custom Battery Pack", emoji: "🔋" },
];

export const categories: Category[] = [
  { name: "Development Boards", image: catDevBoards },
  { name: "Drone Parts", image: catDroneParts },
  { name: "Batteries, Power Supply and Accessories", image: catBatteries },
  { name: "3D Printers and Parts", image: cat3dPrinters },
  { name: "Sensors", image: catSensors },
  { name: "Electronic Components", image: catComponents },
  { name: "Motors | Drivers | Pumps | Actuators", image: catMotors },
  { name: "Electronic Modules and Displays", image: catModulesDisplays },
  { name: "IoT and Wireless Modules", image: catIotWireless },
  { name: "Mechanical Parts, Measurement & Workbench Tools", image: catMechanicalTools },
  { name: "DIY and Maker Kits", image: catDiyKits },
  { name: "Electric Vehicle Parts", image: catEvParts },
];

export const featuredProducts: Product[] = [
  {
    name: "ForgePrint S1 Enclosed 3D Printer",
    sku: "AF259948",
    price: 42999,
    tag: "3D Printers",
    image: prodPrinter,
    reviews: 0,
  },
  {
    name: "Refurbished - ForgeFil Lite Automatic Material System",
    sku: "AF259599",
    price: 24499,
    tag: "Refurbished",
    image: prodAms,
    reviews: 0,
    badge: "Refurbished",
  },
  {
    name: "AF Vision D115 AI Carrier Board - Edge AI Platform with 3x USB 3.2, Dual CSI-2, 2x GbE",
    sku: "AF258889",
    price: 18999,
    tag: "SBC & AI Boards",
    image: prodCarrier,
    reviews: 0,
  },
  {
    name: "ForgeLab 125-14 FPGA Education Pack",
    sku: "AF266320",
    price: 109990,
    tag: "FPGA Development Boards",
    image: prodFpga,
    reviews: 1,
  },
  {
    name: 'AF RP2350 1.54" IPS LCD Dev Board - 240x240, 65K Color, Touch | Dual-Core',
    sku: "AF264842",
    price: 1709,
    tag: "Microcontrollers",
    image: prodLcdBoard,
    reviews: 0,
    outOfStock: true,
  },
  {
    name: "AF 12MP Autofocus Camera Module - 120° FOV, Rolling Shutter | CSI Interface",
    sku: "AF264843",
    price: 3199,
    tag: "Cameras and Displays",
    image: prodCamera,
    reviews: 0,
    outOfStock: true,
  },
  {
    name: "AF7700 Ambient Light Sensor Module - Green Horizontal",
    sku: "AF263825",
    price: 289,
    tag: "Light Sensor Modules",
    image: prodLightSensor,
    reviews: 0,
  },
  {
    name: "AF2591 Digital Light Sensor Breakout Module with Interface - Purple",
    sku: "AF263796",
    price: 509,
    tag: "Breakout Boards",
    image: prodBreakout,
    reviews: 1,
    outOfStock: true,
  },
  {
    name: "AF328P Mini EVB Development Board - Pro Mini Compatible, 5V",
    sku: "AF263808",
    price: 129,
    tag: "Compatible Boards",
    image: prodMiniBoard,
    reviews: 0,
    outOfStock: true,
  },
  {
    name: "AF-HV20 MP3 Music Player Module with Screw Terminals",
    sku: "AF263836",
    price: 609,
    tag: "Audio Modules",
    image: prodMp3,
    reviews: 0,
  },
  {
    name: "ForgeWing X8 Heavy-Lift Drone Motor with 2270 Propeller CW",
    sku: "AF263085",
    price: 17909,
    tag: "Heavy-Lift Drone Motors",
    image: prodDroneMotor,
    reviews: 0,
    outOfStock: true,
  },
  {
    name: "ForgeWing X6-SE 280KV Motor and 2270 Propeller Combo Kit-CW",
    sku: "AF263081",
    price: 10159,
    tag: "Heavy-Lift Drone Motors",
    image: prodDroneMotor,
    reviews: 0,
    outOfStock: true,
  },
];

export const navLinks = [
  "Home",
  "Shop",
  "Forum",
  "Bulk Enquiry",
  "New Arrivals",
  "ATL Kits Enquiry",
  "Blogs",
  "BOM Tool",
  "Careers",
];

export function formatPrice(price: number | string | null | undefined) {
  const n = typeof price === "string" ? parseFloat(price) : (price ?? 0);
  return `₹ ${n.toFixed(2)}`;
}
