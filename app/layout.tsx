import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DashboardLayout from "./components/layout/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "ExpertFlow",
  description: "Connect with verified experts instantly. Solve technical bottlenecks with sub-100ms latency and enterprise-grade security.",
  keywords: ["Technical Support", "Real-time Chat", "Developer Mentorship", "Code Debugging"],
  authors: [{ name: "Tembogs" }],
  openGraph: {
    title: "ExpertFlow | Professional Support in Real-Time",
    description: "The infrastructure for high-stakes technical troubleshooting.",
    url: "chatroom-xi-lac.vercel.app", 
    siteName: "ExpertFlow",
    images: [
      {
        url: "/og-image.png",// Put a screenshot of your site in the /public folder
        width: 1200,
        height: 630,
        alt: "ExpertFlow Platform Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ExpertFlow | Solve Code Faster",
    description: "Connect with experts in real-time. No lag, just solutions.",
      images: ["/og-image.png"], 
  }
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
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </body>
    </html>
  );
}

// export const metadata: Metadata = {
//  
// };