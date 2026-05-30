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

    // tachePage ******************************************
    category: "Organisation",
    titleMain: "Mes ",
    titleHighlight: "Tâches",

    tachePage: {
      pageTitle: "Tâches | Vie+",
      loading:   "Vérification de la session...",
    },
    //board
    board: {
      emptyState: {
        title:     "Aucun projet en cours",
        subtitle:  "Créez votre premier tableau pour commencer à organiser vos tâches.",
        createBtn: "Créer un tableau",
        dialog: {
          title:       "Nommer votre tableau",
          subtitle:    "Choisissez un nom clair et mémorable.",
          placeholder: "ex: Développement Vie+",
          cancel:      "Annuler",
          create:      "Créer",
          creating:    "Création...",
        },
      },
      header: {
        renameTooltip: "Cliquer pour renommer",
        progress:      "Progression globale",
      },
      shell: {
        errorTitle: "Une erreur est survenue",
        retry:      "Réessayer",
      },
    },

    // card 
    card: {
      today: "Auj.",
      addInput: {
        placeholder: "Titre de la carte...",
        submit:      "Ajouter la carte",
        cancel:      "Annuler",
      },
    },
    
    // column ******************************************
    column: {
      addCard: "Ajouter une carte",
      addColumnPlaceholder: "Nom de la liste...",
      addColumnSubmit: "Ajouter",
      createFirst: "Créer une liste",
      addAnother: "Ajouter une autre liste",
      menuRename: "Renommer",
      menuDelete: "Supprimer la liste",
    },
    // taskModal ******************************************
    taskModal: {
      // AddBlockMenu
      addBlockBtn: "Ajouter",
      addBlockTitle: "Ajouter à la carte",
      blockLabels: "Étiquettes",
      blockLabelsDesc: "Classer par couleur",
      blockChecklist: "Checklist",
      blockChecklistDesc: "Sous-tâches à cocher",
      blockDates: "Dates",
      blockDatesDesc: "Date d'échéance",
      // DescriptionBlock
      descriptionTitle: "Description",
      descriptionPlaceholder: "Ajouter une description plus détaillée...",
      unsaved: "NON ENREGISTRÉ",
      editBtn: "Modifier",
      saveBtn: "Enregistrer",
      cancelBtn: "Annuler",
      // TaskModal
      notFound: "Carte introuvable.",
      closeBtn: "Fermer",
      deleteCard: "Supprimer la carte",
    },

    // checklistBlock ******************************************
    checklistBlock: {
      defaultTitle: "Checklist",
      newListPlaceholder: "Titre de la checklist...",
      create: "Créer",
      cancel: "Annuler",
      addAnotherList: "+ Ajouter une autre checklist",
      showAll: "Tout afficher",
      hideChecked: "Masquer cochés",
      deleteList: "Supprimer",
      newItemPlaceholder: "Nouvel élément...",
      addItem: "Ajouter",
      addItemBtn: "+ Ajouter un élément",
    },

    // datesBlock ******************************************
    datesBlock: {
      title: "Date d'échéance",
      hide: "Masquer",
      clearTitle: "Supprimer la date",
      saving: "Enregistrement...",
      save: "Enregistrer la date",
      status: {
        overdue: "En retard",
        today: "Aujourd'hui",
        soon: "Bientôt",
        ok: "Planifié",
      },
    },

    // labelsBlock ******************************************
    labelsBlock: {
      title: "Étiquettes",
      hide: "Masquer",
      edit: "Modifier",
      searchPlaceholder: "Rechercher une étiquette...",
      loading: "Chargement...",
      noResult: "Aucun résultat",
      noLabels: "Aucune étiquette créée",
      deleteLabel: "Supprimer ce label",
      preview: "Aperçu de l'étiquette",
      namePlaceholder: "Nom de l'étiquette",
      creating: "Création...",
      createAndAdd: "Créer et ajouter",
      cancel: "Annuler",
      createNew: "+ Créer une nouvelle étiquette",
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
    // tachePage ******************************************
    category: "Organization",
    titleMain: "My ",
    titleHighlight: "Tasks",
    
    tachePage: {
      pageTitle: "Tasks | Vie+",
      loading:   "Checking session...",
    },

    // board
    board: {
      emptyState: {
        title:     "No active project",
        subtitle:  "Create your first board to start organizing your tasks.",
        createBtn: "Create a board",
        dialog: {
          title:       "Name your board",
          subtitle:    "Choose a clear and memorable name.",
          placeholder: "e.g. Vie+ Development",
          cancel:      "Cancel",
          create:      "Create",
          creating:    "Creating...",
        },
      },
      header: {
        renameTooltip: "Click to rename",
        progress:      "Overall progress",
      },
      shell: {
        errorTitle: "An error occurred",
        retry:      "Retry",
      },
    },

    // card
    card: {
      today: "Today",
      addInput: {
      placeholder:"Card title...",
      submit:"Add card",
      cancel:"Cancel",
      },
    },

    // column
    column: {
      addCard: "Add a card",
      addColumnPlaceholder: "List name...",
      addColumnSubmit: "Add",
      createFirst: "Create a list",
      addAnother: "Add another list",
      menuRename: "Rename",
      menuDelete: "Delete list",
    },

    // taskModal ******************************************
    taskModal: {
      // AddBlockMenu
      addBlockBtn: "Add",
      addBlockTitle: "Add to card",
      blockLabels: "Labels",
      blockLabelsDesc: "Organize by color",
      blockChecklist: "Checklist",
      blockChecklistDesc: "Subtasks to check off",
      blockDates: "Dates",
      blockDatesDesc: "Due date",
      // DescriptionBlock
      descriptionTitle: "Description",
      descriptionPlaceholder: "Add a more detailed description...",
      unsaved: "UNSAVED",
      editBtn: "Edit",
      saveBtn: "Save",
      cancelBtn: "Cancel",
      // TaskModal
      notFound: "Card not found.",
      closeBtn: "Close",
      deleteCard: "Delete card",
    },

    // checklistBlock ******************************************
    checklistBlock: {
      defaultTitle: "Checklist",
      newListPlaceholder: "Checklist title...",
      create: "Create",
      cancel: "Cancel",
      addAnotherList: "+ Add another checklist",
      showAll: "Show all",
      hideChecked: "Hide checked",
      deleteList: "Delete",
      newItemPlaceholder: "New item...",
      addItem: "Add",
      addItemBtn: "+ Add an item",
    },

    // datesBlock ******************************************
    datesBlock: {
      title: "Due date",
      hide: "Hide",
      clearTitle: "Remove date",
      saving: "Saving...",
      save: "Save date",
      status: {
        overdue: "Overdue",
        today: "Today",
        soon: "Soon",
        ok: "Scheduled",
      },
    },

    // labelsBlock ******************************************
    labelsBlock: {
      title: "Labels",
      hide: "Hide",
      edit: "Edit",
      searchPlaceholder: "Search a label...",
      loading: "Loading...",
      noResult: "No results",
      noLabels: "No labels created",
      deleteLabel: "Delete this label",
      preview: "Label preview",
      namePlaceholder: "Label name",
      creating: "Creating...",
      createAndAdd: "Create and add",
      cancel: "Cancel",
      createNew: "+ Create a new label",
    },
    meta: {
      locale: "en-US",
    }
  },

  // Allemand**************************************************************************
  de: {
    nav: {
      dashboard: "Übersicht",
      money: "Meine Finanzen",
      tasks: "Aufgaben",
      goals: "Ziele & Sparen",
      about: "Informationen",
      settings: "Einstellungen",
      logging_out: "Abmelden...",
      connected: "Sitzung aktiv",
      menu:        "Menü",
      open:        "Navigation öffnen",
      connectedAs: "Angemeldet als",
      defaultUser: "Benutzer",
      pagesLabel:  "Seiten",
      active:      "Aktiv",
      logout:      "Abmelden",
      loggingOut:  "Abmelden…",
      status:      "System läuft gut",
      items: {
        dashboard: "Dashboard",
        budget:    "Mein Geld",
        tasks:     "Meine Aufgaben",
        goals:     "Ziele",
        about:     "Über uns",
      },
    },
  
    dashboard: {
      loading: "Daten werden geladen...",
      welcome: "Schön, dich zu sehen,",
      categories: {
        general:   "Allgemein",
        food:      "Essen",
        transport: "Transport",
        leisure:   "Freizeit",
        health:    "Gesundheit",
        education: "Bildung",
      },
      greetings: {
        night:     "Gute Nacht",
        morning:   "Guten Morgen",
        afternoon: "Guten Nachmittag",
        evening:   "Guten Abend",
      },
      mood: {
        empty:    "Budget aufgebraucht",
        critical: "Achtung!",
        warning:  "Behalte deine Ausgaben im Blick",
        good:     "Alles gut!",
      },
      balance: "Verfügbares Guthaben",
    },
  
    activity: {
      title: "Letzte Bewegungen",
      live: "Live",
      empty_title: "Noch keine Einträge",
      empty_sub: "Deine Finanzbewegungen erscheinen hier",
      view_all: "Alle Einträge ansehen",
      time: {
        now: "Gerade eben",
        mins: "Vor {n} Min.",
        hours: "Vor {n} Std.",
        yesterday: "Gestern",
        days: "Vor {n} Tagen",
      },
    },
  
    budget: {
      title: "Budget-Übersicht",
      view_all: "Details",
      remaining: "Verfügbar",
      total: "Gesamt",
      spent: "Ausgegeben",
      cycle_until: "Aktiver Zeitraum bis {date}",
      top_categories: "Ausgabenbereiche",
      locked: "Budget gesperrt",
      unconfigured: {
        title: "Noch nicht eingerichtet",
        sub: "Lege dein Budget fest, um loszulegen",
        button: "Einrichten",
      },
    },
  
    objectives: {
      title:             "Ziele",
      seeAll:            "Alle ansehen",
      globalScore:       "Gesamtpunktzahl",
      empty:             "Noch keine Ziele",
      add:               "Ziel hinzufügen",
      completedSingular: "1 Ziel erreicht",
      completedPlural:   "{n} Ziele erreicht",
    },
  
    stats: {
      notConfigured: "Nicht eingerichtet",
      balance: {
        label: "Verbleibendes Guthaben",
        sub:   "Aktuelles Budget",
      },
      expenses: {
        label: "Insgesamt ausgegeben",
        sub:   "Dieser Zeitraum",
      },
      objectives: {
        label: "Ziele-Punktzahl",
        sub:   "Gesamtfortschritt",
      },
      tasks: {
        label:    "Erledigte Aufgaben",
        subPct:   "{pct}% der Gesamtzahl",
        subEmpty: "Wird geladen",
      },
    },
  
    settings: {
      title:    "Einstellungen",
      theme:    "Design",
      language: "Sprache",
      back:     "Zurück",
      dark:     "Dunkel",
      light:    "Hell",
    },
  
    toast: {
      error:   "Fehler",
      success: "Erfolg",
    },
  
    depensePage: {
      title:      "Mein Budget",
      subtitle:   "Budget-Tracker",
      emptyState: "Richte dein Budget ein, um loszulegen…",
      errors: {
        loadFail:   "Fehler beim Laden.",
        saveFail:   "Fehler: {msg}",
        deleteFail: "Löschen nicht möglich.",
      },
      success: {
        cycleStarted: "Zeitraum erfolgreich gestartet!",
        cycleReset:   "Zeitraum zurückgesetzt. Bereit für einen Neustart!",
        expenseAdded: "Ausgabe gespeichert ✓",
        incomeAdded:  "Einnahme gespeichert ✓",
        deleted:      "Eintrag gelöscht.",
      },
    },
  
    budgetHeader: {
      locked:    "Budget gesperrt",
      cycleOver: "Zeitraum beendet!",
      endsOn:    "Endet am {date}",
      newCycle:  "Neuer Zeitraum",
      urgency:   "Letzte Stunden!",
      timeLeft:  "Verbleibende Zeit",
      pctLeft:   "{pct}% der Zeit übrig",
      periode: {
        days:   "{n} Tag",
        weeks:  "{n} Woche",
        months: "{n} Monat",
      },
      countdown: {
        days:  "Tage",
        hours: "Stunden",
        mins:  "Min.",
        secs:  "Sek.",
      },
      resetModal: {
        title:       "Zeitraum zurücksetzen?",
        description: "Alle Einträge werden gelöscht und du kannst neu starten.",
        warning:     "Diese Aktion kann nicht rückgängig gemacht werden.",
        cancel:      "Abbrechen",
        confirm:     "Zurücksetzen",
      },
    },
  
    budgetGauge: {
      remaining:   "Übrig",
      balanceLeft: "Verbleibendes Guthaben",
      totalBudget: "Gesamtbudget",
      spent:       "Ausgegeben",
      alertDanger: "Achtung, weniger als 20% deines Budgets ist noch übrig!",
      alertEmpty:  "Budget aufgebraucht! Starte einen neuen Zeitraum.",
    },
  
    budgetSetup: {
      brand:    "Vie+ Budget",
      newCycle: "Neuer Zeitraum",
      back:     "Zurück",
      next:     "Weiter",
      launch:   "Zeitraum starten",
      step1: {
        title:    "Wie hoch ist dein Budget?",
        subtitle: "Dieser Betrag wird für den gesamten Zeitraum festgelegt.",
        preview:  "Budget von {amount} Ar — wird nach Bestätigung gesperrt",
      },
      step2: {
        title:         "Wie lange soll es gelten?",
        subtitle:      "Wähle den Zeitraum und die Dauer.",
        durationLabel: "Anzahl von {periode}",
      },
      periodes: {
        jours:    "Tage",
        semaines: "Wochen",
        mois:     "Monate",
      },
      summary: {
        title:        "Zusammenfassung",
        lockedBudget: "Gesperrtes Budget",
        duration:     "Dauer",
        endDate:      "Ende des Zeitraums",
      },
    },
  
    budgetStats: {
      toggleBtn: "Statistiken",
      cards: {
        fixed:   "Festes Budget",
        added:   "Hinzugefügt",
        spent:   "Ausgegeben",
        balance: "Guthaben",
      },
      panel: {
        title:       "Aufteilung nach Kategorie",
        pctLabel:    "{pct}% der Ausgaben",
        topCategory: "ist deine größte Ausgabe mit {amount} Ar",
      },
    },
  
    mouvementForm: {
      btnExpense:             "Neue Ausgabe",
      btnIncome:              "Geld hinzufügen",
      typeExpense:            "Ausgabe",
      typeIncome:             "Einnahme",
      nameLabel:              "Name der Buchung",
      namePlaceholderExpense: "z.B. Essen, Bus…",
      namePlaceholderIncome:  "z.B. Taschengeld…",
      amountLabel:            "Betrag",
      categoryLabel:          "Kategorie",
      saving:                 "Wird gespeichert…",
      submitExpense:          "Ausgabe speichern",
      submitIncome:           "Einnahme bestätigen",
      categories: {
        general:      "Allgemein",
        alimentation: "Essen",
        transport:    "Transport",
        loisirs:      "Freizeit",
        sante:        "Gesundheit",
        education:    "Bildung",
      },
    },
  
    mouvementList: {
      historyLabel: "Verlauf · {n} Eintrag{s}",
      filterBtn:    "Filter",
      sort: {
        date:   "Datum",
        amount: "Betrag",
        name:   "Name",
      },
      filter: {
        all:      "Alle",
        expenses: "Ausgaben",
        incomes:  "Einnahmen",
        allCats:  "Alle",
      },
      empty: {
        title:    "Keine Einträge",
        filtered: "Versuche, die Filter zu ändern.",
        default:  "Fange an, deinen ersten Eintrag zu erfassen!",
      },
      confirmModal: {
        title:   "Diesen Eintrag löschen?",
        warning: "Das kann nicht rückgängig gemacht werden.",
        cancel:  "Abbrechen",
        confirm: "Löschen",
      },
      showHistory: "Verlauf anzeigen",
      hideHistory: "Verlauf ausblenden",
    },
  
    dashboardChart: {
      title:        "Budget-Verlauf",
      dataLabel:    "{n} Tag{s} Daten",
      curveBtn:     "Kurve",
      barsBtn:      "Balken",
      avgPerDay:    "Durchschn. / Tag",
      peakExpense:  "Höchste Ausgabe",
      trend:        "Trend",
      danger:       "Achtung",
      stable:       "Stabil",
      emptyTitle:   "Keine Daten vorhanden",
      emptySub:     "Fange an, Einträge zu erfassen",
      legendSolde:  "Verbleibendes Guthaben",
      legendDep:    "Kumulierte Ausgaben",
      legendBudget: "Budget",
      budgetTotal:  "Gesamtbudget",
      depJour:      "Tagesausgaben",
      ajoutJour:    "Tageseinnahmen",
    },
  
    objectifsPage: {
      title:       "Meine Ziele",
      emptyActive: "Noch keine Ziele. Leg los! 🚀",
      stats: {
        active: "Laufend",
        score:  "Mein Fortschritt",
        done:   "Erreicht",
      },
      categories: {
        projet: "Projekt",
        sante:  "Gesundheit",
        argent: "Geld",
        etudes: "Schule",
      },
      deadline: {
        overdue:  "Überfällig",
        today:    "Heute fällig!",
        daysLeft: "Noch {n} Tag{s}",
      },
      card: {
        details:          "Mehr sehen",
        close:            "Schließen",
        deadlineLabel:    "Fällig bis:",
        noDeadline:       "Kein Enddatum",
        createdAt:        "Hinzugefügt am:",
        delete:           "Ziel löschen",
        deleteConfirmMsg: "Wird automatisch gelöscht…",
        undo:             "Rückgängig",
      },
      trophyWall: {
        title:     "Erreichte Ziele",
        completed: "100% — Glückwunsch!",
      },
      modal: {
        title:         "Neues Ziel",
        placeholder:   "Gib deinem Ziel einen Namen…",
        deadlineLabel: "Enddatum (optional)",
        cancel:        "Abbrechen",
        create:        "Erstellen",
        creating:      "Wird erstellt…",
        sessionError:  "Sitzung abgelaufen, bitte erneut anmelden.",
        createError:   "Ein Fehler ist aufgetreten: {msg}",
        subtitle:      "Lege dein nächstes Ziel fest.",
        titleLabel:    "Titel",
        categoryLabel: "Kategorie",
      },
      sort: {
        date:        "Erstellungsdatum",
        deadline:    "Enddatum",
        progression: "Fortschritt",
      },
      emptyActiveSub: "Lege dein erstes Ziel fest und fang an.",
      emptyAction:    "+ Erstes Ziel erstellen",
      emptyFilter:    "Keine Ziele in dieser Kategorie.",
      emptyFilterSub: "Versuche einen anderen Filter oder erstelle ein neues Ziel.",
      filters: {
        all: "Alle",
      },
    },
  
    exportPDF: {
      title:        "BUDGET-BERICHT",
      generatedAt:  "Erstellt am",
      user:         "Benutzer",
      cycleInfo:    "INFORMATIONEN ZUM ZEITRAUM",
      cycleStart:   "Start des Zeitraums",
      cycleEnd:     "Ende des Zeitraums",
      period:       "Zeitraum",
      status:       "Status",
      expired:      "Beendet",
      remaining:    "Tag(e) übrig",
      summary:      "FINANZÜBERSICHT",
      budgetFixed:  "Festes Budget",
      added:        "Hinzugefügt",
      spent:        "Ausgegeben",
      balance:      "Verbleibendes Guthaben",
      history:      "BUCHUNGSVERLAUF",
      operations:   "Buchung(en)",
      colDate:      "Datum & Uhrzeit",
      colName:      "Buchung",
      colCat:       "Kategorie",
      colType:      "Typ",
      colAmount:    "Betrag",
      typeExpense:  "Ausgabe",
      typeIncome:   "Einnahme",
      footer:       "VIE+ — Automatisch erstelltes Dokument",
      badgeDone:    "ZEITRAUM BEENDET",
      badgeOngoing: "LAUFEND",
      pctRemaining: "des Budgets übrig",
      btnExport:    "Bericht exportieren",
      btnDownload:  "Bericht herunterladen",
      btnLoading:   "Wird erstellt...",
      btnDone:      "Heruntergeladen",
      badgeFinal:   "Final",
    },
  
    onboarding: {
      stepLabel: "Schritt",
      back:      "Zurück",
      next:      "Weiter",
      start:     "Los geht's!",
      skipHint:  "Einführung überspringen",
      steps: [
        {
          title: "Mein Budget",
          desc:  "Verfolge deine Ausgaben, richte dein Budget ein und sieh deinen Fortschritt täglich.",
        },
        {
          title: "Meine Ziele",
          desc:  "Erstelle persönliche Ziele, verfolge deinen Fortschritt und feiere deine Erfolge.",
        },
        {
          title: "Meine Aufgaben",
          desc:  "Organisiere deine täglichen Aufgaben und bleib jeden Tag produktiv.",
        },
        {
          title: "PDF-Export",
          desc:  "Erstelle einen vollständigen PDF-Bericht deiner Ausgaben zum Teilen.",
        },
      ],
    },
  
    aboutPage: {
      credits: {
        title:   "Mit Leidenschaft gemacht",
        desc:    "VIE+ ist ein Schulprojekt, das jungen Menschen helfen soll, ihren Alltag besser zu organisieren.",
        email:   "contact@vieplus.app",
        github:  "GitHub",
        version: "VIE+ · v1.0.0 · 2025",
      },
      features: {
        sectionLabel: "Funktionen",
        title:        "Was VIE+ kann",
        items: [
          { title: "Budget",      description: "Verfolge deine Einnahmen und Ausgaben mit einer visuellen Anzeige."     },
          { title: "Ziele",       description: "Lege persönliche Ziele fest und sieh deinen Fortschritt in Echtzeit."   },
          { title: "Aufgaben",    description: "Organisiere deine To-do-Liste und verpasse nichts Wichtiges."           },
          { title: "PDF-Export",  description: "Erstelle einen vollständigen Finanzbericht zum Teilen."                 },
        ],
      },
      howItWorks: {
        sectionLabel: "In 3 Schritten",
        title:        "Wie funktioniert es?",
        steps: [
          { title: "Konto erstellen",    description: "Melde dich in wenigen Sekunden mit deiner E-Mail an. Kostenlos." },
          { title: "Budget einrichten",  description: "Gib dein Budget ein und fange an, deine Ausgaben zu erfassen."   },
          { title: "Fortschritt sehen",  description: "Deine Statistiken werden in Echtzeit aktualisiert."              },
        ],
      },
      techStack: {
        sectionLabel: "Technologie",
        title:        "Sorgfältig gebaut",
        desc:         "Moderne und zuverlässige Tools für eine reibungslose Erfahrung.",
      },
    },
  
    category:       "Organisation",
    titleMain:      "Meine ",
    titleHighlight: "Aufgaben",
  
    tachePage: {
      pageTitle: "Aufgaben | Vie+",
      loading:   "Sitzung wird überprüft...",
    },
  
    board: {
      emptyState: {
        title:     "Kein aktives Projekt",
        subtitle:  "Erstelle dein erstes Board, um deine Aufgaben zu organisieren.",
        createBtn: "Board erstellen",
        dialog: {
          title:       "Board benennen",
          subtitle:    "Wähle einen klaren und einprägsamen Namen.",
          placeholder: "z.B. Vie+ Entwicklung",
          cancel:      "Abbrechen",
          create:      "Erstellen",
          creating:    "Wird erstellt...",
        },
      },
      header: {
        renameTooltip: "Zum Umbenennen klicken",
        progress:      "Gesamtfortschritt",
      },
      shell: {
        errorTitle: "Ein Fehler ist aufgetreten",
        retry:      "Erneut versuchen",
      },
    },
  
    card: {
      today: "Heute",
      addInput: {
        placeholder: "Titel der Karte...",
        submit:      "Karte hinzufügen",
        cancel:      "Abbrechen",
      },
    },
  
    column: {
      addCard:              "Karte hinzufügen",
      addColumnPlaceholder: "Listenname...",
      addColumnSubmit:      "Hinzufügen",
      createFirst:          "Liste erstellen",
      addAnother:           "Weitere Liste hinzufügen",
      menuRename:           "Umbenennen",
      menuDelete:           "Liste löschen",
    },
  
    taskModal: {
      addBlockBtn:            "Hinzufügen",
      addBlockTitle:          "Zur Karte hinzufügen",
      blockLabels:            "Etiketten",
      blockLabelsDesc:        "Nach Farbe sortieren",
      blockChecklist:         "Checkliste",
      blockChecklistDesc:     "Unteraufgaben abhaken",
      blockDates:             "Datum",
      blockDatesDesc:         "Fälligkeitsdatum",
      descriptionTitle:       "Beschreibung",
      descriptionPlaceholder: "Füge eine ausführlichere Beschreibung hinzu...",
      unsaved:                "NICHT GESPEICHERT",
      editBtn:                "Bearbeiten",
      saveBtn:                "Speichern",
      cancelBtn:              "Abbrechen",
      notFound:               "Karte nicht gefunden.",
      closeBtn:               "Schließen",
      deleteCard:             "Karte löschen",
    },
  
    checklistBlock: {
      defaultTitle:       "Checkliste",
      newListPlaceholder: "Titel der Checkliste...",
      create:             "Erstellen",
      cancel:             "Abbrechen",
      addAnotherList:     "+ Weitere Checkliste hinzufügen",
      showAll:            "Alle anzeigen",
      hideChecked:        "Erledigte ausblenden",
      deleteList:         "Löschen",
      newItemPlaceholder: "Neuer Eintrag...",
      addItem:            "Hinzufügen",
      addItemBtn:         "+ Eintrag hinzufügen",
    },
  
    datesBlock: {
      title:      "Fälligkeitsdatum",
      hide:       "Ausblenden",
      clearTitle: "Datum entfernen",
      saving:     "Wird gespeichert...",
      save:       "Datum speichern",
      status: {
        overdue: "Überfällig",
        today:   "Heute",
        soon:    "Bald",
        ok:      "Geplant",
      },
    },
  
    labelsBlock: {
      title:             "Etiketten",
      hide:              "Ausblenden",
      edit:              "Bearbeiten",
      searchPlaceholder: "Etikett suchen...",
      loading:           "Wird geladen...",
      noResult:          "Kein Ergebnis",
      noLabels:          "Noch keine Etiketten erstellt",
      deleteLabel:       "Dieses Etikett löschen",
      preview:           "Etikett-Vorschau",
      namePlaceholder:   "Name des Etiketts",
      creating:          "Wird erstellt...",
      createAndAdd:      "Erstellen und hinzufügen",
      cancel:            "Abbrechen",
      createNew:         "+ Neues Etikett erstellen",
    },
  
    meta: {
      locale: "de-DE",
    },
  },

  // Espagnol*******************************************************************************
  es: {
    nav: {
      dashboard: "Resumen",
      money: "Mis Finanzas",
      tasks: "Tareas",
      goals: "Objetivos & Ahorro",
      about: "Información",
      settings: "Ajustes",
      logging_out: "Cerrando sesión...",
      connected: "Sesión activa",
      menu:        "Menú",
      open:        "Abrir navegación",
      connectedAs: "Conectado como",
      defaultUser: "Usuario",
      pagesLabel:  "Páginas",
      active:      "Activo",
      logout:      "Cerrar sesión",
      loggingOut:  "Cerrando sesión…",
      status:      "Sistema funcionando bien",
      items: {
        dashboard: "Panel principal",
        budget:    "Mi dinero",
        tasks:     "Mis tareas",
        goals:     "Objetivos",
        about:     "Acerca de",
      },
    },
  
    dashboard: {
      loading: "Cargando datos...",
      welcome: "Bienvenido de nuevo,",
      categories: {
        general:   "General",
        food:      "Comida",
        transport: "Transporte",
        leisure:   "Ocio",
        health:    "Salud",
        education: "Educación",
      },
      greetings: {
        night:     "Buenas noches",
        morning:   "Buenos días",
        afternoon: "Buenas tardes",
        evening:   "Buenas tardes",
      },
      mood: {
        empty:    "Presupuesto agotado",
        critical: "¡Atención!",
        warning:  "Controla tus gastos",
        good:     "¡Todo bien!",
      },
      balance: "Saldo disponible",
    },
  
    activity: {
      title: "Últimos movimientos",
      live: "En vivo",
      empty_title: "Sin actividad",
      empty_sub: "Tus movimientos financieros aparecerán aquí",
      view_all: "Ver todo el historial",
      time: {
        now: "Ahora mismo",
        mins: "Hace {n} min",
        hours: "Hace {n}h",
        yesterday: "Ayer",
        days: "Hace {n} días",
      },
    },
  
    budget: {
      title: "Análisis del presupuesto",
      view_all: "Detalles",
      remaining: "Disponible",
      total: "Total",
      spent: "Gastado",
      cycle_until: "Ciclo activo hasta {date}",
      top_categories: "Categorías de gasto",
      locked: "Presupuesto bloqueado",
      unconfigured: {
        title: "Sin configurar",
        sub: "Define tu presupuesto para empezar",
        button: "Configurar",
      },
    },
  
    objectives: {
      title:             "Objetivos",
      seeAll:            "Ver todo",
      globalScore:       "Puntuación global",
      empty:             "Sin objetivos",
      add:               "Añadir objetivo",
      completedSingular: "1 objetivo logrado",
      completedPlural:   "{n} objetivos logrados",
    },
  
    stats: {
      notConfigured: "No configurado",
      balance: {
        label: "Saldo restante",
        sub:   "Presupuesto actual",
      },
      expenses: {
        label: "Total gastado",
        sub:   "Este ciclo",
      },
      objectives: {
        label: "Puntuación objetivos",
        sub:   "Progreso global",
      },
      tasks: {
        label:    "Tareas completadas",
        subPct:   "{pct}% del total",
        subEmpty: "Cargando",
      },
    },
  
    settings: {
      title:    "Ajustes",
      theme:    "Tema",
      language: "Idioma",
      back:     "Volver",
      dark:     "Oscuro",
      light:    "Claro",
    },
  
    toast: {
      error:   "Error",
      success: "Éxito",
    },
  
    depensePage: {
      title:      "Mi presupuesto",
      subtitle:   "Control de gastos",
      emptyState: "Configura tu presupuesto para empezar…",
      errors: {
        loadFail:   "Error al cargar.",
        saveFail:   "Error: {msg}",
        deleteFail: "No se pudo eliminar.",
      },
      success: {
        cycleStarted: "¡Ciclo iniciado con éxito!",
        cycleReset:   "¡Ciclo reiniciado. Listo para empezar de nuevo!",
        expenseAdded: "Gasto guardado ✓",
        incomeAdded:  "Ingreso guardado ✓",
        deleted:      "Entrada eliminada.",
      },
    },
  
    budgetHeader: {
      locked:    "Presupuesto bloqueado",
      cycleOver: "¡Ciclo terminado!",
      endsOn:    "Termina el {date}",
      newCycle:  "Nuevo ciclo",
      urgency:   "¡Últimas horas!",
      timeLeft:  "Tiempo restante",
      pctLeft:   "{pct}% del tiempo restante",
      periode: {
        days:   "{n} día",
        weeks:  "{n} semana",
        months: "{n} mes",
      },
      countdown: {
        days:  "Días",
        hours: "Horas",
        mins:  "Min",
        secs:  "Seg",
      },
      resetModal: {
        title:       "¿Reiniciar el ciclo?",
        description: "Todas las entradas se eliminarán y podrás empezar de nuevo.",
        warning:     "Esta acción no se puede deshacer.",
        cancel:      "Cancelar",
        confirm:     "Reiniciar",
      },
    },
  
    budgetGauge: {
      remaining:   "Restante",
      balanceLeft: "Saldo restante",
      totalBudget: "Presupuesto total",
      spent:       "Gastado",
      alertDanger: "¡Atención, te queda menos del 20% de tu presupuesto!",
      alertEmpty:  "¡Presupuesto agotado! Inicia un nuevo ciclo para continuar.",
    },
  
    budgetSetup: {
      brand:    "Vie+ Presupuesto",
      newCycle: "Nuevo ciclo",
      back:     "Volver",
      next:     "Siguiente",
      launch:   "Iniciar ciclo",
      step1: {
        title:    "¿Cuál es tu presupuesto?",
        subtitle: "Este importe quedará bloqueado durante todo el ciclo.",
        preview:  "Presupuesto de {amount} Ar — bloqueado tras confirmación",
      },
      step2: {
        title:         "¿Por cuánto tiempo?",
        subtitle:      "Elige el período y la duración del ciclo.",
        durationLabel: "Número de {periode}",
      },
      periodes: {
        jours:    "Días",
        semaines: "Semanas",
        mois:     "Meses",
      },
      summary: {
        title:        "Resumen del ciclo",
        lockedBudget: "Presupuesto bloqueado",
        duration:     "Duración",
        endDate:      "Fin del ciclo",
      },
    },
  
    budgetStats: {
      toggleBtn: "Estadísticas",
      cards: {
        fixed:   "Presupuesto fijo",
        added:   "Añadido",
        spent:   "Gastado",
        balance: "Saldo",
      },
      panel: {
        title:       "Desglose por categoría",
        pctLabel:    "{pct}% del gasto",
        topCategory: "es tu mayor gasto con {amount} Ar",
      },
    },
  
    mouvementForm: {
      btnExpense:             "Nuevo gasto",
      btnIncome:              "Añadir dinero",
      typeExpense:            "Gasto",
      typeIncome:             "Ingreso",
      nameLabel:              "Nombre de la operación",
      namePlaceholderExpense: "Ej: Comida, Transporte…",
      namePlaceholderIncome:  "Ej: Dinero de bolsillo…",
      amountLabel:            "Importe",
      categoryLabel:          "Categoría",
      saving:                 "Guardando…",
      submitExpense:          "Guardar gasto",
      submitIncome:           "Confirmar ingreso",
      categories: {
        general:      "General",
        alimentation: "Comida",
        transport:    "Transporte",
        loisirs:      "Ocio",
        sante:        "Salud",
        education:    "Educación",
      },
    },
  
    mouvementList: {
      historyLabel: "Historial · {n} entrada{s}",
      filterBtn:    "Filtros",
      sort: {
        date:   "Fecha",
        amount: "Importe",
        name:   "Nombre",
      },
      filter: {
        all:      "Todos",
        expenses: "Gastos",
        incomes:  "Ingresos",
        allCats:  "Todas",
      },
      empty: {
        title:    "Sin entradas",
        filtered: "Prueba a cambiar los filtros.",
        default:  "¡Empieza registrando tu primera entrada!",
      },
      confirmModal: {
        title:   "¿Eliminar esta entrada?",
        warning: "Esta acción no se puede deshacer.",
        cancel:  "Cancelar",
        confirm: "Eliminar",
      },
      showHistory: "Ver historial",
      hideHistory: "Ocultar historial",
    },
  
    dashboardChart: {
      title:        "Evolución del presupuesto",
      dataLabel:    "{n} día{s} de datos",
      curveBtn:     "Curva",
      barsBtn:      "Barras",
      avgPerDay:    "Media / día",
      peakExpense:  "Gasto máximo",
      trend:        "Tendencia",
      danger:       "Atención",
      stable:       "Estable",
      emptyTitle:   "Sin datos que mostrar",
      emptySub:     "Empieza a registrar tus movimientos",
      legendSolde:  "Saldo restante",
      legendDep:    "Gastos acumulados",
      legendBudget: "Presupuesto",
      budgetTotal:  "Presupuesto total",
      depJour:      "Gastos del día",
      ajoutJour:    "Ingresos del día",
    },
  
    objectifsPage: {
      title:       "Mis objetivos",
      emptyActive: "Sin objetivos activos. ¡Anímate! 🚀",
      stats: {
        active: "En curso",
        score:  "Mi progreso",
        done:   "Logrados",
      },
      categories: {
        projet: "Proyecto",
        sante:  "Salud",
        argent: "Dinero",
        etudes: "Estudios",
      },
      deadline: {
        overdue:  "Vencido",
        today:    "¡Hoy es el día!",
        daysLeft: "{n} día{s} restante{s}",
      },
      card: {
        details:          "Ver más",
        close:            "Cerrar",
        deadlineLabel:    "Antes del:",
        noDeadline:       "Sin fecha límite",
        createdAt:        "Añadido el:",
        delete:           "Eliminar objetivo",
        deleteConfirmMsg: "Eliminando automáticamente…",
        undo:             "Deshacer",
      },
      trophyWall: {
        title:     "Objetivos logrados",
        completed: "100% — ¡Felicidades!",
      },
      modal: {
        title:         "Nuevo objetivo",
        placeholder:   "Dale un nombre a tu objetivo…",
        deadlineLabel: "Fecha límite (opcional)",
        cancel:        "Cancelar",
        create:        "Crear",
        creating:      "Creando…",
        sessionError:  "Sesión expirada, vuelve a iniciar sesión.",
        createError:   "Ocurrió un error: {msg}",
        subtitle:      "Define tu próxima meta.",
        titleLabel:    "Título",
        categoryLabel: "Categoría",
      },
      sort: {
        date:        "Fecha de creación",
        deadline:    "Fecha límite",
        progression: "Progreso",
      },
      emptyActiveSub: "Define tu primera meta y empieza a avanzar.",
      emptyAction:    "+ Crear mi primer objetivo",
      emptyFilter:    "Sin objetivos en esta categoría.",
      emptyFilterSub: "Prueba otro filtro o crea uno nuevo.",
      filters: {
        all: "Todos",
      },
    },
  
    exportPDF: {
      title:        "EXTRACTO DE PRESUPUESTO",
      generatedAt:  "Generado el",
      user:         "Usuario",
      cycleInfo:    "INFORMACIÓN DEL CICLO",
      cycleStart:   "Inicio del ciclo",
      cycleEnd:     "Fin del ciclo",
      period:       "Período",
      status:       "Estado",
      expired:      "Terminado",
      remaining:    "día(s) restante(s)",
      summary:      "RESUMEN FINANCIERO",
      budgetFixed:  "Presupuesto fijo",
      added:        "Añadido",
      spent:        "Gastado",
      balance:      "Saldo restante",
      history:      "HISTORIAL DE OPERACIONES",
      operations:   "operación(es)",
      colDate:      "Fecha y hora",
      colName:      "Operación",
      colCat:       "Categoría",
      colType:      "Tipo",
      colAmount:    "Importe",
      typeExpense:  "Gasto",
      typeIncome:   "Ingreso",
      footer:       "VIE+ — Documento generado automáticamente",
      badgeDone:    "CICLO TERMINADO",
      badgeOngoing: "EN CURSO",
      pctRemaining: "del presupuesto restante",
      btnExport:    "Exportar extracto",
      btnDownload:  "Descargar extracto",
      btnLoading:   "Generando...",
      btnDone:      "Descargado",
      badgeFinal:   "Final",
    },
  
    onboarding: {
      stepLabel: "Paso",
      back:      "Volver",
      next:      "Siguiente",
      start:     "¡Vamos!",
      skipHint:  "Saltar introducción",
      steps: [
        {
          title: "Mi Presupuesto",
          desc:  "Controla tus gastos, configura tu presupuesto y visualiza tu progreso día a día.",
        },
        {
          title: "Mis Objetivos",
          desc:  "Crea objetivos personales, sigue tu progreso y celebra tus logros.",
        },
        {
          title: "Mis Tareas",
          desc:  "Organiza tus tareas diarias y mantente productivo cada día.",
        },
        {
          title: "Exportar PDF",
          desc:  "Genera un extracto PDF completo de tus gastos para compartir.",
        },
      ],
    },
  
    aboutPage: {
      credits: {
        title:   "Hecho con pasión",
        desc:    "VIE+ es un proyecto escolar creado con cuidado para ayudar a los jóvenes a gestionar mejor su día a día.",
        email:   "contact@vieplus.app",
        github:  "GitHub",
        version: "VIE+ · v1.0.0 · 2025",
      },
      features: {
        sectionLabel: "Funciones",
        title:        "Qué hace VIE+",
        items: [
          { title: "Presupuesto", description: "Controla tus ingresos y gastos con un indicador visual." },
          { title: "Objetivos",   description: "Define metas personales y visualiza tu progreso en tiempo real." },
          { title: "Tareas",      description: "Organiza tu lista de tareas y no te pierdas nada importante." },
          { title: "PDF",         description: "Genera un informe financiero completo para compartir." },
        ],
      },
      howItWorks: {
        sectionLabel: "En 3 pasos",
        title:        "¿Cómo funciona?",
        steps: [
          { title: "Crea tu cuenta",        description: "Regístrate en segundos con tu correo. Es gratis." },
          { title: "Configura tu presupuesto", description: "Introduce tu presupuesto y empieza a registrar tus movimientos." },
          { title: "Sigue tu progreso",     description: "Tus estadísticas se actualizan en tiempo real." },
        ],
      },
      techStack: {
        sectionLabel: "Tecnología",
        title:        "Construido con cuidado",
        desc:         "Herramientas modernas y fiables para una experiencia fluida y segura.",
      },
    },
  
    category:       "Organización",
    titleMain:      "Mis ",
    titleHighlight: "Tareas",
  
    tachePage: {
      pageTitle: "Tareas | Vie+",
      loading:   "Verificando sesión...",
    },
  
    board: {
      emptyState: {
        title:     "Sin proyecto activo",
        subtitle:  "Crea tu primer tablero para organizar tus tareas.",
        createBtn: "Crear tablero",
        dialog: {
          title:       "Nombra tu tablero",
          subtitle:    "Elige un nombre claro y fácil de recordar.",
          placeholder: "Ej: Desarrollo Vie+",
          cancel:      "Cancelar",
          create:      "Crear",
          creating:    "Creando...",
        },
      },
      header: {
        renameTooltip: "Clic para renombrar",
        progress:      "Progreso global",
      },
      shell: {
        errorTitle: "Ocurrió un error",
        retry:      "Reintentar",
      },
    },
  
    card: {
      today: "Hoy",
      addInput: {
        placeholder: "Título de la tarjeta...",
        submit:      "Añadir tarjeta",
        cancel:      "Cancelar",
      },
    },
  
    column: {
      addCard:              "Añadir tarjeta",
      addColumnPlaceholder: "Nombre de la lista...",
      addColumnSubmit:      "Añadir",
      createFirst:          "Crear lista",
      addAnother:           "Añadir otra lista",
      menuRename:           "Renombrar",
      menuDelete:           "Eliminar lista",
    },
  
    taskModal: {
      addBlockBtn:            "Añadir",
      addBlockTitle:          "Añadir a la tarjeta",
      blockLabels:            "Etiquetas",
      blockLabelsDesc:        "Organizar por color",
      blockChecklist:         "Lista de tareas",
      blockChecklistDesc:     "Subtareas para marcar",
      blockDates:             "Fechas",
      blockDatesDesc:         "Fecha de vencimiento",
      descriptionTitle:       "Descripción",
      descriptionPlaceholder: "Añade una descripción más detallada...",
      unsaved:                "SIN GUARDAR",
      editBtn:                "Editar",
      saveBtn:                "Guardar",
      cancelBtn:              "Cancelar",
      notFound:               "Tarjeta no encontrada.",
      closeBtn:               "Cerrar",
      deleteCard:             "Eliminar tarjeta",
    },
  
    checklistBlock: {
      defaultTitle:       "Lista de tareas",
      newListPlaceholder: "Título de la lista...",
      create:             "Crear",
      cancel:             "Cancelar",
      addAnotherList:     "+ Añadir otra lista",
      showAll:            "Ver todo",
      hideChecked:        "Ocultar marcados",
      deleteList:         "Eliminar",
      newItemPlaceholder: "Nuevo elemento...",
      addItem:            "Añadir",
      addItemBtn:         "+ Añadir elemento",
    },
  
    datesBlock: {
      title:      "Fecha de vencimiento",
      hide:       "Ocultar",
      clearTitle: "Quitar fecha",
      saving:     "Guardando...",
      save:       "Guardar fecha",
      status: {
        overdue: "Vencido",
        today:   "Hoy",
        soon:    "Próximo",
        ok:      "Programado",
      },
    },
  
    labelsBlock: {
      title:             "Etiquetas",
      hide:              "Ocultar",
      edit:              "Editar",
      searchPlaceholder: "Buscar etiqueta...",
      loading:           "Cargando...",
      noResult:          "Sin resultados",
      noLabels:          "Sin etiquetas creadas",
      deleteLabel:       "Eliminar esta etiqueta",
      preview:           "Vista previa de etiqueta",
      namePlaceholder:   "Nombre de la etiqueta",
      creating:          "Creando...",
      createAndAdd:      "Crear y añadir",
      cancel:            "Cancelar",
      createNew:         "+ Crear nueva etiqueta",
    },
  
    meta: {
      locale: "es-ES",
    },
  },
};

export type TranslationType = typeof translations.fr;