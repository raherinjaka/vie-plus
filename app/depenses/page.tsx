"use client";
import { useState, useEffect } from "react";
import { PlusCircle, MinusCircle, Wallet, Calendar, Trash2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function DepensePage() {
  // --- ÉTATS ---
  const [budgetInitial, setBudgetInitial] = useState(0);
  const [periode, setPeriode] = useState("Semaine");
  const [mouvements, setMouvements] = useState<any[]>([]); // Liste mixte (ajouts et dépenses)

  // Champs de saisie
  const [nomSaisie, setNomSaisie] = useState("");
  const [montantSaisie, setMontantSaisie] = useState("");

  // --- PERSISTANCE (LocalStorage) ---
  useEffect(() => {
    const saved = localStorage.getItem("vieplus_budget");
    if (saved) {
      const parsed = JSON.parse(saved);
      setBudgetInitial(parsed.budgetInitial);
      setMouvements(parsed.mouvements);
      setPeriode(parsed.periode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("vieplus_budget", JSON.stringify({ budgetInitial, mouvements, periode }));
  }, [budgetInitial, mouvements, periode]);

  // --- ACTIONS ---
  const ajouterAction = (type: "ajout" | "depense") => {
    if (!nomSaisie || !montantSaisie) return;
    
    const nouveau = {
      id: Date.now(),
      nom: nomSaisie,
      montant: Number(montantSaisie),
      type: type,
      heure: new Date().toLocaleString('fr-FR', { day: '2-digit', month: 'short' }) + " à " + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setMouvements([nouveau, ...mouvements]);
    setNomSaisie("");
    setMontantSaisie("");
  };

  // --- CALCULS ---
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
          
          {/* CONFIGURATION & STATUT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Budget Initial (Ar)</label>
              <input type="number" value={budgetInitial} onChange={(e) => setBudgetInitial(Number(e.target.value))} className="bg-transparent text-2xl font-black text-white outline-none w-full" />
            </div>
            <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900/40 border border-white/5">
                <div className="flex justify-between items-end mb-4">
                    <span className="text-[10px] font-black uppercase text-slate-500">Progression du budget</span>
                    <span className="text-xl font-black text-white">{argentRestant.toLocaleString()} Ar restant</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${getProgressColor(pourcentage)}`} style={{ width: `${Math.max(0, Math.min(100, pourcentage))}%` }} />
                </div>
            </div>
          </div>

          {/* FORMULAIRE DE SAISIE */}
          <div className="p-8 rounded-[2.5rem] bg-slate-900/60 border border-white/5 backdrop-blur-3xl">
            <h3 className="text-white font-bold mb-6">Nouvelle opération</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="Ex: Acheter un jus" value={nomSaisie} onChange={(e) => setNomSaisie(e.target.value)} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-500/50" />
              <input type="number" placeholder="Montant (Ar)" value={montantSaisie} onChange={(e) => setMontantSaisie(e.target.value)} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-500/50" />
              <div className="flex gap-2">
                <button onClick={() => ajouterAction("depense")} className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-2xl font-bold transition-all">Dépense</button>
                <button onClick={() => ajouterAction("ajout")} className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-500 rounded-2xl font-bold transition-all">Ajout</button>
              </div>
            </div>
          </div>

          {/* LISTE DES OPÉRATIONS */}
          <div className="space-y-4">
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-2">Historique des opérations</h3>
            <div className="space-y-3">
              {mouvements.length === 0 && <p className="text-slate-600 italic p-8 text-center border border-dashed border-white/5 rounded-3xl">Aucune opération enregistrée</p>}
              {mouvements.map((m) => (
                <div key={m.id} className="group flex items-center justify-between p-5 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${m.type === "depense" ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"}`}>
                      {m.type === "depense" ? <MinusCircle size={20} /> : <PlusCircle size={20} />}
                    </div>
                    <div>
                      <p className="text-white font-bold">{m.nom}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-medium">{m.heure}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <p className={`text-lg font-black ${m.type === "depense" ? "text-red-400" : "text-emerald-400"}`}>
                      {m.type === "depense" ? "-" : "+"}{m.montant.toLocaleString()} Ar
                    </p>
                    <button onClick={() => setMouvements(mouvements.filter(x => x.id !== m.id))} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-500 transition-all">
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