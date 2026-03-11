import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const generalSans = localFont({
  src: "../public/fonts/GeneralSans-Variable.woff2",
  variable: "--font-general-sans",
  display: "swap",
  weight: "200 700",
});

export const metadata: Metadata = {
  title: "Sim Kaur | Creative Director",
  description:
    "Portfolio of Sim Kaur — Creative Director and Filmmaker crafting compelling visual narratives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${generalSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
