"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js';

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Pour l'effet de chargement
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const supabase = createClient(
    'https://ykwcledsxlnqkkczcemt.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrd2NsZWRzeGxucWtrY3pjZW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NDcwOTgsImV4cCI6MjA5MTIyMzA5OH0.Q1H_DSVr_OSKepBPdnA8r9qk0rkLEqY0S5k5KsBmnTc'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isLogin) {
      // CONNEXION - On utilise formData.username comme email
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.username, 
        password: formData.password,
      });
      if (error) alert("Erreur de connexion : " + error.message);
      else router.push('/dashboard');
    } else {
      // INSCRIPTION
      const { error } = await supabase.auth.signUp({
        email: formData.username,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }
      });
      if (error) alert("Erreur d'inscription : " + error.message);
      else alert("Succès ! Vérifie ta boîte mail (et tes spams) pour confirmer.");
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) alert(error.message);
  };
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-10 px-6 bg-black">
      {/* EFFETS DE FOND ANIMÉS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]"
        />
      </div>

      <div className="max-w-[450px] w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-cyan-500/10 rounded-3xl blur-xl opacity-50" />
          
          <div className="relative bg-slate-950/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl">
            
            {/* EN-TÊTE STYLISÉ VIE+ */}
            <div className="mb-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-cyan-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </motion.div>
              
              <h2 className="text-white text-4xl font-black mb-3 italic">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  Vie
                </span>
                <span className="text-white">+</span>
              </h2>
              <p className="text-slate-400 text-sm">
                {isLoading ? "Authentification en cours..." : (isLogin ? "Heureux de vous revoir !" : "Créez votre compte étudiant")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* NOM D'UTILISATEUR */}
              <div className="relative group">
                <input 
                  required 
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-transparent border-none outline-none py-2 text-white text-lg relative z-10 peer"
                />
                <span className="absolute left-0 top-2 text-slate-500 transition-all duration-500 pointer-events-none peer-focus:-translate-y-7 peer-focus:text-cyan-400 peer-focus:text-sm peer-valid:-translate-y-7 peer-valid:text-cyan-400 peer-valid:text-sm">
                  Utilisateur
                </span>
                <i className="absolute left-0 bottom-0 w-full h-[2px] bg-cyan-500 rounded-t-lg transition-all duration-500 pointer-events-none peer-focus:h-[44px] peer-valid:h-[44px] opacity-80" />
              </div>

              {/* MOT DE PASSE */}
              <div className="relative group">
                <input 
                  required 
                  type={showPassword ? "text" : "password"} 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-transparent border-none outline-none py-2 text-white text-lg relative z-10 peer"
                />
                <span className="absolute left-0 top-2 text-slate-500 transition-all duration-500 pointer-events-none peer-focus:-translate-y-7 peer-focus:text-cyan-400 peer-focus:text-sm peer-valid:-translate-y-7 peer-valid:text-cyan-400 peer-valid:text-sm">
                  Mot de passe
                </span>
                
                <div 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 z-30 cursor-pointer text-white/50 hover:text-white"
                >
                  {formData.password.length > 0 && (showPassword ? "👁️" : "🙈")}
                </div>

                <i className="absolute left-0 bottom-0 w-full h-[2px] bg-cyan-500 rounded-t-lg transition-all duration-500 pointer-events-none peer-focus:h-[44px] peer-valid:h-[44px] opacity-80" />
              </div>

              {/* BOUTON ACTION */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                type="submit"
                className={`group relative w-full py-4 text-white font-bold text-lg rounded-xl overflow-hidden transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20'}`}
              >
                <span className="relative z-10">
                  {isLoading ? "CHARGEMENT..." : (isLogin ? "SE CONNECTER" : "S'INSCRIRE")}
                </span>
                {!isLoading && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
              </motion.button>
            </form>

            {/* SWITCH LOGIN/REGISTER */}
            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-slate-400 text-sm hover:text-cyan-400 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLogin ? "Pas de compte ? Créer un profil" : "Déjà inscrit ? Se connecter"}
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}