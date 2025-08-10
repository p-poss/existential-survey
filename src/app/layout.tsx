import type { Metadata, Viewport } from "next";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anonymous Survey", 
  description: "A design research experiment exploring anonymous existential thoughts",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div id="bg-root" className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
          <div
            className="relative w-[100vw]"
            style={{
              // Extend behind iOS Safari notch: move up by safe-area and increase height
              marginTop: 'calc(-1 * env(safe-area-inset-top))',
              height: 'calc(100dvh + env(safe-area-inset-top))',
            }}
          >
            <Image
              src="/bg.jpg"
              alt=""
              fill
              priority
              loading="eager"
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
        
        {children}
      </body>
    </html>
  );
}
