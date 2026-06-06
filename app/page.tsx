"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import LandingNavbar from "@/components/landing/Navbar";

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-cyan-400">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Gestion intelligente",
    desc: "Organisez votre quotidien avec des outils pensés pour aller droit au but. Moins de friction, plus d'impact.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-cyan-400">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    title: "Suivi en temps réel",
    desc: "Visualisez vos progrès jour après jour. Des tableaux de bord clairs qui vous donnent le contrôle.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-cyan-400">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Privé par défaut",
    desc: "Vos données vous appartiennent. Aucune publicité, aucun tracking. Juste vous et vos objectifs.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-cyan-400">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Collaboratif",
    desc: "Invitez votre entourage, partagez vos avancées et avancez ensemble vers ce qui compte vraiment.",
  },
];


const steps = [
  {
    num: "01",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-cyan-400">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "Créez votre compte",
    desc: "Inscription gratuite en moins de 30 secondes. Pas de carte bancaire requise."
  },
  {
    num: "02",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-cyan-400">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "Définissez vos objectifs",
    desc: "Renseignez vos priorités et laissez Vie+ structurer votre parcours."
  },
  {
    num: "03",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-cyan-400">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
      </svg>
    ),
    title: "Avancez chaque jour",
    desc: "Suivez vos habitudes, célébrez vos victoires et ajustez en continu."
  },
];

const faqs = [
  { q: "Vie+ est-il gratuit ?", a: "L'accès de base est entièrement gratuit. Un plan Pro est disponible pour les fonctionnalités avancées." },
  { q: "Mes données sont-elles en sécurité ?", a: "Oui. Toutes vos données sont chiffrées et hébergées en Europe. Nous ne revendons rien." },
  { q: "Puis-je annuler à tout moment ?", a: "Absolument. Aucun engagement, aucune condition. Vous partez quand vous voulez." },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-black min-h-screen font-sans selection:bg-cyan-500 selection:text-white">

      {/* ── NAV ── */}
      <LandingNavbar />

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen pt-20 px-6 text-center overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute w-[600px] h-[600px] bg-cyan-500 rounded-full blur-[180px] pointer-events-none"
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-bold px-4 py-1.5 rounded-full mb-8 tracking-widest uppercase"
          >
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            Nouvelle génération
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none"
          >
            Reprenez le contrôle
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              de votre énergie.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-slate-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Vie+ est la plateforme qui centralise vos objectifs, vos habitudes et vos progrès — pour que chaque journée compte vraiment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button
              onClick={() => router.push('/register')}
              className="px-8 py-4 bg-white text-black font-black rounded-2xl text-base hover:bg-cyan-400 transition-colors tracking-tight"
            >
              Commencer gratuitement
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-8 py-4 border border-white/10 text-white font-semibold rounded-2xl text-base hover:border-white/30 transition-colors"
            >
              Se connecter →
            </button>
          </motion.div>

          <p className="text-slate-600 text-xs mt-6">Aucune carte bancaire · Gratuit pour toujours sur le plan de base</p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 flex flex-col items-center gap-1 text-slate-600"
        >
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-slate-600" />
          <span className="text-[10px] tracking-widest uppercase">Découvrir</span>
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section id="fonctionnalites" className="py-32 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">Fonctionnalités</p>
          <h3 className="text-white text-4xl md:text-5xl font-black tracking-tighter">
            Tout ce dont vous avez besoin,<br />
            <span className="text-slate-500">rien de superflu.</span>
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-black p-10 hover:bg-white/[0.02] transition-colors group"
            >
              <div className="mb-5 w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">{f.icon}</div>
              <h4 className="text-white text-xl font-bold mb-3 tracking-tight group-hover:text-cyan-400 transition-colors">{f.title}</h4>
              <p className="text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="comment" className="py-32 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">Comment ça marche</p>
            <h3 className="text-white text-4xl md:text-5xl font-black tracking-tighter">
              Démarrez en 3 étapes.
            </h3>
          </div>
          <div className="space-y-px">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-8 items-start p-8 border border-white/5 rounded-2xl hover:border-cyan-500/20 hover:bg-cyan-500/[0.02] transition-all group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/5 flex items-center justify-center transition-all mt-1">
                  {s.icon}
                </div>
                <div>
                  <h4 className="text-white text-xl font-bold mb-2 tracking-tight">{s.title}</h4>
                  <p className="text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-32 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto relative rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-16 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />
          <h3 className="text-white text-4xl md:text-5xl font-black tracking-tighter mb-4 relative z-10">
            Prêt à changer de rythme ?
          </h3>
          <p className="text-slate-400 text-lg mb-10 relative z-10">
            Rejoignez les personnes qui ont décidé de reprendre le contrôle.
          </p>
          <button
            onClick={() => router.push('/register')}
            className="relative z-10 px-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black rounded-2xl text-base transition-colors tracking-tight"
          >
            Créer mon compte — c'est gratuit
          </button>
        </motion.div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">FAQ</p>
            <h3 className="text-white text-4xl font-black tracking-tighter">Questions fréquentes.</h3>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
              >
                <p className="text-white font-bold mb-2">{faq.q}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-2">

              <h2 className="text-white text-2xl font-black italic tracking-tighter mb-3">
                VIE<span className="text-cyan-400">+</span>
              </h2>

              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                La plateforme nouvelle génération pour reprendre le contrôle de votre quotidien.
              </p>

              <p className="text-slate-600 text-xs mt-4 inline-flex items-center gap-1.5">
                Fait avec
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-rose-500/60">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                · Madagascar 🇲🇬
              </p>

            </div>

            {/* Produit */}
            <div>
              <p className="text-white text-xs font-bold tracking-widest uppercase mb-5">Produit</p>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#fonctionnalites" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#comment" className="hover:text-white transition-colors">Comment ça marche</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><button onClick={() => router.push('/register')} className="hover:text-white transition-colors">S'inscrire</button></li>
              </ul>
            </div>

            {/* Légal */}
            <div>
              <p className="text-white text-xs font-bold tracking-widest uppercase mb-5">Légal</p>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mentions légales</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-xs">© 2026 Vie+ Project — Tous droits réservés</p>
            <p className="text-slate-600 text-xs tracking-widest uppercase">Licence 2 · Version 1.0</p>
          </div>
        </div>
      </footer>

    </div>
  );
}