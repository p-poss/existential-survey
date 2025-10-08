import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // React needs unsafe-eval for development
              "style-src 'self' 'unsafe-inline'", // Allow inline styles for 98.css and Tailwind
              "img-src 'self' data: https:", // Allow images from any HTTPS source
              "font-src 'self'",
              "connect-src 'self' https://zttbaeecujkyxkxkifqy.supabase.co https://api.resend.com", // Supabase and Resend APIs
              "object-src 'none'", // Block plugins
              "frame-src 'none'", // Block iframes
              "base-uri 'self'", // Restrict base tag
              "form-action 'self'", // Restrict form submissions
              "upgrade-insecure-requests" // Force HTTPS
            ].join('; ')
          },
        ],
      },
    ]
  },
};

export default nextConfig;
