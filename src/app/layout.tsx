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
          <div className="relative w-[100vw] h-[100dvh]">
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
        {/* Fill the iOS Safari notch/status bar area with a solid color when video can't reach */}
        <div
          aria-hidden
          className="fixed left-0 right-0 z-[1] pointer-events-none"
          style={{
            top: 0,
            height: 'env(safe-area-inset-top)',
            background: '#626262',
          }}
        />
        {children}
      </body>
    </html>
  );
}
