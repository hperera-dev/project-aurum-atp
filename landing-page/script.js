// Project AURUM — Landing Page Interactions
document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Navigation Drawer
  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.querySelector(".primary-nav");
  const closeNav = (returnFocus = false) => {
    if (!navToggle || !primaryNav) return;
    navToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
    if (returnFocus) navToggle.focus();
  };

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") !== "true";
      navToggle.setAttribute("aria-expanded", String(open));
      primaryNav.classList.toggle("is-open", open);
    });
    primaryNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => closeNav()));
  }

  // 2. Zero-Knowledge Role Simulator
  const simData = {
    customer: {
      badgeClass: "badge-owner",
      badgeText: "AUTHENTICATED CUSTOMER OWNER VIEW",
      title: "22K Heritage Bridal Bangle (AU-000452)",
      rows: [
        ["Vault Access", "Full cross-shop visibility (Swarna + Raja pieces together)"],
        ["Net Gold Mass", "16.400 g • 916 Hallmark (Declared & Verified)"],
        ["Private Note", "\"Wedding gift from Amma — Dec 2026\" (Hidden from all shops)"],
        ["Attached Docs", "Original VAT Invoice PDF (AES-256 encrypted, customer-only)"],
        ["Handover Status", "Dual-Committed at POS • Tamper-proof hash chained"]
      ]
    },
    shopA: {
      badgeClass: "badge-shop",
      badgeText: "ISSUING JEWELLER VIEW (SHOP A — SWARNA JEWELLERS)",
      title: "Stock & Service Record: AU-000452",
      rows: [
        ["Tenant Scope", "Shop A Ledger Only (Competitor Shop B records invisible)"],
        ["Item Data", "16.400 g • 22K (916‰) • Issued on Invoice #SW-2026-0421"],
        ["Buyer Identity", "Masked after checkout (Customer present unlock required for service)"],
        ["Permitted Actions", "Record maintenance, polish weight audit, damage re-issue"],
        ["Competitor Barrier", "PostgreSQL Row-Level Security blocks cross-shop surveillance"]
      ]
    },
    blocked: {
      badgeClass: "badge-blocked",
      badgeText: "UNAUTHORISED SCAN / COMPETITOR SHOP B VIEW",
      title: "ACCESS DENIED (Strict Tenant Isolation)",
      rows: [
        ["Item Existence", "Not Confirmed by Server (HTTP 403 Forbidden)"],
        ["Customer Identity", "Zero bytes returned (No Name, No NIC, No Contact)"],
        ["Jewellery Details", "Zero details returned (No Weight, No Price, No Metal)"],
        ["Burglar Shield", "Zero Home Addresses Stored in Entire Architecture"],
        ["Security Event", "Unauthorised scan attempt logged to SHA-256 AuditEvent"]
      ]
    }
  };

  const simBtns = document.querySelectorAll(".sim-btn");
  const simScreen = document.getElementById("sim-screen");
  simBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = simData[btn.dataset.role];
      if (!view || !simScreen) return;
      simBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });
      const rows = view.rows.map(([k, v]) => `<tr><td>${k}</td><td><strong>${v}</strong></td></tr>`).join("");
      simScreen.innerHTML = `<div class="sim-badge ${view.badgeClass}">${view.badgeText}</div><h3 class="sim-title">${view.title}</h3><table class="sim-table"><tbody>${rows}</tbody></table>`;
    });
  });

  // 3. Early Access Waitlist (Netlify Forms)
  const form = document.getElementById("waitlist-form");
  const feedback = document.getElementById("form-feedback");
  const shopGroup = document.getElementById("shop-field-group");
  const setFeedback = (msg, state = "") => {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.className = state ? `form-feedback ${state}` : "form-feedback";
  };

  if (form) {
    const { full_name, email, user_type, shop_name, privacy_consent } = form.elements;
    const submitBtn = form.querySelector("button[type='submit']");
    const syncRoleField = () => {
      const isRetailer = user_type.value === "retailer";
      shopGroup.classList.toggle("is-hidden", !isRetailer);
      shop_name.required = isRetailer;
    };
    user_type.addEventListener("change", syncRoleField);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      setFeedback("");
      const nameVal = full_name.value.trim();
      const emailVal = email.value.trim();
      const isRetailer = user_type.value === "retailer";

      if (nameVal.length < 2) return setFeedback("Please enter your full name (minimum 2 characters).", "is-error"), full_name.focus();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) return setFeedback("Please enter a valid email address.", "is-error"), email.focus();
      if (isRetailer && shop_name.value.trim().length < 2) return setFeedback("Please enter your jewellery brand or showroom name.", "is-error"), shop_name.focus();
      if (!privacy_consent.checked) return setFeedback("Please accept the Privacy Notice before registering.", "is-error"), privacy_consent.focus();

      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting Request...";

      try {
        const data = new FormData(form);
        if (!isRetailer) data.set("shop_name", "N/A");
        const res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(data).toString()
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setFeedback(`✓ Thank you, ${nameVal}. Your early-access request (${emailVal}) has been received—we will contact you ahead of our Colombo pilot launch.`, "is-success");
        form.reset();
        syncRoleField();
      } catch {
        const isLocal = ["file:", ""].includes(location.protocol) || ["localhost", "127.0.0.1"].includes(location.hostname);
        if (isLocal) {
          setFeedback(`✓ Local preview validated for ${nameVal} (${emailVal}). Live submissions are recorded automatically on Netlify HTTPS.`, "is-success");
          form.reset();
          syncRoleField();
        } else {
          setFeedback("Unable to submit right now. Please try again or email us directly at aurumteam25@gmail.com.", "is-error");
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }

  // 4. Prototype Full-Resolution Lightbox
  const lightbox = document.getElementById("prototype-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close-btn");
  let activeTrigger = null;

  const closeLightbox = () => {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
    lightboxImg.src = "";
    activeTrigger?.focus();
    activeTrigger = null;
  };

  if (lightbox && lightboxImg) {
    document.querySelectorAll(".proto-zoom-trigger").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const card = trigger.closest("article");
        const img = trigger.querySelector("img");
        if (!img) return;
        activeTrigger = trigger;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxTitle.textContent = card?.querySelector("h3")?.textContent || "";
        lightboxCaption.textContent = card?.querySelector("p")?.textContent || "";
        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
        lightboxClose?.focus();
      });
    });
    lightboxClose?.addEventListener("click", closeLightbox);
    lightbox.querySelector("[data-lightbox-close]")?.addEventListener("click", closeLightbox);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeNav(primaryNav?.classList.contains("is-open"));
      closeLightbox();
    }
  });
});
