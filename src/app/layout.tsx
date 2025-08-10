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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          className="fixed inset-0 w-[100vw] h-[100dvh] object-cover z-0 pointer-events-none"
        >
          <source src="https://poss.b-cdn.net/flower-test.mp4" type="video/mp4" />
        </video>
        {children}
      </body>
    </html>
  );
}
