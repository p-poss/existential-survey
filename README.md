This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Email Functionality Setup

To enable the email functionality for survey answers:

1. **Sign up for Resend** at [https://resend.com](https://resend.com)
2. **Get your API key** from the Resend dashboard
3. **Create a `.env.local` file** in your project root with:
   ```
   RESEND_API_KEY=re_e58MMbj3_7vH99FadtbTTCCUGvkrMAtkp
   FROM_EMAIL=noreply@isthis.life
   ```
4. **Verify your domain** in Resend:
   - Go to [resend.com/domains](https://resend.com/domains)
   - Add domain: `isthis.life`
   - Follow DNS verification steps
   - Or temporarily use: `onboarding@resend.dev` for testing

The email functionality allows users to receive a copy of their survey answers after completion.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
