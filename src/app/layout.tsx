import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthContextProvider } from "./context/AuthContext";
import { CSPostHogProvider } from "./providers/posthog";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WashMyT",
  description: "The Premier Mobile Tesla Car Wash Service",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <CSPostHogProvider>
        <AuthContextProvider>
          <body className={inter.className}>{children}</body>
        </AuthContextProvider>
      </CSPostHogProvider>
    </html>
  );
}
