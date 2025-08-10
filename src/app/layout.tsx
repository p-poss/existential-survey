import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anonymous Survey", 
  description: "A design research experiment exploring anonymous existential thoughts",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#626262" },
    { media: "(prefers-color-scheme: dark)", color: "#626262" },
  ],
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
