// ============================================
// Soin Africa Safaris - Main JavaScript with Firebase
// ============================================

// Firebase Configuration - Your actual config
const firebaseConfig = {
  apiKey: "AIzaSyBaVpqvPGBItNJ_tpzu2oxsmSUprpLGEug",
  authDomain: "soin-tours.firebaseapp.com",
  databaseURL: "https://soin-tours-default-rtdb.firebaseio.com",
  projectId: "soin-tours",
  storageBucket: "soin-tours.firebasestorage.app",
  messagingSenderId: "999749494059",
  appId: "1:999749494059:web:a10dad104934744e99d16e",
};

// Initialize Firebase
let database;
let auth;

function initFirebase() {
  try {
    if (typeof firebase !== "undefined") {
      firebase.initializeApp(firebaseConfig);
      database = firebase.database();

      if (typeof firebase.auth === "function") {
        auth = firebase.auth();
      }

      console.log("Firebase initialized successfully!");
    } else {
      console.error("Firebase SDK not loaded");
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFirebase);
} else {
  initFirebase();
}

// Admin configuration - List of authorized admin emails
// Only these emails can access the admin panel
const ADMIN_EMAILS = ["jibken80@gmail.com", "jncmukami@gmail.com"];

// Database references - initialized in DOMContentLoaded after database is ready
let packagesRef;
let reviewsRef;

// Sample initial data (used only for first-time setup)
// const initialPackages = [
//   {
//     id: 1,
//     title: "Paris Romantic Getaway",
//     country: "France",
//     region: "europe",
//     price: 2499,
//     duration: "7 Days / 6 Nights",
//     description:
//       "Experience the magic of Paris with romantic dinners, Seine river cruises, and visits to iconic landmarks like the Eiffel Tower and Louvre Museum.",
//     image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600",
//     highlights: [
//       "Eiffel Tower",
//       "Louvre Museum",
//       "Seine Cruise",
//       "Wine Tasting",
//     ],
//   },
//   {
//     id: 2,
//     title: "Tokyo Cultural Adventure",
//     country: "Japan",
//     region: "asia",
//     price: 3299,
//     duration: "10 Days / 9 Nights",
//     description:
//       "Immerse yourself in Japanese culture with visits to ancient temples, modern technology districts, traditional tea ceremonies, and Mount Fuji views.",
//     image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600",
//     highlights: [
//       "Mount Fuji",
//       "Tokyo Tower",
//       "Ancient Temples",
//       "Tea Ceremony",
//     ],
//   },
//   {
//     id: 3,
//     title: "Santorini Island Escape",
//     country: "Greece",
//     region: "europe",
//     price: 2199,
//     duration: "6 Days / 5 Nights",
//     description:
//       "Discover the stunning sunsets of Santorini, white-washed buildings, crystal-clear waters, and delicious Mediterranean cuisine.",
//     image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600",
//     highlights: [
//       "Oia Sunset",
//       "Volcano Tour",
//       "Beach Hopping",
//       "Greek Cuisine",
//     ],
//   },
//   {
//     id: 4,
//     title: "Bali Tropical Paradise",
//     country: "Indonesia",
//     region: "asia",
//     price: 1899,
//     duration: "8 Days / 7 Nights",
//     description:
//       "Relax in Bali's tropical paradise with pristine beaches, ancient temples, lush rice terraces, and vibrant local culture.",
//     image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600",
//     highlights: [
//       "Ubud Rice Terraces",
//       "Temple Tours",
//       "Beach Clubs",
//       "Spa Retreat",
//     ],
//   },
//   {
//     id: 5,
//     title: "Cape Town Safari",
//     country: "South Africa",
//     region: "africa",
//     price: 2799,
//     duration: "9 Days / 8 Nights",
//     description:
//       "Experience the best of Cape Town with Table Mountain, safaris, wine tours, and encounters with penguins at Cape Point.",
//     image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600",
//     highlights: ["Safari", "Table Mountain", "Wine Tasting", "Cape Point"],
//   },
//   {
//     id: 6,
//     title: "New York City Break",
//     country: "USA",
//     region: "americas",
//     price: 2999,
//     duration: "5 Days / 4 Nights",
//     description:
//       "Explore the Big Apple with visits to Times Square, Central Park, Statue of Liberty, and world-class Broadway shows.",
//     image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600",
//     highlights: [
//       "Times Square",
//       "Central Park",
//       "Broadway",
//       "Statue of Liberty",
//     ],
//   },
//   {
//     id: 7,
//     title: "Sydney & Gold Coast",
//     country: "Australia",
//     region: "oceania",
//     price: 3499,
//     duration: "11 Days / 10 Nights",
//     description:
//       "Discover Australia's best with Sydney Opera House, Harbour Bridge, Gold Coast beaches, and Great Barrier Reef snorkeling.",
//     image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600",
//     highlights: [
//       "Opera House",
//       "Great Barrier Reef",
//       "Gold Coast",
//       "Harbour Bridge",
//     ],
//   },
//   {
//     id: 8,
//     title: "Dubai Luxury Escape",
//     country: "UAE",
//     region: "asia",
//     price: 3999,
//     duration: "6 Days / 5 Nights",
//     description:
//       "Experience ultimate luxury in Dubai with desert safaris, Burj Khalifa visits, shopping malls, and traditional souks.",
//     image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600",
//     highlights: ["Burj Khalifa", "Desert Safari", "Dubai Mall", "Marina"],
//   },
//   {
//     id: 9,
//     title: "Rome Historical Tour",
//     country: "Italy",
//     region: "europe",
//     price: 2299,
//     duration: "7 Days / 6 Nights",
//     description:
//       "Walk through history in Rome with visits to the Colosseum, Vatican City, Trevi Fountain, and authentic Italian dining.",
//     image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600",
//     highlights: [
//       "Colosseum",
//       "Vatican City",
//       "Trevi Fountain",
//       "Italian Cuisine",
//     ],
//   },
//   {
//     id: 10,
//     title: "Thailand Discovery",
//     country: "Thailand",
//     region: "asia",
//     price: 1699,
//     duration: "10 Days / 9 Nights",
//     description:
//       "Explore Thailand's rich culture with Bangkok temples, Chiang Mai adventures, and beautiful Phuket beaches.",
//     image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600",
//     highlights: [
//       "Grand Palace",
//       "Elephant Sanctuary",
//       "Phi Phi Islands",
//       "Thai Cooking",
//     ],
//   },
// ];

// const initialReviews = [
//   {
//     id: 1,
//     name: "Sarah Johnson",
//     country: "United Kingdom",
//     package: "Paris Romantic Getaway",
//     rating: 5,
//     text: "Absolutely magical experience! The tour guide was knowledgeable and the accommodations were perfect. The sunset cruise on the Seine was the highlight of our trip.",
//     date: "2026-02-15",
//   },
//   {
//     id: 2,
//     name: "Michael Chen",
//     country: "Canada",
//     package: "Tokyo Cultural Adventure",
//     rating: 5,
//     text: "Japan exceeded all my expectations. The cultural experiences were authentic and the attention to detail was impeccable. Already planning my next trip!",
//     date: "2026-02-10",
//   },
//   {
//     id: 3,
//     name: "Emma Williams",
//     country: "Australia",
//     package: "Bali Tropical Paradise",
//     rating: 4,
//     text: "Beautiful destination and great service. The rice terrace tour was stunning. Would highly recommend to anyone looking for a relaxing getaway.",
//     date: "2026-01-28",
//   },
//   {
//     id: 4,
//     name: "David Martinez",
//     country: "Spain",
//     package: "Santorini Island Escape",
//     rating: 5,
//     text: "The most breathtaking views I've ever seen. The hotel's infinity pool overlooking the caldera was incredible. Perfect honeymoon destination!",
//     date: "2026-01-20",
//   },
// ];

// ============================================
// Navigation
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Firebase database references after DOM is ready
  packagesRef = database ? database.ref("packages") : null;
  reviewsRef = database ? database.ref("reviews") : null;

  // Initialize Firebase data (first time only)
  initializeFirebaseData();

  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Load packages and reviews from Firebase
  loadPackages();
  loadReviews();

  // Initialize carousel after reviews are loaded
  initializeCarousel();

  // Initialize filter buttons
  initializeFilterButtons();

  // Initialize review form
  initializeReviewForm();

  // Initialize contact form for email
  initializeContactFormHandler();

  // Initialize admin functions
  initializeAdmin();
});

// Initialize Firebase with sample data if empty
function initializeFirebaseData() {
  if (!packagesRef || !reviewsRef) {
    console.warn("Database references not initialized");
    return;
  }

  packagesRef.once("value", (snapshot) => {
    if (!snapshot.exists()) {
      packagesRef.set(initialPackages);
    }
  });

  reviewsRef.once("value", (snapshot) => {
    if (!snapshot.exists()) {
      reviewsRef.set(initialReviews);
    }
  });
}

// ============================================
// Packages Display (Read from Firebase)
// ============================================
function loadPackages() {
  if (!packagesRef) {
    console.warn("packagesRef not initialized");
    return;
  }

  const packagesGrid = document.getElementById("packagesGrid");

  packagesRef.on("value", (snapshot) => {
    const packages = [];
    snapshot.forEach((childSnapshot) => {
      packages.push(childSnapshot.val());
    });

    if (packages.length === 0) {
      packagesGrid.innerHTML =
        '<p style="text-align: center; grid-column: 1/-1; color: #666;">No packages available yet.</p>';
      return;
    }

    packagesGrid.innerHTML = packages
      .map((pkg) => createPackageCard(pkg))
      .join("");
  });
}

function createPackageCard(pkg) {
  const regionNames = {
    europe: "Europe",
    asia: "Asia",
    africa: "Africa",
    americas: "Americas",
    oceania: "Oceania",
  };

  return `
        <div class="package-card" data-region="${pkg.region}">
            <div class="package-image">
                <img src="${pkg.image}" alt="${pkg.title}">
                <span class="package-region">${regionNames[pkg.region]}</span>
            </div>
            <div class="package-content">
                <h3>${pkg.title}</h3>
                <p class="package-location"><i class="fas fa-map-marker-alt"></i> ${pkg.country}</p>
                <p class="package-description">${pkg.description}</p>
                <div class="package-meta">
                    <span class="package-duration"><i class="fas fa-clock"></i> ${pkg.duration}</span>
                    <span class="package-price">$${pkg.price} <span>/person</span></span>
                </div>
                <div class="package-highlights">
                    ${pkg.highlights.map((h) => `<span class="highlight-tag">${h}</span>`).join("")}
                </div>
                <button class="btn btn-primary" onclick="bookPackage('${pkg.title}')">Book Now</button>
            </div>
        </div>
    `;
}

function bookPackage(packageTitle) {
  alert(
    `Thank you for your interest in "${packageTitle}"! Please contact us to proceed with your booking.`,
  );
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
}

// ============================================
// Filter Functionality
// ============================================
function initializeFilterButtons() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active button
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Filter packages
      const filter = btn.dataset.filter;
      filterPackages(filter);
    });
  });
}

function filterPackages(filter) {
  const packagesCards = document.querySelectorAll(".package-card");

  packagesCards.forEach((card) => {
    if (filter === "all" || card.dataset.region === filter) {
      card.style.display = "block";
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 10);
    } else {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      setTimeout(() => {
        card.style.display = "none";
      }, 300);
    }
  });
}

// ============================================
// Reviews System (Firebase)
// ============================================
// Reviews Carousel Functionality
// ============================================

let reviews = [];
let currentReviewIndex = 0;

function loadReviews() {
  if (!reviewsRef) {
    console.warn("reviewsRef not initialized");
    return;
  }

  const carouselTrack = document.getElementById("carouselTrack");
  const indicatorsContainer = document.getElementById("carouselIndicators");

  reviewsRef.on("value", (snapshot) => {
    reviews = [];
    snapshot.forEach((childSnapshot) => {
      reviews.push(childSnapshot.val());
    });

    // Sort by most recent first
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (reviews.length === 0) {
      carouselTrack.innerHTML = `
        <div class="no-reviews-message">
            <i class="fas fa-comments"></i>
            <p>No reviews yet. Be the first to share your experience!</p>
        </div>
      `;
      indicatorsContainer.innerHTML = "";
      return;
    }

    // Create carousel slides
    carouselTrack.innerHTML = reviews
      .map((review, index) => createReviewSlide(review, index))
      .join("");

    // Create indicators
    indicatorsContainer.innerHTML = reviews
      .map(
        (_, index) =>
          `<button class="carousel-indicator ${index === 0 ? "active" : ""}" data-index="${index}"></button>`,
      )
      .join("");

    // Add indicator click events
    document.querySelectorAll(".carousel-indicator").forEach((indicator) => {
      indicator.addEventListener("click", () => {
        goToSlide(parseInt(indicator.dataset.index));
      });
    });

    // Initialize particles
    initializeParticles();
  });
}

function createReviewSlide(review, index) {
  const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
  const initials = review.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return `
    <div class="carousel-slide">
      <div class="review-card">
        <div class="reviewer-avatar">${initials}</div>
        <h3 class="reviewer-name">${review.name}</h3>
        <p class="reviewer-country">${review.country}</p>
        <div class="review-stars">
          ${Array(5)
            .fill(0)
            .map(
              (_, i) =>
                `<i class="fas fa-star" style="color: ${i < review.rating ? "#ffd700" : "rgba(255,255,255,0.3)"}"></i>`,
            )
            .join("")}
        </div>
        <p class="review-text">"${review.text}"</p>
        <span class="review-package"><i class="fas fa-map-marker-alt"></i> ${review.package}</span>
      </div>
    </div>
  `;
}

function goToSlide(index) {
  if (index < 0) index = reviews.length - 1;
  if (index >= reviews.length) index = 0;

  currentReviewIndex = index;

  const track = document.getElementById("carouselTrack");
  track.style.transform = `translateX(-${index * 100}%)`;

  // Update indicators
  document.querySelectorAll(".carousel-indicator").forEach((ind, i) => {
    ind.classList.toggle("active", i === index);
  });
}

function initializeParticles() {
  const particlesBg = document.getElementById("particlesBg");

  // Clear existing particles
  particlesBg.innerHTML = "";

  // Create spark elements
  for (let i = 0; i < 8; i++) {
    const spark = document.createElement("div");
    spark.className = "spark";
    spark.style.left = `${Math.random() * 100}%`;
    spark.style.top = `${Math.random() * 100}%`;
    spark.style.animationDelay = `${Math.random() * 8}s`;
    spark.style.animationDuration = `${6 + Math.random() * 4}s`;
    particlesBg.appendChild(spark);
  }
}

function initializeCarousel() {
  const prevBtn = document.getElementById("carouselPrev");
  const nextBtn = document.getElementById("carouselNext");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      goToSlide(currentReviewIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      goToSlide(currentReviewIndex + 1);
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    const carouselSection = document.querySelector(
      ".reviews-carousel-container",
    );
    if (!carouselSection) return;

    const rect = carouselSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
      if (e.key === "ArrowLeft") {
        goToSlide(currentReviewIndex - 1);
      } else if (e.key === "ArrowRight") {
        goToSlide(currentReviewIndex + 1);
      }
    }
  });

  // Auto-advance every 8 seconds
  setInterval(() => {
    if (reviews.length > 1) {
      goToSlide(currentReviewIndex + 1);
    }
  }, 8000);
}

function initializeReviewForm() {
  const form = document.getElementById("reviewForm");
  const starRating = document.querySelectorAll(".star-rating i");
  const ratingInput = document.getElementById("rating");

  // Star rating hover effect
  starRating.forEach((star) => {
    star.addEventListener("mouseover", () => {
      const rating = parseInt(star.dataset.rating);
      updateStars(rating);
    });

    star.addEventListener("click", () => {
      const rating = parseInt(star.dataset.rating);
      ratingInput.value = rating;
      updateStars(rating);
    });
  });

  function updateStars(rating) {
    starRating.forEach((star, index) => {
      if (index < rating) {
        star.classList.add("active");
      } else {
        star.classList.remove("active");
      }
    });
  }

  // Reset stars when mouse leaves
  document.querySelector(".star-rating").addEventListener("mouseleave", () => {
    const currentRating = parseInt(ratingInput.value);
    updateStars(currentRating);
  });

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!reviewsRef) {
      alert("Database not initialized. Please refresh the page.");
      return;
    }

    const rating = parseInt(document.getElementById("rating").value);

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    const newReview = {
      id: Date.now(),
      name: document.getElementById("reviewerName").value,
      country: document.getElementById("reviewerCountry").value,
      package: document.getElementById("tourPackage").value,
      rating: rating,
      text: document.getElementById("reviewText").value,
      date: new Date().toISOString().split("T")[0],
    };

    // Save to Firebase
    reviewsRef
      .push(newReview)
      .then(() => {
        loadReviews();
        form.reset();
        updateStars(0);
        alert("Thank you for your review! It has been posted.");
      })
      .catch((error) => {
        console.error("Error adding review: ", error);
        alert("Error posting review. Please try again.");
      });
  });
}

// ============================================
// Contact Form - EmailJS Integration
// ============================================
function initializeContactFormHandler() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("contactName").value;
    const email = document.getElementById("contactEmail").value;
    const subject = document.getElementById("contactSubject").value;
    const message = document.getElementById("contactMessage").value;
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    // Using EmailJS - Replace with your actual EmailJS credentials
    // Sign up at https://www.emailjs.com/ to get these values
    const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
    const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
    const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

    // If EmailJS is not configured, show alert with the form data
    if (EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID") {
      alert(
        `Contact Form Submitted!\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}\n\n📧 To receive emails:\n1. Sign up at https://www.emailjs.com/\n2. Create an email service\n3. Update main.js with your credentials`,
      );
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
      return;
    }

    try {
      if (typeof emailjs !== "undefined") {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name: name,
          from_email: email,
          subject: subject,
          message: message,
        });
        alert("Message sent successfully! We'll get back to you soon.");
        contactForm.reset();
      } else {
        alert(
          `Message ready to send!\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
        );
        contactForm.reset();
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Failed to send message. Please try again or contact us directly.");
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";
  });
}

// ============================================
// Admin Panel - Firebase Authentication + CRUD
// ============================================
let isAdminLoggedIn = false;

function initializeAdmin() {
  // Hide admin link by default for clients
  const adminLink = document.querySelector(".admin-link");
  if (adminLink) {
    adminLink.style.display = "none";
  }

  // Check if auth is initialized
  if (!auth) {
    console.warn("Firebase Auth not initialized yet");
    return;
  }

  // Set up Firebase Auth state observer
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      const adminSession = localStorage.getItem("adminSession");
      const userEmail = user.email;

      // Verify user is in admin list
      if (adminSession && ADMIN_EMAILS.includes(userEmail)) {
        showAdminDashboard();
        if (adminLink) {
          adminLink.style.display = "inline";
        }
      } else {
        // Clear session if not admin
        localStorage.removeItem("adminSession");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
      }
    } else {
      // User is signed out
      localStorage.removeItem("adminSession");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminEmail");

      const adminDash = document.getElementById("adminDashboard");
      const adminLoginDiv = document.getElementById("adminLogin");

      if (adminDash && adminDash.style.display === "block") {
        adminDash.style.display = "none";
        if (adminLoginDiv) {
          adminLoginDiv.style.display = "block";
        }
      }
    }
  });

  // Login form handler
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleAdminLogin);
  }

  // Logout button handler
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleAdminLogout);
  }

  // Add package form handler
  const addPackageForm = document.getElementById("addPackageForm");
  if (addPackageForm) {
    addPackageForm.addEventListener("submit", handleAddPackage);
  }

  // Edit package form handler
  const editPackageForm = document.getElementById("editPackageForm");
  if (editPackageForm) {
    editPackageForm.addEventListener("submit", handleUpdatePackage);
  }

  // Modal close handlers
  const closeModal = document.querySelector(".close-modal");
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      document.getElementById("editModal").style.display = "none";
    });
  }

  // Load admin packages
  loadAdminPackages();
}

function handleAdminLogin(e) {
  e.preventDefault();

  // Get error message element
  const errorEl = document.getElementById("loginError");

  // Hide error message initially
  if (errorEl) {
    errorEl.style.display = "none";
    errorEl.className = "error-message";
  }

  // Check if auth is initialized
  if (!auth) {
    if (errorEl) {
      errorEl.textContent =
        "Authentication not ready. Please refresh the page and try again.";
      errorEl.style.display = "block";
    }
    return;
  }

  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const loginBtn = document.querySelector('#loginForm button[type="submit"]');

  // Show loading state
  if (loginBtn) {
    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";
  }

  // Authenticate with Firebase
  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Check if user email is in the allowed admin list
      const user = userCredential.user;

      if (ADMIN_EMAILS.includes(user.email)) {
        // Admin verified - set session
        user.getIdToken().then((idToken) => {
          localStorage.setItem("adminToken", idToken);
          localStorage.setItem("adminEmail", user.email);
          localStorage.setItem("adminSession", "true");

          showAdminDashboard();
          document.getElementById("loginForm").reset();
          console.log("Admin logged in:", user.email);
        });
      } else {
        // User is authenticated but not an admin
        auth.signOut();
        if (errorEl) {
          errorEl.textContent =
            "Access denied. You are not authorized to access the admin panel.";
          errorEl.style.display = "block";
        }
        console.warn("Unauthorized login attempt:", user.email);
      }
    })
    .catch((error) => {
      console.error("Login error:", error);
      let errorMessage = "Login failed. Please check your credentials.";

      if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password.";
      }

      if (errorEl) {
        errorEl.textContent = errorMessage;
        errorEl.style.display = "block";
      }
    })
    .finally(() => {
      // Reset button state
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
      }
    });
}

function handleAdminLogout() {
  // Sign out from Firebase
  auth
    .signOut()
    .then(() => {
      console.log("User signed out from Firebase");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });

  isAdminLoggedIn = false;
  localStorage.removeItem("adminSession");
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminEmail");

  document.getElementById("adminDashboard").style.display = "none";
  document.getElementById("adminLogin").style.display = "block";

  const adminLink = document.querySelector(".admin-link");
  if (adminLink) {
    adminLink.style.display = "none";
  }
}

function showAdminDashboard() {
  const adminLink = document.querySelector(".admin-link");
  if (adminLink) {
    adminLink.style.display = "inline";
  }
  document.getElementById("adminLogin").style.display = "none";
  document.getElementById("adminDashboard").style.display = "block";
  loadAdminPackages();
}

function loadAdminPackages() {
  if (!packagesRef) return;

  packagesRef.on("value", (snapshot) => {
    const tbody = document.getElementById("adminPackagesBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    snapshot.forEach((childSnapshot) => {
      const pkg = childSnapshot.val();
      const key = childSnapshot.key;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${pkg.image}" alt="${pkg.title}" style="width: 60px; height: 40px; object-fit: cover;"></td>
        <td>${pkg.title}</td>
        <td>${pkg.country}</td>
        <td>${pkg.region}</td>
        <td>${pkg.price}</td>
        <td>${pkg.duration}</td>
        <td>
          <button class="btn btn-small" onclick="editPackage('${key}')">Edit</button>
          <button class="btn btn-small btn-danger" onclick="deletePackage('${key}')">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  });
}

function handleAddPackage(e) {
  e.preventDefault();

  if (!packagesRef) {
    alert("Database not initialized");
    return;
  }

  const newPackage = {
    title: document.getElementById("packageTitle").value,
    country: document.getElementById("packageCountry").value,
    region: document.getElementById("packageRegion").value,
    price: parseInt(document.getElementById("packagePrice").value),
    duration: document.getElementById("packageDuration").value,
    description: document.getElementById("packageDescription").value,
    image: document.getElementById("packageImage").value,
    highlights: document
      .getElementById("packageHighlights")
      .value.split(",")
      .map((h) => h.trim()),
  };

  packagesRef
    .push(newPackage)
    .then(() => {
      alert("Package added successfully!");
      document.getElementById("addPackageForm").reset();
    })
    .catch((error) => {
      console.error("Error adding package:", error);
      alert("Failed to add package. Please try again.");
    });
}

window.editPackage = function (key) {
  packagesRef.child(key).once("value", (snapshot) => {
    const pkg = snapshot.val();
    if (!pkg) return;

    document.getElementById("editPackageId").value = key;
    document.getElementById("editPackageTitle").value = pkg.title;
    document.getElementById("editPackageCountry").value = pkg.country;
    document.getElementById("editPackageRegion").value = pkg.region;
    document.getElementById("editPackagePrice").value = pkg.price;
    document.getElementById("editPackageDuration").value = pkg.duration;
    document.getElementById("editPackageDescription").value = pkg.description;
    document.getElementById("editPackageImage").value = pkg.image;
    document.getElementById("editPackageHighlights").value =
      pkg.highlights.join(", ");

    document.getElementById("editModal").style.display = "block";
  });
};

window.deletePackage = function (key) {
  if (!confirm("Are you sure you want to delete this package?")) return;

  packagesRef
    .child(key)
    .remove()
    .then(() => {
      alert("Package deleted successfully!");
    })
    .catch((error) => {
      console.error("Error deleting package:", error);
      alert("Failed to delete package. Please try again.");
    });
};

function handleUpdatePackage(e) {
  e.preventDefault();

  const key = document.getElementById("editPackageId").value;
  if (!key || !packagesRef) {
    alert("Invalid package");
    return;
  }

  const updatedPackage = {
    title: document.getElementById("editPackageTitle").value,
    country: document.getElementById("editPackageCountry").value,
    region: document.getElementById("editPackageRegion").value,
    price: parseInt(document.getElementById("editPackagePrice").value),
    duration: document.getElementById("editPackageDuration").value,
    description: document.getElementById("editPackageDescription").value,
    image: document.getElementById("editPackageImage").value,
    highlights: document
      .getElementById("editPackageHighlights")
      .value.split(",")
      .map((h) => h.trim()),
  };

  packagesRef
    .child(key)
    .update(updatedPackage)
    .then(() => {
      alert("Package updated successfully!");
      document.getElementById("editModal").style.display = "none";
    })
    .catch((error) => {
      console.error("Error updating package:", error);
      alert("Failed to update package. Please try again.");
    });
}

// WhatsApp Floating Widget Functionality
document.addEventListener("DOMContentLoaded", function () {
  const whatsappFloat = document.getElementById("whatsappFloat");
  const whatsappPopup = document.getElementById("whatsappPopup");
  const whatsappClose = document.getElementById("whatsappClose");

  // Toggle popup on float button click
  if (whatsappFloat) {
    whatsappFloat.addEventListener("click", function (e) {
      e.stopPropagation();
      whatsappPopup.classList.toggle("active");
    });
  }

  // Close popup on close button click
  if (whatsappClose) {
    whatsappClose.addEventListener("click", function () {
      whatsappPopup.classList.remove("active");
    });
  }

  // Close popup when clicking outside
  document.addEventListener("click", function (e) {
    if (whatsappPopup && whatsappFloat) {
      if (
        !whatsappPopup.contains(e.target) &&
        !whatsappFloat.contains(e.target)
      ) {
        whatsappPopup.classList.remove("active");
      }
    }
  });

  // Prevent popup from closing when clicking inside it
  if (whatsappPopup) {
    whatsappPopup.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }
});
