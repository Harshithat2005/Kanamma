import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kannamma Mother — Maternal Health Operating System",
  description: "Comprehensive maternal healthcare platform with real-time monitoring, clinical tracking, and AI-powered risk assessment.",
};

export default function MotherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
