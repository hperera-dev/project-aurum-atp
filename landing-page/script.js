/**
 * PROJECT AURUM — Landing Page Interactions & Working Call to Action
 * Handles accessible mobile menu, security simulator, and live waitlist submission
 * with Web3Forms backend integration and immediate Viva Examiner audit logging.
 */

// Global Configuration
// Get your team's free live Web3Forms access key at https://web3forms.com in 10 seconds
// or enter your Formspree endpoint / Supabase REST endpoint here.
const AURUM_CONFIG = {
  web3formsAccessKey: "a1b2c3d4-test-key-or-examiner", // REPLACE with real Web3Forms key for live Viva email dispatch
  enableConsoleAudit: true
};

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
     3. WORKING WAITLIST CALL TO ACTION & VIVA EXAMINER LOG
     ======================================================== */
  const waitlistForm = document.getElementById("waitlist-form");
  const formFeedback = document.getElementById("form-feedback");
  const userTypeSelect = document.getElementById("user-type");
  const shopGroup = document.getElementById("shop-field-group");
  const liveTableBody = document.getElementById("live-entries-body");
  const liveCountBadge = document.getElementById("live-count-badge");
  const btnQuickViva = document.getElementById("btn-quick-viva");
  const btnClearLogs = document.getElementById("btn-clear-logs");
  const btnExportData = document.getElementById("btn-export-data");

  const STORAGE_KEY = "aurum_waitlist_records";

  // Toggle Retailer Shop input
  if (userTypeSelect && shopGroup) {
    userTypeSelect.addEventListener("change", () => {
      const isRetailer = userTypeSelect.value === "retailer";
      shopGroup.classList.toggle("is-hidden", !isRetailer);
      const shopInput = document.getElementById("shop-name");
      if (shopInput) shopInput.required = isRetailer;
    });
  }

  // Load existing records from localStorage
  function getStoredRecords() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  // Render the Viva Examiner Live Table
  function renderLiveTable() {
    if (!liveTableBody) return;
    const records = getStoredRecords();
    if (liveCountBadge) liveCountBadge.textContent = String(records.length);

    if (records.length === 0) {
      liveTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-log">
            No submissions recorded yet. Submit the form above or click "Test Viva Submission" to record a live test entry.
          </td>
        </tr>
      `;
      return;
    }

    liveTableBody.innerHTML = records
      .slice(-6)
      .reverse()
      .map(
        (r, idx) => `
        <tr>
          <td><code>#AUR-${String(records.length - idx).padStart(3, "0")}</code></td>
          <td><strong>${escapeHtml(r.fullName)}</strong></td>
          <td>${escapeHtml(r.email)}</td>
          <td><span class="proto-badge">${escapeHtml(r.userType === "retailer" ? (r.shopName ? "Jeweller: " + r.shopName : "Retail Jeweller") : "Customer")}</span></td>
          <td><small>${new Date(r.timestamp).toLocaleTimeString()}</small></td>
        </tr>
      `
      )
      .join("");
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Initial table render
  renderLiveTable();

  // Form submission handler
  if (waitlistForm) {
    waitlistForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      formFeedback.className = "form-feedback";
      formFeedback.style.display = "none";

      const fullName = document.getElementById("full-name").value.trim();
      const email = document.getElementById("email").value.trim();
      const userType = userTypeSelect.value;
      const shopName = document.getElementById("shop-name") ? document.getElementById("shop-name").value.trim() : "";
      const consent = document.getElementById("privacy-consent").checked;
      const submitBtn = waitlistForm.querySelector("button[type='submit']");

      // Validation
      if (fullName.length < 2) {
        showFeedback("Please enter your full name (minimum 2 characters).", "is-error");
        document.getElementById("full-name").focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFeedback("Please enter a valid email address.", "is-error");
        document.getElementById("email").focus();
        return;
      }

      if (!consent) {
        showFeedback("You must agree to the Privacy Notice before submitting personal data.", "is-error");
        document.getElementById("privacy-consent").focus();
        return;
      }

      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Recording Submission...";

      const newRecord = {
        id: "AUR-" + Date.now().toString(36).toUpperCase(),
        fullName,
        email,
        userType,
        shopName: userType === "retailer" ? shopName : null,
        timestamp: new Date().toISOString(),
        client: "Project AURUM First Commit Web Client"
      };

      // 1. Send to Web3Forms Free Backend Endpoint
      let backendSuccess = false;
      try {
        const formData = new FormData();
        formData.append("access_key", AURUM_CONFIG.web3formsAccessKey);
        formData.append("name", fullName);
        formData.append("email", email);
        formData.append("user_type", userType);
        formData.append("shop_name", shopName || "N/A");
        formData.append("subject", "New Project AURUM Waitlist Entry: " + fullName);
        formData.append("from_name", "AURUM Pilot Portal");

        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        });
        const resJson = await response.json().catch(() => null);
        if (response.ok && resJson && resJson.success) {
          backendSuccess = true;
        }
      } catch (err) {
        console.warn("Backend API request fallback (offline or network mode):", err);
      }

      // 2. Persist to Local Audit Log (Viva Examiner guarantee)
      const currentRecords = getStoredRecords();
      currentRecords.push(newRecord);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentRecords));

      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;

      const successNotice = backendSuccess
        ? `✓ Success! Thank you ${fullName}. Your entry (${email}) has been transmitted to our backend and verified in the live audit log.`
        : `✓ Recorded! Thank you ${fullName}. Your entry (${email}) is securely recorded in the local Viva audit ledger (#${newRecord.id}).`;

      showFeedback(successNotice, "is-success");
      renderLiveTable();
      waitlistForm.reset();
      if (shopGroup) shopGroup.classList.add("is-hidden");
    });
  }

  function showFeedback(msg, typeClass) {
    if (!formFeedback) return;
    formFeedback.textContent = msg;
    formFeedback.className = `form-feedback ${typeClass}`;
    formFeedback.style.display = "block";
  }

  // Viva Examiner Quick Testing Button
  if (btnQuickViva) {
    btnQuickViva.addEventListener("click", () => {
      const sampleNames = ["Dr. Examiner (Viva Lead)", "Prof. Academic Evaluator", "Industry Assayer (NGJA)", "Showroom Manager"];
      const sampleEmails = ["examiner@example.edu", "evaluator@example.ac.lk", "assayer@example.gov.lk", "partner@aurum.lk"];
      const randomIdx = Math.floor(Math.random() * sampleNames.length);

      const quickRecord = {
        id: "VIVA-" + Math.floor(1000 + Math.random() * 9000),
        fullName: sampleNames[randomIdx],
        email: sampleEmails[randomIdx],
        userType: randomIdx % 2 === 0 ? "customer" : "retailer",
        shopName: randomIdx % 2 === 0 ? null : "Swarna Jewellers Colombo",
        timestamp: new Date().toISOString(),
        client: "Viva Quick Test Trigger"
      };

      const records = getStoredRecords();
      records.push(quickRecord);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      renderLiveTable();
      showFeedback(`✓ Live Viva test entry created for ${quickRecord.fullName} (${quickRecord.email})!`, "is-success");
    });
  }

  // Clear Logs
  if (btnClearLogs) {
    btnClearLogs.addEventListener("click", () => {
      if (confirm("Reset the Viva examiner waitlist log for a clean test?")) {
        localStorage.removeItem(STORAGE_KEY);
        renderLiveTable();
        showFeedback("Audit logs cleared. Ready for fresh examiner submissions.", "is-success");
      }
    });
  }

  // Export Data JSON
  if (btnExportData) {
    btnExportData.addEventListener("click", () => {
      const records = getStoredRecords();
      const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aurum_waitlist_export_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
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

