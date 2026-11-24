/**
 * PROJECT AURUM — Landing Page Interactions
 * Handles accessible mobile navigation, zero-knowledge role simulator,
 * Netlify Forms waitlist submission, and accessible prototype lightbox.
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ========================================================
     1. ACCESSIBLE MOBILE NAVIGATION DRAWER
     ======================================================== */
  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.querySelector(".primary-nav");

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isExpanded));
      primaryNav.classList.toggle("is-open", !isExpanded);
    });

    // Close menu when navigation link is clicked or Escape is pressed
    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        primaryNav.classList.remove("is-open");
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && primaryNav.classList.contains("is-open")) {
        navToggle.setAttribute("aria-expanded", "false");
        primaryNav.classList.remove("is-open");
        navToggle.focus();
      }
    });
  }

  /* ========================================================
     2. ZERO-KNOWLEDGE PRIVACY & SECURITY SIMULATOR
     ======================================================== */
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

  if (simBtns.length && simScreen) {
    simBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const role = btn.dataset.role;
        const view = simData[role];
        if (!view) return;

        simBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        const rowsHtml = view.rows
          .map(
            ([dt, dd]) =>
              `<tr><td>${dt}</td><td><strong>${dd}</strong></td></tr>`
          )
          .join("");

        simScreen.innerHTML = `
          <div class="sim-badge ${view.badgeClass}">${view.badgeText}</div>
          <h3 style="color:#ffffff; margin: 0.35rem 0 0.85rem; font-size:1.15rem;">${view.title}</h3>
          <table class="sim-table">
            <tbody>${rowsHtml}</tbody>
          </table>
        `;
      });
    });
  }

  /* ========================================================
     3. EARLY ACCESS WAITLIST (NETLIFY FORMS INTEGRATION)
     ======================================================== */
  const waitlistForm = document.getElementById("waitlist-form");
  const formFeedback = document.getElementById("form-feedback");
  const userTypeSelect = document.getElementById("user-type");
  const shopGroup = document.getElementById("shop-field-group");

  // Toggle Retailer Showroom Name input
  if (userTypeSelect && shopGroup) {
    userTypeSelect.addEventListener("change", () => {
      const isRetailer = userTypeSelect.value === "retailer";
      shopGroup.classList.toggle("is-hidden", !isRetailer);
      const shopInput = document.getElementById("shop-name");
      if (shopInput) shopInput.required = isRetailer;
    });
  }

  function showFeedback(msg, typeClass) {
    if (!formFeedback) return;
    formFeedback.textContent = msg;
    formFeedback.className = `form-feedback ${typeClass}`;
    formFeedback.style.display = "block";
  }

  if (waitlistForm) {
    waitlistForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (formFeedback) {
        formFeedback.className = "form-feedback";
        formFeedback.style.display = "none";
      }

      const fullNameInput = document.getElementById("full-name");
      const emailInput = document.getElementById("email");
      const shopInput = document.getElementById("shop-name");
      const consentInput = document.getElementById("privacy-consent");
      const submitBtn = waitlistForm.querySelector("button[type='submit']");

      const fullName = fullNameInput.value.trim();
      const email = emailInput.value.trim();
      const userType = userTypeSelect ? userTypeSelect.value : "customer";
      const shopName = shopInput ? shopInput.value.trim() : "";
      const consent = consentInput ? consentInput.checked : false;

      if (fullName.length < 2) {
        showFeedback("Please enter your full name (minimum 2 characters).", "is-error");
        fullNameInput.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFeedback("Please enter a valid email address.", "is-error");
        emailInput.focus();
        return;
      }

      if (userType === "retailer" && shopName.length < 2) {
        showFeedback("Please enter your jewellery brand or showroom name.", "is-error");
        if (shopInput) shopInput.focus();
        return;
      }

      if (!consent) {
        showFeedback("Please accept the Privacy Notice before registering.", "is-error");
        if (consentInput) consentInput.focus();
        return;
      }

      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting Request...";

      try {
        const formData = new FormData(waitlistForm);
        if (!formData.get("form-name")) {
          formData.set("form-name", "waitlist");
        }
        if (userType !== "retailer") {
          formData.set("shop_name", "N/A");
        }

        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(formData).toString()
        });

        if (response.ok) {
          showFeedback(
            `✓ Thank you, ${fullName}. Your early-access request (${email}) has been received—we will contact you ahead of our Colombo pilot launch.`,
            "is-success"
          );
          waitlistForm.reset();
          if (shopGroup) shopGroup.classList.add("is-hidden");
          if (shopInput) shopInput.required = false;
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (err) {
        const isLocalPreview = window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        if (isLocalPreview) {
          showFeedback(
            `✓ Local preview validated for ${fullName} (${email}). Live form submissions are recorded automatically on Netlify HTTPS.`,
            "is-success"
          );
          waitlistForm.reset();
          if (shopGroup) shopGroup.classList.add("is-hidden");
          if (shopInput) shopInput.required = false;
        } else {
          showFeedback(
            "Unable to submit right now. Please try again or email us directly at aurumteam25@gmail.com.",
            "is-error"
          );
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }

  /* ========================================================
     5. ACCESSIBLE PROTOTYPE LIGHTBOX MODAL
     ======================================================== */
  const lightbox = document.getElementById("prototype-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxCloseBtn = document.getElementById("lightbox-close-btn");
  const zoomTriggers = document.querySelectorAll(".proto-zoom-trigger");
  let lastFocusedTrigger = null;

  function openLightbox(trigger) {
    if (!lightbox || !lightboxImg) return;
    const src = trigger.getAttribute("data-lightbox-src");
    const title = trigger.getAttribute("data-lightbox-title") || "Prototype Screen";
    const caption = trigger.getAttribute("data-lightbox-caption") || "";
    const innerImg = trigger.querySelector("img");

    lastFocusedTrigger = trigger;
    lightboxImg.src = src;
    lightboxImg.alt = innerImg ? innerImg.alt : title;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCaption) lightboxCaption.textContent = caption;

    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    if (lightboxCloseBtn) lightboxCloseBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lightboxImg) lightboxImg.src = "";
    if (lastFocusedTrigger) {
      lastFocusedTrigger.focus();
      lastFocusedTrigger = null;
    }
  }

  if (lightbox && zoomTriggers.length > 0) {
    zoomTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => openLightbox(trigger));
    });

    if (lightboxCloseBtn) {
      lightboxCloseBtn.addEventListener("click", closeLightbox);
    }

    lightbox.querySelectorAll("[data-lightbox-close]").forEach((el) => {
      el.addEventListener("click", closeLightbox);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightbox.hidden) {
        closeLightbox();
      }
    });
  }
});

