import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning> {/* Ajoute suppressHydrationWarning ici */}
      <body>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}