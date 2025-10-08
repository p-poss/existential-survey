import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "98.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anonymous Survey", 
  description: "A design research experiment exploring anonymous existential thoughts",
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const msSans = localFont({
  src: [
    { path: "../../public/fonts/ms-sans-serif/ms_sans_serif.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/ms-sans-serif/ms_sans_serif_bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-ms-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload removed - shut_down.png is only used in About menu */}
      </head>
      <body className={msSans.variable}>
        <div
          id="bg-root"
          className="fixed left-0 right-0 bottom-0 z-0 pointer-events-none"
          aria-hidden
          style={{
            // Start below the notch; fill remaining viewport
            top: 'env(safe-area-inset-top)',
            height: 'calc(100dvh - env(safe-area-inset-top))',
            width: '100vw',
            backgroundColor: '#008080'
          }}
        />
        
        {children}
      </body>
    </html>
  );
}
