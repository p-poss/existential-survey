import type { Metadata, Viewport } from "next";
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
        <div
          id="bg-root"
          className="fixed left-0 right-0 bottom-0 z-[-1] pointer-events-none"
          aria-hidden
          style={{
            // Start below the notch; fill remaining viewport
            top: 'env(safe-area-inset-top)',
            height: 'calc(100dvh - env(safe-area-inset-top))',
            width: '100vw',
            backgroundColor: '#63639C'
          }}
        />
        
        {children}
      </body>
    </html>
  );
}
