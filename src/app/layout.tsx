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
          className="fixed inset-0 z-0 pointer-events-none os8-pattern"
          aria-hidden
          style={{
            // Extend behind iOS Safari notch: move up by safe-area and increase height
            marginTop: 'calc(-1 * env(safe-area-inset-top))',
            height: 'calc(100dvh + env(safe-area-inset-top))',
            width: '100vw'
          }}
        />
        
        {children}
      </body>
    </html>
  );
}
