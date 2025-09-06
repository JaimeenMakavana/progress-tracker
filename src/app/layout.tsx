import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TrackersProvider } from "../context/TrackersContext";
import { TransactionsProvider } from "../context/TransactionsContext";
import { Navigation } from "../components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Progress Tracker",
  description: "Track your learning, projects, and goals with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TrackersProvider>
          <TransactionsProvider>
            <Navigation />
            {children}
          </TransactionsProvider>
        </TrackersProvider>
      </body>
    </html>
  );
}
