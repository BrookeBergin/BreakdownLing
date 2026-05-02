import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import NavBar from "./components/NavBar";
import { AuthProvider } from "./lib/auth-context";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const inter = Inter({ subsets: ["latin"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Breakdown Ling",
  description: "Breakdown and discuss linguistics research",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${mono.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
        <NavBar />
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}
