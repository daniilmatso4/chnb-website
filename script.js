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

// ----- Intro Animation -----
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro-overlay");
  const container = document.getElementById("freezer-container");
  const smokeVideo = document.getElementById("smoke-video");

  // Auto-start: show logo on doors briefly, then open
  setTimeout(() => {
    container.classList.add("doors-open");
    smokeVideo.play();
    smokeVideo.classList.add("smoke-active");

    // After doors open, transition to main site
    setTimeout(() => {
      intro.classList.add("intro-exit");
      setTimeout(() => {
        intro.style.display = "none";
        document.getElementById("main-site").classList.remove("hidden");
        initSite();

        // Start slow fade of smoke over the main site
        setTimeout(() => {
          smokeVideo.classList.remove("smoke-active");
          smokeVideo.classList.add("smoke-fade");
        }, 500);
      }, 400);
    }, 1200);
  }, 1000);
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
  localStorage.removeItem("chnb_user");
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

    // Show/hide freezer tab based on 21+ status
    freezerLinks.forEach(link => {
      if (currentUser.isOver21) {
        link.classList.remove("hidden");
      } else {
        link.classList.add("hidden");
      }
    });
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
  }
});

// ----- Keyboard shortcuts -----
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});
