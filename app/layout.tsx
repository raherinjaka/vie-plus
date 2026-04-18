import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="bg-black text-white">
      <body className="min-h-screen bg-red-900">

        {children} 
        {/* On ne met rien d'autre ici pour l'instant */}
      </body>
    </html>
  );
}