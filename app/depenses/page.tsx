"use client";
import { useState, useEffect } from "react";
import { PlusCircle, MinusCircle, Trash2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { createClient } from '@supabase/supabase-js';

// Initialisation du client (Utilise tes vraies clés ici)
const supabase = createClient(
  'https://ykwcledsxlnqkkczcemt.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrd2NsZWRzeGxucWtrY3pjZW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NDcwOTgsImV4cCI6MjA5MTIyMzA5OH0.Q1H_DSVr_OSKepBPdnA8r9qk0rkLEqY0S5k5KsBmnTc'
);

export default function DepensePage() {
  const [budgetInitial, setBudgetInitial] = useState(0);
  const [mouvements, setMouvements] = useState<any[]>([]);
  const [nomSaisie, setNomSaisie] = useState("");
  const [montantSaisie, setMontantSaisie] = useState("");
  const [loading, setLoading] = useState(true);

  // --- CHARGEMENT DES DONNÉES DEPUIS SUPABASE ---
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Récupérer les mouvements
      const { data, error } = await supabase
        .from('mouvements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setMouvements(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  // --- ACTIONS ---
  const ajouterAction = async (type: "ajout" | "depense") => {
    if (!nomSaisie || !montantSaisie) return;

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
        return alert("Session expirée ou utilisateur non trouvé. Essaie de te reconnecter.");
      }

    const nouveauMouvement = {
      user_id: user.id,
      nom: nomSaisie,
      montant: Number(montantSaisie),
      type: type,
    };

    const { data, error } = await supabase
      .from('mouvements')
      .insert([nouveauMouvement])
      .select();

    if (error) {
      alert("Erreur: " + error.message);
    } else {
      setMouvements([data[0], ...mouvements]);
      setNomSaisie("");
      setMontantSaisie("");
    }
  };

  const supprimerAction = async (id: string) => {
    const { error } = await supabase.from('mouvements').delete().eq('id', id);
    if (!error) {
      setMouvements(mouvements.filter(m => m.id !== id));
    }
  };

  // --- CALCULS (Identiques) ---
  const totalAjouts = mouvements.filter(m => m.type === "ajout").reduce((acc, m) => acc + m.montant, 0);
  const totalDepenses = mouvements.filter(m => m.type === "depense").reduce((acc, m) => acc + m.montant, 0);
  const budgetTotal = budgetInitial + totalAjouts;
  const argentRestant = budgetTotal - totalDepenses;
  const pourcentage = budgetTotal > 0 ? (argentRestant / budgetTotal) * 100 : 0;

  const getProgressColor = (pct: number) => {
    if (pct <= 0) return "bg-purple-600 shadow-[0_0_15px_#a855f7]";
    if (pct < 20) return "bg-red-500 shadow-[0_0_15px_#ef4444]";
    if (pct < 50) return "bg-orange-500 shadow-[0_0_15px_#f97316]";
    return "bg-emerald-400 shadow-[0_0_15px_#34d399]";
  };

  return (
    <div className="flex h-screen w-full bg-black overflow-y-auto">
      <Sidebar />
      <div className="flex-1 min-h-screen p-6 lg:p-12 pt-24 pb-32">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* STATUT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Budget Fixe (Ar)</label>
              <input type="number" value={budgetInitial} onChange={(e) => setBudgetInitial(Number(e.target.value))} className="bg-transparent text-2xl font-black text-white outline-none w-full" />
            </div>
            <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900/40 border border-white/5">
              <div className="flex justify-between items-end mb-4">
                <span className="text-[10px] font-black uppercase text-slate-500">Progression</span>
                <span className="text-xl font-black text-white">{argentRestant.toLocaleString()} Ar restant</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${getProgressColor(pourcentage)}`} style={{ width: `${Math.max(0, Math.min(100, pourcentage))}%` }} />
              </div>
            </div>
          </div>

          {/* SAISIE */}
          <div className="p-8 rounded-[2.5rem] bg-slate-900/60 border border-white/5 backdrop-blur-3xl">
            <h3 className="text-white font-bold mb-6">Nouvelle opération</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="Ex: Cantine" value={nomSaisie} onChange={(e) => setNomSaisie(e.target.value)} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-500/50" />
              <input type="number" placeholder="Montant" value={montantSaisie} onChange={(e) => setMontantSaisie(e.target.value)} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-500/50" />
              <div className="flex gap-2">
                <button onClick={() => ajouterAction("depense")} className="flex-1 bg-red-500/10 text-red-500 rounded-2xl font-bold">Dépense</button>
                <button onClick={() => ajouterAction("ajout")} className="flex-1 bg-emerald-500/10 text-emerald-500 rounded-2xl font-bold">Ajout</button>
              </div>
            </div>
          </div>

          {/* LISTE */}
          <div className="space-y-4">
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Historique Cloud</h3>
            <div className="space-y-3">
              {mouvements.map((m) => (
                <div key={m.id} className="group flex items-center justify-between p-5 rounded-3xl bg-slate-900/40 border border-white/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${m.type === "depense" ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"}`}>
                      {m.type === "depense" ? <MinusCircle size={20} /> : <PlusCircle size={20} />}
                    </div>
                    <div>
                      <p className="text-white font-bold">{m.nom}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{new Date(m.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <p className={`text-lg font-black ${m.type === "depense" ? "text-red-400" : "text-emerald-400"}`}>
                      {m.type === "depense" ? "-" : "+"}{m.montant.toLocaleString()} Ar
                    </p>
                    <button onClick={() => supprimerAction(m.id)} className="text-slate-600 hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}