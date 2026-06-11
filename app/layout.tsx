//app/layout.tsx
import './globals.css';
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="bg-black text-white" suppressHydrationWarning>
      <body className="min-h-screen bg-[#080c12]">
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}