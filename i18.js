// i18n.js - single file multi-language support (en, hi, mr)
(function () {
  const storageKey = "language";
  const defaultLang = "en";

  // ===== Add/update translations here =====
  const translations = {
    en: {
      dashboard: "Dashboard",
      dashboardTitle: "Dashboard",
      transactions: "Transactions",
      debt: "Debt Tracker",
      debtTitle: "Debt Tracker",
      budget: "Budget Planner",
      budgetTitle: "Budget Planner",
      settings: "Settings",
      logout: "Logout",

      profile: "Profile",
      uploadPic: "Upload Profile Picture",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone",
      address: "Address",
      saveProfile: "Save Profile",
      resetPassword: "Reset Password",

      preferences: "Preferences",
      language: "Select Language",
      twoFA: "Enable Two-Factor Authentication",

      dangerZone: "Danger Zone",
      deleteAccount: "Delete Account",
      deleteConfirm: "Are you sure you want to delete your account? This cannot be undone.",
      cancel: "Cancel",
      delete: "Delete",

      // Generic UI
      saveBtn: "Save",
      cancelBtn: "Cancel",
      totalSales: "Total Sales",
      monthlyGrowth: "Monthly Growth",

      // Transactions table
      transactionsTitle: "Transactions",
      date: "Date",
      amount: "Amount",
      category: "Category",
      paymentMethod: "Payment Method",

      // Budget
      setBudget: "Set Budget",
      overBudget: "You are over budget!"
    },
    hi: {
      dashboard: "डैशबोर्ड",
      dashboardTitle: "डैशबोर्ड",
      transactions: "लेन-देन",
      transactionsTitle: "लेन-देन",
      debt: "ऋण ट्रैकर",
      debtTitle: "ऋण ट्रैकर",
      budget: "बजट योजनाकार",
      budgetTitle: "बजट योजनाकार",
      settings: "सेटिंग्स",
      logout: "लॉगआउट",

      profile: "प्रोफ़ाइल",
      uploadPic: "प्रोफ़ाइल चित्र अपलोड करें",
      firstName: "पहला नाम",
      lastName: "अंतिम नाम",
      phone: "फ़ोन",
      address: "पता",
      saveProfile: "प्रोफ़ाइल सहेजें",
      resetPassword: "पासवर्ड रीसेट करें",

      preferences: "वरीयताएँ",
      language: "भाषा चुनें",
      twoFA: "दो-कारक प्रमाणीकरण सक्षम करें",

      dangerZone: "खतरे का क्षेत्र",
      deleteAccount: "खाता हटाएँ",
      deleteConfirm: "क्या आप वाकई अपना खाता हटाना चाहते हैं? यह पूर्ववत नहीं किया जा सकता।",
      cancel: "रद्द करें",
      delete: "हटाएँ",

      saveBtn: "सहेजें",
      cancelBtn: "रद्द करें",
      totalSales: "कुल बिक्री",
      monthlyGrowth: "मासिक वृद्धि",

      date: "तारीख",
      amount: "राशि",
      category: "श्रेणी",
      paymentMethod: "भुगतान विधि",

      setBudget: "बजट सेट करें",
      overBudget: "आप बजट से अधिक खर्च कर रहे हैं!"
    },
    mr: {
      dashboard: "डॅशबोर्ड",
      dashboardTitle: "डॅशबोर्ड",
      transactions: "व्यवहार",
      transactionsTitle: "व्यवहार",
      debt: "कर्ज ट्रॅकर",
      debtTitle: "कर्ज ट्रॅकर",
      budget: "बजेट नियोजक",
      budgetTitle: "बजेट नियोजक",
      settings: "सेटिंग्ज",
      logout: "लॉगआउट",
      accountSettings: "खाते सेटिंग्ज",

      profile: "प्रोफाईल",
      uploadPic: "प्रोफाईल चित्र अपलोड करा",
      firstName: "पहिले नाव",
      lastName: "आडनाव",
      phone: "फोन",
      address: "पत्ता",
      saveProfile: "प्रोफाईल जतन करा",
      resetPassword: "पासवर्ड रीसेट करा",

      preferences: "प्राथमिकता",
      language: "भाषा निवडा",
      twoFA: "दुहेरी प्रमाणीकरण सक्षम करा",

      dangerZone: "धोक्याचा विभाग",
      deleteAccount: "खाते हटवा",
      deleteConfirm: "आपला खाते खरोखर हटवायचे आहे का? हे परत केले जाऊ शकत नाही.",
      cancel: "रद्द करा",
      delete: "हटवा",

      saveBtn: "जतन करा",
      cancelBtn: "रद्द करा",
      totalSales: "एकूण विक्री",
      monthlyGrowth: "मासिक वाढ",

      date: "तारीख",
      amount: "रक्कम",
      category: "वर्ग",
      paymentMethod: "देयक पद्धत",

      setBudget: "बजेट सेट करा",
      overBudget: "तुम्ही बजेटपेक्षा जास्त खर्च करत आहात!"
    }
  };

  // Helper: safe read
  function t(lang, key) {
    return (translations[lang] && translations[lang][key]) || (translations[defaultLang] && translations[defaultLang][key]) || key;
  }

  function setLinkTextPreserveIcon(el, text) {
    if (!el) return;
    const raw = (el.textContent || "").trim();
    const parts = raw.split(/\s+/);
    const first = parts[0] || "";
    if (first && (/[\W]/.test(first) || first.length <= 2)) {
      el.textContent = first + " " + text;
    } else {
      el.textContent = text;
    }
  }

  function applyLanguage() {
    const lang = localStorage.getItem(storageKey) || defaultLang;

    // Elements with data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      el.textContent = t(lang, key);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const k = el.getAttribute("data-i18n-placeholder");
      if (!k) return;
      el.placeholder = t(lang, k);
    });
    document.querySelectorAll("[data-i18n-html]").forEach(el => {
      const k = el.getAttribute("data-i18n-html");
      if (!k) return;
      el.innerHTML = t(lang, k);
    });

    // Sidebar links
    const selMap = [
      ['.sidebar a[href="dashboard.html"]', 'dashboard'],
      ['.sidebar a[href="transactions.html"]', 'transactions'],
      ['.sidebar a[href="debt_tracker.html"]', 'debt'],
      ['.sidebar a[href="budget_planner.html"]', 'budget'],
      ['.sidebar a[href="settings.html"]', 'settings'],
      ['.sidebar a[href="index.html"]', 'logout']
    ];
    selMap.forEach(([sel, key]) => {
      const el = document.querySelector(sel);
      if (el) setLinkTextPreserveIcon(el, t(lang, key));
    });

    // Topbar account settings (safer with ID)
    const topbarTitle = document.getElementById("topbar-account-settings");
    if (topbarTitle) topbarTitle.textContent = "⚙️ " + t(lang, "accountSettings");

    // Profile dropdown
    const ddName = document.getElementById("dropdown-name");
    if (ddName) ddName.textContent = t(lang, "profile");

    // Headings
    const headings = [
      ['#page-title', 'dashboardTitle'],
      ['#transactions-title', 'transactionsTitle'],
      ['#budget-title', 'budgetTitle'],
      ['#debt-title', 'debtTitle']
    ];
    headings.forEach(([sel, key]) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = t(lang, key);
    });

    // Trigger event for dynamic content
    window.dispatchEvent(new CustomEvent("i18n:applied", { detail: { lang } }));
  }

  function setLanguage(lang) {
    localStorage.setItem(storageKey, lang);
    applyLanguage();
  }

  window.i18n = { setLanguage, applyLanguage, t: (k) => t(localStorage.getItem(storageKey) || defaultLang, k) };

  // Run on DOM load
  document.addEventListener("DOMContentLoaded", function () {
    applyLanguage();
    const avatar = document.getElementById("user-avatar");
    if (avatar) {
      const src = localStorage.getItem("profilePic");
      if (src) avatar.innerHTML = `<img src="${src}" style="width:100%;height:100%;border-radius:50%;">`;
      else {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        avatar.textContent = user.name ? user.name.charAt(0).toUpperCase() : "U";
      }
    }
  }, false);

})();
