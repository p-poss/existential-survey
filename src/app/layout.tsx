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
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
        >
          <source src="https://poss.b-cdn.net/flower-test.mp4" type="video/mp4" />
        </video>
        {children}
      </body>
    </html>
  );
}
