// ===== COLD HEARTED NEVER BROKEN - WEBSITE =====

// ----- Placeholder product data -----
const products = [
  { id: 1, name: "FROZEN HEART TEE", price: 65, category: "tees", image: "assets/shirt1.png" },
  { id: 2, name: "ICE COLD JACKET", price: 120, category: "jackets", image: "assets/jacket1.jpeg" },
  { id: 3, name: "NEVER BROKEN HOODIE", price: 95, category: "hoodies", image: null },
  { id: 4, name: "FROSTBITE TEE", price: 55, category: "tees", image: null },
  { id: 5, name: "COLD WORLD CREWNECK", price: 85, category: "hoodies", image: null },
  { id: 6, name: "ICED OUT CAP", price: 40, category: "accessories", image: null },
  { id: 7, name: "FREEZER BURN TEE", price: 60, category: "tees", image: null },
  { id: 8, name: "SUBZERO JACKET", price: 140, category: "jackets", image: null },
  { id: 9, name: "COLD HEARTED BEANIE", price: 35, category: "accessories", image: null },
  { id: 10, name: "STAY SOLID HOODIE", price: 90, category: "hoodies", image: null },
  { id: 11, name: "BLIZZARD TEE", price: 55, category: "tees", image: null },
  { id: 12, name: "PERMAFROST SOCKS", price: 18, category: "accessories", image: null },
];

// ----- State -----
let currentUser = JSON.parse(localStorage.getItem("chnb_user")) || null;
let isSubscribed = JSON.parse(localStorage.getItem("chnb_subscribed")) || false;

// ----- Cinematic Video Intro -----
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro-overlay");
  const video = document.getElementById("intro-video");

  // Play the intro video
  video.play();

  // When video ends, fade out intro and show the site
  video.addEventListener("ended", () => {
    intro.classList.add("intro-fade-out");

    setTimeout(() => {
      intro.style.display = "none";
      document.getElementById("main-site").classList.remove("hidden");
      initSite();
    }, 1200);
  });

  // Fallback: if video fails to load, skip to site after 2s
  video.addEventListener("error", () => {
    setTimeout(() => {
      intro.style.display = "none";
      document.getElementById("main-site").classList.remove("hidden");
      initSite();
    }, 2000);
  });
});

// ----- Initialize Site -----
function initSite() {
  updateAuthState();
  setupScrollAnimations();
}

// ----- Navigation -----
function showSection(section) {
  // Hide all sections
  document.querySelectorAll(".page-section").forEach(s => s.classList.add("hidden"));

  // Show target
  const target = document.getElementById(`section-${section}`);
  if (target) {
    target.classList.remove("hidden");
  }

  // Update active nav link
  document.querySelectorAll(".nav-link[data-section]").forEach(link => {
    link.classList.toggle("active", link.dataset.section === section);
  });

  // Scroll to top
  window.scrollTo(0, 0);

}

function toggleMobileMenu() {
  const menu = document.querySelector(".mobile-menu");
  menu.classList.toggle("hidden");
}


function selectSize(btn) {
  document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

// ----- Auth System -----
function openAuthModal() {
  if (currentUser) {
    handleLogout();
    return;
  }
  document.getElementById("auth-modal").classList.remove("hidden");
  showLogin();
}

function closeModal() {
  document.getElementById("auth-modal").classList.add("hidden");
}

function showLogin() {
  document.getElementById("login-form").classList.remove("hidden");
  document.getElementById("signup-form").classList.add("hidden");
}

function showSignup() {
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("signup-form").classList.remove("hidden");
}

function handleLogin() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    showToast("Please fill in all fields", "error");
    return;
  }

  // Check localStorage for existing account
  const accounts = JSON.parse(localStorage.getItem("chnb_accounts")) || {};
  const account = accounts[email];

  if (!account || account.password !== password) {
    showToast("Invalid email or password", "error");
    return;
  }

  currentUser = {
    name: account.name,
    email: email,
    dob: account.dob,
    isOver21: account.isOver21
  };

  localStorage.setItem("chnb_user", JSON.stringify(currentUser));
  closeModal();
  updateAuthState();
  showToast(`Welcome back, ${currentUser.name}!`, "success");
}

function handleSignup() {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const dob = document.getElementById("signup-dob").value;

  if (!name || !email || !password || !dob) {
    showToast("Please fill in all fields", "error");
    return;
  }

  // Calculate age
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  const isOver21 = age >= 21;

  // Save account
  const accounts = JSON.parse(localStorage.getItem("chnb_accounts")) || {};
  if (accounts[email]) {
    showToast("An account with this email already exists", "error");
    return;
  }

  accounts[email] = { name, password, dob, isOver21 };
  localStorage.setItem("chnb_accounts", JSON.stringify(accounts));

  // Auto-login
  currentUser = { name, email, dob, isOver21 };
  localStorage.setItem("chnb_user", JSON.stringify(currentUser));

  closeModal();
  updateAuthState();

  if (isOver21) {
    showToast(`Welcome to the family, ${name}! You've got full access.`, "success");
  } else {
    showToast(`Welcome, ${name}! Browse our collection.`, "success");
  }
}

function handleLogout() {
  currentUser = null;
  isSubscribed = false;
  localStorage.removeItem("chnb_user");
  localStorage.removeItem("chnb_subscribed");
  updateAuthState();
  showSection("home");
  showToast("You've been signed out", "success");
}

function updateAuthState() {
  const accountLink = document.getElementById("account-link");
  const mobileAccountLink = document.getElementById("mobile-account-link");
  const freezerLinks = document.querySelectorAll(".freezer-link");

  if (currentUser) {
    // Show user name + sign out
    const initial = currentUser.name.charAt(0).toUpperCase();
    const badgeHTML = `
      <span class="user-badge">
        <span class="avatar">${initial}</span>
        SIGN OUT
      </span>`;

    if (accountLink) accountLink.innerHTML = badgeHTML;
    if (mobileAccountLink) mobileAccountLink.innerHTML = "SIGN OUT";

    // Show freezer link for all logged-in users
    freezerLinks.forEach(link => link.classList.remove("hidden"));
  } else {
    if (accountLink) accountLink.textContent = "ACCOUNT";
    if (mobileAccountLink) mobileAccountLink.textContent = "ACCOUNT";

    // Hide freezer tab
    freezerLinks.forEach(link => link.classList.add("hidden"));

    // If currently viewing freezer, redirect to home
    const freezerSection = document.getElementById("section-freezer");
    if (freezerSection && !freezerSection.classList.contains("hidden")) {
      showSection("home");
    }
  }
}

// ----- Freezer Access (Subscription Gate) -----
function accessFreezer() {
  if (!currentUser) {
    openAuthModal();
    return;
  }

  if (isSubscribed) {
    showSection("freezer");
  } else {
    openSubscribeModal();
  }
}

function openSubscribeModal() {
  document.getElementById("subscribe-modal").classList.remove("hidden");
}

function closeSubscribeModal() {
  document.getElementById("subscribe-modal").classList.add("hidden");
}

function formatCardNumber(input) {
  let value = input.value.replace(/\D/g, "");
  value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
  input.value = value;
}

function formatExpiry(input) {
  let value = input.value.replace(/\D/g, "");
  if (value.length >= 2) {
    value = value.substring(0, 2) + "/" + value.substring(2);
  }
  input.value = value;
}

function handleSubscribe() {
  const name = document.getElementById("card-name").value.trim();
  const number = document.getElementById("card-number").value.replace(/\s/g, "");
  const expiry = document.getElementById("card-expiry").value;
  const cvv = document.getElementById("card-cvv").value;

  if (!name || !number || !expiry || !cvv) {
    showToast("Please fill in all card details", "error");
    return;
  }

  if (number.length < 13) {
    showToast("Please enter a valid card number", "error");
    return;
  }

  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    showToast("Please enter a valid expiry (MM/YY)", "error");
    return;
  }

  if (cvv.length < 3) {
    showToast("Please enter a valid CVV", "error");
    return;
  }

  // Mark as subscribed
  isSubscribed = true;
  localStorage.setItem("chnb_subscribed", JSON.stringify(true));

  closeSubscribeModal();
  showSection("freezer");
  showToast("Welcome to The Freezer. You're in.", "success");
}

// ----- Toast Notifications -----
function showToast(message, type = "success") {
  // Remove existing toast
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ----- Scroll Animations -----
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
}

// ----- Close modal on backdrop click -----
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-backdrop")) {
    closeModal();
    closeSubscribeModal();
  }
});

// ----- Keyboard shortcuts -----
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    closeSubscribeModal();
  }
});
