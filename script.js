document.addEventListener("DOMContentLoaded", () => {
  /* --------------------------------------------------------
     1. Accessible Mobile Navigation Drawer
     -------------------------------------------------------- */
  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.getElementById("primary-navigation");

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isExpanded));
      primaryNav.classList.toggle("is-open", !isExpanded);
    });

    // Close menu when clicking a link or pressing Escape
    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        primaryNav.classList.remove("is-open");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && primaryNav.classList.contains("is-open")) {
        navToggle.setAttribute("aria-expanded", "false");
        primaryNav.classList.remove("is-open");
        navToggle.focus();
      }
    });
  }

  /* --------------------------------------------------------
     2. Hero Privacy Model Simulator (Customer vs Shop A vs Shop B/Public)
     -------------------------------------------------------- */
  const simContent = {
    customer: {
      badgeClass: "sim-badge-success",
      badgeText: "AUTHENTICATED OWNER ACCESS",
      title: "22K Heritage Bridal Bangle",
      rows: [
        ["Issued By", "Shop A (Colombo 03) + Shop B items visible"],
        ["Declared Mass / Fineness", "16.400 g • 916‰ (Declared)"],
        ["Private Owner Note", "\"Gift from Amma — Dec 2026\" (Hidden from shops)"],
        ["Status", "Owned / Active • Handover Verified"]
      ]
    },
    shopA: {
      badgeClass: "sim-badge-info",
      badgeText: "ISSUING RETAILER ACCESS (SHOP A)",
      title: "22K Heritage Bridal Bangle",
      rows: [
        ["Scope", "Shop A Ledger Only (Shop B items invisible)"],
        ["Declared Mass / Fineness", "16.400 g • 916‰ (Declared)"],
        ["Customer Private Notes", "Restricted (Strictly Hidden)"],
        ["Permitted Actions", "Service Log • Manager Recovery / Redesign"]
      ]
    },
    anonymous: {
      badgeClass: "sim-badge-danger",
      badgeText: "UNAUTHORISED / COMPETING SHOP B",
      title: "Record Unavailable (Zero Data Returned)",
      rows: [
        ["Item Existence", "Not Confirmed (RLS Blocked)"],
        ["Owner Name / NIC", "Zero Data Exposed"],
        ["Origin Shop / Weight", "Zero Data Exposed"],
        ["Security Action", "Rejected attempt logged to AuditEvent"]
      ]
    }
  };

  const simTabs = document.querySelectorAll(".demo-tab");
  const simScreen = document.getElementById("sim-screen");

  simTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const roleKey = tab.dataset.simRole;
      const view = simContent[roleKey];
      if (!view || !simScreen) return;

      simTabs.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      const rowsHtml = view.rows
        .map(([dt, dd]) => `<div><dt>${dt}</dt><dd>${dd}</dd></div>`)
        .join("");

      simScreen.innerHTML = `
        <div class="sim-badge ${view.badgeClass}">${view.badgeText}</div>
        <h2 class="sim-title">${view.title}</h2>
        <dl class="sim-specs">${rowsHtml}</dl>
      `;
    });
  });

  /* --------------------------------------------------------
     3. Accessible Workflow Tab Switcher
     -------------------------------------------------------- */
  const wfTabs = Array.from(document.querySelectorAll(".wf-tab"));
  const wfPanels = Array.from(document.querySelectorAll(".wf-panel"));

  function activateWorkflowTab(selectedTab) {
    wfTabs.forEach((tab) => {
      const isSelected = tab === selectedTab;
      tab.classList.toggle("is-active", isSelected);
      tab.setAttribute("aria-selected", String(isSelected));
    });

    const targetId = selectedTab.getAttribute("aria-controls");
    wfPanels.forEach((panel) => {
      const isTarget = panel.id === targetId;
      panel.classList.toggle("is-active", isTarget);
      panel.hidden = !isTarget;
    });
  }

  wfTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateWorkflowTab(tab));

    tab.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        const nextTab = wfTabs[(index + 1) % wfTabs.length];
        nextTab.focus();
        activateWorkflowTab(nextTab);
      } else if (event.key === "ArrowLeft") {
        const prevTab = wfTabs[(index - 1 + wfTabs.length) % wfTabs.length];
        prevTab.focus();
        activateWorkflowTab(prevTab);
      }
    });
  });

  /* --------------------------------------------------------
     4. Conditional Retailer Field & Waitlist Form Validation
     -------------------------------------------------------- */
  const userTypeSelect = document.getElementById("user-type");
  const shopFieldGroup = document.getElementById("shop-field-group");
  const waitlistForm = document.getElementById("waitlist-form");
  const formFeedback = document.getElementById("form-feedback");

  if (userTypeSelect && shopFieldGroup) {
    userTypeSelect.addEventListener("change", () => {
      const isRetailer = userTypeSelect.value === "retailer";
      shopFieldGroup.classList.toggle("is-hidden", !isRetailer);
    });
  }

  if (waitlistForm && formFeedback) {
    waitlistForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      formFeedback.className = "form-feedback";
      formFeedback.textContent = "";

      const fullName = document.getElementById("full-name").value.trim();
      const email = document.getElementById("email").value.trim();
      const userType = userTypeSelect.value;
      const shopName = document.getElementById("shop-name").value.trim();
      const consent = document.getElementById("privacy-consent").checked;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (fullName.length < 2) {
        formFeedback.classList.add("is-error");
        formFeedback.textContent = "Please enter your full name.";
        document.getElementById("full-name").focus();
        return;
      }

      if (!emailRegex.test(email)) {
        formFeedback.classList.add("is-error");
        formFeedback.textContent = "Please enter a valid email address.";
        document.getElementById("email").focus();
        return;
      }

      if (!consent) {
        formFeedback.classList.add("is-error");
        formFeedback.textContent = "Please agree to the Privacy Notice before submitting.";
        document.getElementById("privacy-consent").focus();
        return;
      }

      // Optional: Connect a free static form endpoint (e.g., Web3Forms or Formspree) here
      // const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", { ... });

      // Analytics event hook (if Google Analytics is active)
      if (typeof window.gtag === "function") {
        window.gtag("event", "waitlist_signup", { user_type: userType });
      }

      // Store submission locally for prototype demonstration
      const existing = JSON.parse(localStorage.getItem("aurum_waitlist") || "[]");
      existing.push({
        fullName,
        email,
        userType,
        shopName: userType === "retailer" ? shopName : null,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem("aurum_waitlist", JSON.stringify(existing));

      formFeedback.classList.add("is-success");
      formFeedback.textContent = `Thank you, ${fullName}! Your early-access request (${email}) has been recorded.`;
      waitlistForm.reset();
      shopFieldGroup.classList.add("is-hidden");
    });
  }
});