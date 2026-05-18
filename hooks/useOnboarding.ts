"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single();

      if (!profile?.onboarding_completed) {
        setShowOnboarding(true);
      }
      setLoading(false);
    };
    check();
  }, []);

  const completeOnboarding = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ onboarding_completed: true })
      .eq("id", user.id);
    setShowOnboarding(false);
  };

  return { showOnboarding, loading, completeOnboarding };
}