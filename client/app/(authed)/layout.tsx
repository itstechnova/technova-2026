import type { Metadata } from "next";

// Sign-in and dashboard pages shouldn't show up in search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
