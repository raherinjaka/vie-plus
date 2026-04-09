"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-black min-h-screen font-sans selection:bg-cyan-500 selection:text-white overflow-hidden">
      {/* NAVIGATION BAR */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <h1 className="text-white text-2xl font-black italic tracking-tighter">
            VIE<span className="text-cyan-400">+</span>
          </h1>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => router.push('/login')}
            className="text-slate-400 hover:text-white text-sm font-bold transition-colors uppercase tracking-widest px-4 py-2"
          >
            Se connecter
          </button>
          <button 
            onClick={() => router.push('/register')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-black px-6 py-2.5 rounded-full shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform uppercase tracking-[0.15em]"
          >
            S'inscrire
          </button>
        </div>
      </nav>

      {/* MAIN HERO SECTION */}
      <main className="relative flex flex-col items-center justify-center min-h-screen pt-20">
        {/* EFFET DE FOND (HALO CYAN) */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute w-[500px] h-[500px] bg-cyan-500 rounded-full blur-[160px] pointer-events-none"
        />

        <div className="relative z-10 text-center px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-5xl md:text-7xl font-black mb-6 tracking-tighter"
          >
            L'ÉNERGIE <br /> 
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
              OPTIMISÉE.
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 text-lg max-w-lg mx-auto mb-10 leading-relaxed"
          >
            La plateforme nouvelle génération pour gérer votre quotidien avec l'efficacité de <span className="text-white font-bold">Vie+</span>.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/register')}
            className="px-10 py-5 bg-white text-black font-black rounded-2xl text-lg hover:bg-cyan-400 transition-colors uppercase tracking-tighter"
          >
            Commencer l'aventure
          </motion.button>
        </div>
      </main>

      {/* FOOTER DISCRET */}
      <footer className="absolute bottom-6 w-full text-center">
        <p className="text-slate-600 text-[10px] uppercase tracking-[0.4em]">© 2026 Vie+ Project — Licence 2</p>
      </footer>
    </div>
  );
}