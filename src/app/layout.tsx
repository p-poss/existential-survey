import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anonymous Survey", 
  description: "A design research experiment exploring anonymous existential thoughts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
