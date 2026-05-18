// lib/translations.ts
export const translations = {
  fr: {
    nav: {
      dashboard: "Vue d'ensemble",
      money: "Mes Finances",
      tasks: "Productivité",
      goals: "Objectifs & Épargne",
      about: "Informations",
      settings: "Paramètres",
      logging_out: "Déconnexion...",
      connected: "Session active",

      menu:        "Menu",
      open:        "Ouvrir la navigation",
      connectedAs: "Connecté en tant que",
      defaultUser: "Utilisateur",
      pagesLabel:  "Pages",
      active:      "Actif",
      logout:      "Se déconnecter",
      loggingOut:  "Déconnexion…",
      status:      "Système optimal",
      items: {
        dashboard: "Tableau de bord",
        budget:    "Mon argent",
        tasks:     "Mes tâches",
        goals:     "Objectifs",
        about:     "À propos",
      },
    },

//*************DashBoard FR*********************************** */  
    dashboard: {
      loading: "Analyse des flux...",
      welcome: "Ravi de vous revoir,",
      categories: {
        general: "Général",
        food: "Alimentation",
        transport: "Transport",
        leisure: "Loisirs",
        health: "Santé",
        education: "Éducation"
      },
      greetings: {
        night:     "Bonne nuit",
        morning:   "Bonjour",
        afternoon: "Bon après-midi",
        evening:   "Bonsoir",
      },
      mood: {
        empty:    "Budget épuisé",
        critical: "Attention !",
        warning:  "Surveille tes dépenses",
        good:     "Tout va bien !",
      },
      balance: "Solde disponible",
    },
    
    activity: {
      title: "Audit des flux",
      live: "En direct",
      empty_title: "Historique vierge",
      empty_sub: "Vos opérations financières apparaîtront ici",
      view_all: "Consulter l'historique complet",
      time: {
        now: "À l'instant",
        mins: "Il y a {n} min",
        hours: "Il y a {n}h",
        yesterday: "Hier",
        days: "Il y a {n} jours"
      }
    },

    budget: {
      title: "Analyse budgétaire",
      view_all: "Détails",
      remaining: "Disponibilité",
      total: "Allocation",
      spent: "Consommé",
      cycle_until: "Cycle actif jusqu'au {date}",
      top_categories: "Postes de dépenses",
      locked: "Budget sécurisé",
      unconfigured: {
        title: "Planification inactive",
        sub: "Définissez vos plafonds pour activer le monitoring",
        button: "Initialiser"
      }
    },

    objectives: {
      title:             "Objectifs",
      seeAll:            "Voir tout",
      globalScore:       "Score global",
      empty:             "Aucun objectif",
      add:               "Ajouter un objectif",
      completedSingular: "1 objectif accompli",
      completedPlural:   "{n} objectifs accomplis",
    },

    stats: {
      notConfigured: "Non configuré",
      balance: {
        label: "Solde restant",
        sub:   "Budget actuel",
      },
      expenses: {
        label: "Total dépensé",
        sub:   "Ce cycle",
      },
      objectives: {
        label: "Score objectifs",
        sub:   "Progression globale",
      },
      tasks: {
        label:    "Tâches complétées",
        subPct:   "{pct}% du total",
        subEmpty: "Page en cours",
      },
    },
  // *********************************************************
    
    settings: {
      title:    "Paramètres",
      theme:    "Thème",
      language: "Langue",
      back:     "Retour",
      dark:     "Sombre",
      light:    "Clair",
    },

    // depenses *****************************************
    toast: {
      error:   "Erreur",
      success: "Succès",
    },
    depensePage: {
      title:      "Mon budget",
      subtitle:   "Budget tracker",
      emptyState: "Configure ton budget pour commencer…",
      errors: {
        loadFail:   "Erreur de chargement.",
        saveFail:   "Erreur : {msg}",
        deleteFail: "Suppression impossible.",
      },
      success: {
        cycleStarted: "Cycle démarré avec succès !",
        cycleReset:   "Cycle réinitialisé. Prêt pour un nouveau départ !",
        expenseAdded: "Dépense enregistrée ✓",
        incomeAdded:  "Ajout enregistré ✓",
        deleted:      "Opération supprimée.",
      },
    },

    // Budgethead ***********************************
    budgetHeader: {
      locked:   "Budget verrouillé",
      cycleOver: "Cycle terminé !",
      endsOn:   "Fin le {date}",
      newCycle: "Nouveau cycle",
      urgency:  "Dernières heures !",
      timeLeft: "Temps restant",
      pctLeft:  "{pct}% du temps restant",
      periode: {
        days:   "{n} jour",    // pluriel géré côté composant avec l'ancien système
        weeks:  "{n} semaine",
        months: "{n} mois",
      },
      countdown: {
        days:  "Jours",
        hours: "Heures",
        mins:  "Mins",
        secs:  "Secs",
      },
      resetModal: {
        title:       "Réinitialiser le cycle ?",
        description: "Toutes les opérations seront supprimées et tu pourras démarrer un nouveau cycle.",
        warning:     "Cette action est irréversible. Les données du cycle actuel seront perdues.",
        cancel:      "Annuler",
        confirm:     "Réinitialiser",
      },
    },

    // BudgetGauge *******************************************
    budgetGauge: {
      remaining:    "Restant",
      balanceLeft:  "Solde restant",
      totalBudget:  "Budget total",
      spent:        "Dépensé",
      alertDanger:  "Attention, il te reste moins de 20% de ton budget !",
      alertEmpty:   "Budget épuisé ! Lance un nouveau cycle pour continuer.",
    },

    // Budgetsetup *********************************************
    budgetSetup: {
      brand:   "Vie+ Budget",
      newCycle: "Nouveau cycle",
      back:    "Retour",
      next:    "Suivant",
      launch:  "Lancer le cycle",
      step1: {
        title:    "Quel est ton budget ?",
        subtitle: "Ce montant sera verrouillé pour tout le cycle.",
        preview:  "Budget de {amount} Ar — verrouillé après confirmation",
      },
      step2: {
        title:         "Sur quelle durée ?",
        subtitle:      "Choisis ta période et la durée du cycle.",
        durationLabel: "Nombre de {periode}",
      },
      periodes: {
        jours:    "Jours",
        semaines: "Semaines",
        mois:     "Mois",
      },
      summary: {
        title:        "Récapitulatif du cycle",
        lockedBudget: "Budget verrouillé",
        duration:     "Durée",
        endDate:      "Fin du cycle",
      },
    },
    
    // Budgetstats **********************************************

    budgetStats: {
      toggleBtn: "Statistiques",
      cards: {
        fixed:   "Budget fixe",
        added:   "Ajouté",
        spent:   "Dépensé",
        balance: "Solde",
      },
      panel: {
        title:       "Répartition par catégorie",
        pctLabel:    "{pct}% des dépenses",
        topCategory: "est ta plus grosse dépense avec {amount} Ar",
      },
    },

    // Mouvementform ***************************************
    mouvementForm: {
      btnExpense:             "Nouvelle dépense",
      btnIncome:              "Ajouter de l'argent",
      typeExpense:            "Dépense",
      typeIncome:             "Ajout",
      nameLabel:              "Nom de l'opération",
      namePlaceholderExpense: "Ex: Cantine, Transport…",
      namePlaceholderIncome:  "Ex: Argent de poche…",
      amountLabel:            "Montant",
      categoryLabel:          "Catégorie",
      saving:                 "Enregistrement…",
      submitExpense:          "Enregistrer la dépense",
      submitIncome:           "Confirmer l'ajout",
      categories: {
        general:      "Général",
        alimentation: "Alimentation",
        transport:    "Transport",
        loisirs:      "Loisirs",
        sante:        "Santé",
        education:    "Éducation",
      },
    },
    
    // Mouvementlist ************************************
    mouvementList: {
      historyLabel: "Historique · {n} opération{s}",
      filterBtn:    "Filtres",
      sort: {
        date:   "Date",
        amount: "Montant",
        name:   "Nom",
      },
      filter: {
        all:      "Tous",
        expenses: "Dépenses",
        incomes:  "Ajouts",
        allCats:  "Toutes",
      },
      empty: {
        title:    "Aucune opération",
        filtered: "Essaie de changer les filtres.",
        default:  "Commence par enregistrer ta première opération !",
      },
      confirmModal: {
        title:   "Supprimer cette opération ?",
        warning: "Action irréversible.",
        cancel:  "Annuler",
        confirm: "Supprimer",
      },
      showHistory: "Voir l'historique",
      hideHistory: "Masquer l'historique",
    },

    // DashboardChart ********************************************
    dashboardChart: {
      title:        "Évolution du budget",
      dataLabel:    "{n} jour{s} de données",
      curveBtn:     "Courbe",
      barsBtn:      "Barres",
      avgPerDay:    "Moy / jour",
      peakExpense:  "Pic de dépense",
      trend:        "Tendance",
      danger:       "Attention",
      stable:       "Stable",
      emptyTitle:   "Aucune donnée à afficher",
      emptySub:     "Commence à enregistrer des opérations",
      legendSolde:  "Solde restant",
      legendDep:    "Dépenses cumulées",
      legendBudget: "Budget",
      budgetTotal:  "Budget total",
      depJour:      "Dépenses du jour",
      ajoutJour:    "Ajouts du jour",
    },

    // objectifs ******************************************
    objectifsPage: {
      title: "Mes objectifs",
      emptyActive: "Aucun objectif en cours. Lance-toi ! 🚀",
      stats: {
        active: "En cours",
        score:  "Ma progression",
        done:   "Réussis",
      },
      categories: {
        projet: "Projet",
        sante:  "Santé",
        argent: "Argent",
        etudes: "Études",
      },
      deadline: {
        overdue:  "Date dépassée",
        today:    "C'est aujourd'hui !",
        daysLeft: "{n} jour{s} restant{s}",
      },
      card: {
        details:       "Voir plus",
        close:         "Réduire",
        deadlineLabel: "À faire avant :",
        noDeadline:    "Pas de date limite",
        createdAt:     "Ajouté le :",
        delete:           "Supprimer l'objectif",
        deleteConfirmMsg: "Suppression automatique…",
        undo:             "Annuler",
      },
      trophyWall: {
        title:     "Objectifs réussis",
        completed: "100% — Félicitations !",
      },
      modal: {
        title:        "Nouvel objectif",
        placeholder:  "Donne un nom à ton objectif…",
        deadlineLabel: "Date limite (optionnel)",
        cancel:       "Annuler",
        create:       "Créer",
        creating:     "En cours…",
        sessionError: "Session expirée, reconnecte-toi.",
        createError:  "Une erreur est survenue : {msg}",
        subtitle:      "Définissez votre prochain cap.",
        titleLabel:    "Intitulé",
        categoryLabel: "Catégorie",
      },
      sort: {
        date:        "Date de création",
        deadline:    "Deadline",
        progression: "Progression",
      },
     
      emptyActiveSub: "Définissez votre premier cap et commencez à avancer.",
      emptyAction:    "+ Créer mon premier objectif",
      emptyFilter:    "Aucun objectif dans cette catégorie.",
      emptyFilterSub: "Essayez un autre filtre ou créez-en un nouveau.",

      filters: {
        all: "Tous",
      },
    },

    // ExportPDF***************************************
    exportPDF: {
      title:        "RELEVE DE BUDGET",
      generatedAt:  "Genere le",
      user:         "Utilisateur",
      cycleInfo:    "INFORMATIONS DU CYCLE",
      cycleStart:   "Debut du cycle",
      cycleEnd:     "Fin du cycle",
      period:       "Periode",
      status:       "Statut",
      expired:      "Termine",
      remaining:    "jour(s) restant(s)",
      summary:      "RESUME FINANCIER",
      budgetFixed:  "Budget fixe",
      added:        "Ajoute",
      spent:        "Depense",
      balance:      "Solde restant",
      history:      "HISTORIQUE DES OPERATIONS",
      operations:   "operation(s)",
      colDate:      "Date & Heure",
      colName:      "Operation",
      colCat:       "Categorie",
      colType:      "Type",
      colAmount:    "Montant",
      typeExpense:  "Depense",
      typeIncome:   "Ajout",
      footer:       "VIE+ — Document genere automatiquement",
      badgeDone:    "CYCLE TERMINE",
      badgeOngoing: "EN COURS",
      pctRemaining: "du budget restant",
      btnExport:    "Exporter le releve",
      btnDownload:  "Telecharger le releve",
      btnLoading:   "Generation...",
      btnDone:      "Telecharge",
      badgeFinal:   "Final",
    },

    // Omboarding ******************************************************
    onboarding: {
      stepLabel: "Étape",
      back:      "Retour",
      next:      "Suivant",
      start:     "C'est parti !",
      skipHint:  "Passer l'introduction",
      steps: [
        {
          title: "Mon Budget",
          desc:  "Suis tes dépenses, configure ton budget et visualise ton évolution jour après jour.",
        },
        {
          title: "Mes Objectifs",
          desc:  "Crée tes objectifs personnels, suis ta progression et célèbre tes réussites.",
        },
        {
          title: "Mes Tâches",
          desc:  "Organise tes tâches quotidiennes et reste productif chaque jour.",
        },
        {
          title: "Export PDF",
          desc:  "Génère un relevé PDF complet de tes dépenses à partager avec tes parents.",
        },
      ],
    },

    // A-propos ******************************************************************
    aboutPage: {
      // CreditsSection
      credits: {
        title:   "Fait avec passion",
        desc:    "VIE+ est un projet scolaire développé avec soin pour aider les jeunes à mieux gérer leur quotidien.",
        email:   "contact@vieplus.app",
        github:  "GitHub",
        version: "VIE+ · v1.0.0 · 2025",
      },
    
      // FeaturesSection
      features: {
        sectionLabel: "Fonctionnalités",
        title:        "Ce que fait VIE+",
        items: [
          { title: "Budget",      description: "Suis tes revenus et dépenses avec une jauge visuelle et des stats claires."          },
          { title: "Objectifs",   description: "Définis des objectifs personnels et visualise ta progression en temps réel."         },
          { title: "Tâches",      description: "Organise tes to-do avec des priorités et ne rate plus rien d'important."            },
          { title: "Export PDF",  description: "Génère un rapport complet de tes finances — pratique pour tes parents."             },
        ],
      },
    
      // HowItWorksSection
      howItWorks: {
        sectionLabel: "En 3 étapes",
        title:        "Comment ça marche ?",
        steps: [
          { title: "Crée ton compte",       description: "Inscris-toi en quelques secondes avec ton email. C'est gratuit."                                               },
          { title: "Configure ton budget",  description: "Indique ton budget mensuel ou hebdomadaire et commence à enregistrer tes mouvements."                          },
          { title: "Suis ta progression",   description: "Tes stats s'actualisent en temps réel. Atteins tes objectifs, un jour à la fois."                             },
        ],
      },
    
      // TechStackSection
      techStack: {
        sectionLabel: "Stack technique",
        title:        "Construit avec soin",
        desc:         "Des outils modernes et fiables pour garantir une expérience fluide et sécurisée.",
      },
    },

    meta: {
      locale: "fr-FR",
    }
  },

  // _______________________Anglais_______________________________________________________________________________________________________
  en: {
    nav: {
      dashboard: "Overview",
      money: "Finance",
      tasks: "Productivity",
      goals: "Planning & Goals",
      about: "Information",
      settings: "Settings",
      logout: "Sign Out",
      logging_out: "Signing out...",
      connected: "Active Session",

      menu:        "Menu",
      open:        "Open navigation",
      connectedAs: "Signed in as",
      defaultUser: "User",
      pagesLabel:  "Pages",
      active:      "Active",
      loggingOut:  "Signing out…",
      status:      "System optimal",
      items: {
        dashboard: "Dashboard",
        budget:    "My budget",
        tasks:     "My tasks",
        goals:     "Goals",
        about:     "About",
      },
    },

  //*************DashBoard An*********************************** */  
    dashboard: {
      loading: "Analyzing data...",
      welcome: "Welcome back,",
      categories: {
        general: "General",
        food: "Food & Dining",
        transport: "Transportation",
        leisure: "Leisure",
        health: "Healthcare",
        education: "Education"
      },
      greetings: {
        night:     "Good night",
        morning:   "Good morning",
        afternoon: "Good afternoon",
        evening:   "Good evening",
      },
      mood: {
        empty:    "Budget exhausted",
        critical: "Watch out!",
        warning:  "Keep an eye on spending",
        good:     "All good!",
      },
      balance: "Available balance",
    },

    activity: {
      title: "Transaction Audit",
      live: "Live feed",
      empty_title: "No recent activity",
      empty_sub: "Your financial operations will appear here",
      view_all: "View full transaction history",
      time: {
        now: "Just now",
        mins: "{n} min ago",
        hours: "{n}h ago",
        yesterday: "Yesterday",
        days: "{n} days ago"
      }
    },

    budget: {
      title: "Budget Analysis",
      view_all: "Details",
      remaining: "Availability",
      total: "Allocation",
      spent: "Consumed",
      cycle_until: "Active cycle until {date}",
      top_categories: "Expense items",
      locked: "Secured budget",
      unconfigured: {
        title: "Planning inactive",
        sub: "Set your limits to activate monitoring",
        button: "Initialize"
      }
    },

    objectives: {
      title:             "Goals",
      seeAll:            "See all",
      globalScore:       "Overall score",
      empty:             "No goals yet",
      add:               "Add a goal",
      completedSingular: "1 goal completed",
      completedPlural:   "{n} goals completed",
    },

    stats: {
      notConfigured: "Not configured",
      balance: {
        label: "Remaining balance",
        sub:   "Current budget",
      },
      expenses: {
        label: "Total spent",
        sub:   "This cycle",
      },
      objectives: {
        label: "Goals score",
        sub:   "Overall progress",
      },
      tasks: {
        label:    "Completed tasks",
        subPct:   "{pct}% of total",
        subEmpty: "Loading",
      },
    },
    //********************************************************** */

    settings: {
      title:    "Settings",
      theme:    "Theme",
      language: "Language",
      back:     "Back",
      dark:     "Dark",
      light:    "Light",
    },
    // depnses***************************************

    toast: {
      error:   "Error",
      success: "Success",
    },
    depensePage: {
      title:      "My budget",
      subtitle:   "Budget tracker",
      emptyState: "Set up your budget to get started…",
      errors: {
        loadFail:   "Failed to load data.",
        saveFail:   "Error: {msg}",
        deleteFail: "Could not delete.",
      },
      success: {
        cycleStarted: "Cycle started successfully!",
        cycleReset:   "Cycle reset. Ready for a fresh start!",
        expenseAdded: "Expense saved ✓",
        incomeAdded:  "Income saved ✓",
        deleted:      "Entry deleted.",
      },
    },

    //Budgethead***************************************** *

    budgetHeader: {
      locked:   "Budget locked",
      cycleOver: "Cycle complete!",
      endsOn:   "Ends on {date}",
      newCycle: "New cycle",
      urgency:  "Last few hours!",
      timeLeft: "Time remaining",
      pctLeft:  "{pct}% of time left",
      periode: {
        days:   "{n} day",
        weeks:  "{n} week",
        months: "{n} month",
      },
      countdown: {
        days:  "Days",
        hours: "Hours",
        mins:  "Mins",
        secs:  "Secs",
      },
      resetModal: {
        title:       "Reset the cycle?",
        description: "All entries will be deleted and you can start a new cycle.",
        warning:     "This action is irreversible. Current cycle data will be lost.",
        cancel:      "Cancel",
        confirm:     "Reset",
      },
    },
    
    // BudgetGauge ********************************************
    budgetGauge: {
      remaining:    "Remaining",
      balanceLeft:  "Balance left",
      totalBudget:  "Total budget",
      spent:        "Spent",
      alertDanger:  "Watch out, less than 20% of your budget left!",
      alertEmpty:   "Budget exhausted! Start a new cycle to continue.",
    },

    // BudgetSetup **************************************************
    budgetSetup: {
      brand:    "Vie+ Budget",
      newCycle: "New cycle",
      back:     "Back",
      next:     "Next",
      launch:   "Start cycle",
      step1: {
        title:    "What's your budget?",
        subtitle: "This amount will be locked for the entire cycle.",
        preview:  "Budget of {amount} Ar — locked after confirmation",
      },
      step2: {
        title:         "For how long?",
        subtitle:      "Choose your period and cycle length.",
        durationLabel: "Number of {periode}",
      },
      periodes: {
        jours:    "Days",
        semaines: "Weeks",
        mois:     "Months",
      },
      summary: {
        title:        "Cycle summary",
        lockedBudget: "Locked budget",
        duration:     "Duration",
        endDate:      "Cycle end date",
      },
    },

    //BudgetStats ***************************************
    budgetStats: {
      toggleBtn: "Statistics",
      cards: {
        fixed:   "Fixed budget",
        added:   "Added",
        spent:   "Spent",
        balance: "Balance",
      },
      panel: {
        title:       "Breakdown by category",
        pctLabel:    "{pct}% of spending",
        topCategory: "is your biggest expense with {amount} Ar",
      },
    },

    // Mouvementform ***********************************************
    mouvementForm: {
      btnExpense:             "New expense",
      btnIncome:              "Add money",
      typeExpense:            "Expense",
      typeIncome:             "Income",
      nameLabel:              "Operation name",
      namePlaceholderExpense: "E.g. Lunch, Transport…",
      namePlaceholderIncome:  "E.g. Pocket money…",
      amountLabel:            "Amount",
      categoryLabel:          "Category",
      saving:                 "Saving…",
      submitExpense:          "Save expense",
      submitIncome:           "Confirm income",
      categories: {
        general:      "General",
        alimentation: "Food",
        transport:    "Transport",
        loisirs:      "Leisure",
        sante:        "Health",
        education:    "Education",
      },
    },

    // Mouvementlist *********************************************
    mouvementList: {
      historyLabel: "History · {n} entry{s}",
      filterBtn:    "Filters",
      sort: {
        date:   "Date",
        amount: "Amount",
        name:   "Name",
      },
      filter: {
        all:      "All",
        expenses: "Expenses",
        incomes:  "Income",
        allCats:  "All",
      },
      empty: {
        title:    "No entries yet",
        filtered: "Try changing the filters.",
        default:  "Start by recording your first entry!",
      },
      confirmModal: {
        title:   "Delete this entry?",
        warning: "This cannot be undone.",
        cancel:  "Cancel",
        confirm: "Delete",
      },
      showHistory: "Show history",
      hideHistory: "Hide history",
    },
    
    // DashboardChart **************************************************
    dashboardChart: {
      title:        "Budget evolution",
      dataLabel:    "{n} day{s} of data",
      curveBtn:     "Curve",
      barsBtn:      "Bars",
      avgPerDay:    "Avg / day",
      peakExpense:  "Peak expense",
      trend:        "Trend",
      danger:       "Warning",
      stable:       "Stable",
      emptyTitle:   "No data to display",
      emptySub:     "Start recording your transactions",
      legendSolde:  "Remaining balance",
      legendDep:    "Cumulated expenses",
      legendBudget: "Budget",
      budgetTotal:  "Total budget",
      depJour:      "Daily expenses",
      ajoutJour:    "Daily income",
    },

    // Objectifs **********************************************
    objectifsPage: {
      title: "My goals",
      emptyActive: "No active goals. Go for it! 🚀",
      stats: {
        active: "In progress",
        score:  "My progress",
        done:   "Achieved",
      },
      categories: {
        projet: "Project",
        sante:  "Health",
        argent: "Money",
        etudes: "Studies",
      },
      deadline: {
        overdue:  "Past due",
        today:    "Due today!",
        daysLeft: "{n} day{s} left",
      },
      card: {
        details:       "See more",
        close:         "Close",
        deadlineLabel: "Due by:",
        noDeadline:    "No deadline set",
        createdAt:     "Added on:",
        delete:           "Delete this goal",
        deleteConfirmMsg: "Deleting automatically…",
        undo:             "Cancel",
      },
      trophyWall: {
        title:     "Achieved goals",
        completed: "100% — Well done!",
      },
      modal: {
        title:         "New goal",
        placeholder:   "Give your goal a name…",
        deadlineLabel: "Deadline (optional)",
        cancel:        "Cancel",
        create:        "Create",
        creating:      "Creating…",
        sessionError:  "Session expired, please log in again.",
        createError:   "Something went wrong: {msg}",
        subtitle:      "Define your next milestone.",
        titleLabel:    "Title",
        categoryLabel: "Category",
      },
      sort: {
        date:        "Creation date",
        deadline:    "Deadline",
        progression: "Progress",
      },
      emptyActiveSub: "Set your first milestone and start moving forward.",
      emptyAction:    "+ Create my first goal",
      emptyFilter:    "No goals in this category.",
      emptyFilterSub: "Try another filter or create a new one.",

      filters: {
        all: "All",
      },
    },

    // ExportPDF******************************************************
    exportPDF: {
      title:        "BUDGET STATEMENT",
      generatedAt:  "Generated on",
      user:         "User",
      cycleInfo:    "CYCLE INFORMATION",
      cycleStart:   "Cycle start",
      cycleEnd:     "Cycle end",
      period:       "Period",
      status:       "Status",
      expired:      "Completed",
      remaining:    "day(s) remaining",
      summary:      "FINANCIAL SUMMARY",
      budgetFixed:  "Fixed budget",
      added:        "Added",
      spent:        "Spent",
      balance:      "Remaining balance",
      history:      "TRANSACTION HISTORY",
      operations:   "transaction(s)",
      colDate:      "Date & Time",
      colName:      "Transaction",
      colCat:       "Category",
      colType:      "Type",
      colAmount:    "Amount",
      typeExpense:  "Expense",
      typeIncome:   "Income",
      footer:       "VIE+ — Automatically generated document",
      badgeDone:    "CYCLE COMPLETED",
      badgeOngoing: "ONGOING",
      pctRemaining: "of budget remaining",
      btnExport:    "Export statement",
      btnDownload:  "Download statement",
      btnLoading:   "Generating...",
      btnDone:      "Downloaded",
      badgeFinal:   "Final",
    },
    
    // Omboarding ******************************************************
    onboarding: {
      stepLabel: "Step",
      back:      "Back",
      next:      "Next",
      start:     "Let's go!",
      skipHint:  "Skip introduction",
      steps: [
        {
          title: "My Budget",
          desc:  "Track your expenses, set your budget and visualize your daily progress.",
        },
        {
          title: "My Goals",
          desc:  "Create personal goals, track your progress and celebrate achievements.",
        },
        {
          title: "My Tasks",
          desc:  "Organize your daily tasks and stay productive every day.",
        },
        {
          title: "PDF Export",
          desc:  "Generate a complete PDF statement of your expenses to share with your parents.",
        },
      ],
    },

    //A-propos ********************************************************************
    aboutPage: {
      credits: {
        title:   "Made with passion",
        desc:    "VIE+ is a school project built with care to help young people better manage their daily lives.",
        email:   "contact@vieplus.app",
        github:  "GitHub",
        version: "VIE+ · v1.0.0 · 2025",
      },
    
      features: {
        sectionLabel: "Features",
        title:        "What VIE+ does",
        items: [
          { title: "Budget",      description: "Track your income and expenses with a visual gauge and clear stats."               },
          { title: "Goals",       description: "Set personal goals and visualize your progress in real time."                     },
          { title: "Tasks",       description: "Organize your to-do list with priorities and never miss anything important."      },
          { title: "PDF Export",  description: "Generate a complete financial report — great for sharing with your parents."      },
        ],
      },
    
      howItWorks: {
        sectionLabel: "3 simple steps",
        title:        "How does it work?",
        steps: [
          { title: "Create your account",    description: "Sign up in seconds with your email. It's free."                                                              },
          { title: "Set up your budget",     description: "Enter your monthly or weekly budget and start recording your transactions."                                  },
          { title: "Track your progress",    description: "Your stats update in real time. Reach your goals, one day at a time."                                        },
        ],
      },
    
      techStack: {
        sectionLabel: "Tech stack",
        title:        "Built with care",
        desc:         "Modern and reliable tools to ensure a smooth and secure experience.",
      },
    },
    
    meta: {
      locale: "en-US",
    }
  }
};

export type TranslationType = typeof translations.fr;