document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ==========================================
  // 1. ROYAL INTRO & LOADER
  // ==========================================

  const royalIntro = document.getElementById("royal-intro");
  const skipIntroBtn = document.getElementById("skip-intro");
  const loader = document.getElementById("loader");

  let introDismissed = false;

  function dismissIntro() {
    if (introDismissed) return;
    introDismissed = true;

    if (royalIntro) {
      royalIntro.classList.add("fade-out");
      document.body.classList.remove("intro-active");

      window.setTimeout(() => {
        royalIntro.style.display = "none";
      }, 800);
    } else {
      document.body.classList.remove("intro-active");
    }
  }

  if (skipIntroBtn) {
    skipIntroBtn.addEventListener("click", dismissIntro);
  }

  if (royalIntro) {
    window.setTimeout(dismissIntro, 5000);
  } else {
    document.body.classList.remove("intro-active");
  }

  if (loader) {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";

    window.setTimeout(() => {
      loader.style.display = "none";
    }, 400);
  }


  // ==========================================
  // 2. FALLING ROSE PETALS & SMALL FLOWERS
  // ==========================================

  function initFallingPetals() {
    const container = document.getElementById("petal-background");

    if (!container || container.dataset.initialized === "true") {
      return;
    }

    // Respect the visitor's reduced-motion preference.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    container.dataset.initialized = "true";

    const isMobile = window.matchMedia("(max-width: 600px)").matches;

    // Keep the animation lightweight, especially on phones.
    const petalCount = isMobile ? 12 : 24;
    const flowerCount = isMobile ? 3 : 5;

    const petalColors = [
      "#c87586",
      "#e3a1aa",
      "#f0c3c7",
      "#a94f66",
      "#d7a0a7",
      "#f5d8d8"
    ];

    const flowerColors = [
      "#d5a0a9",
      "#f0d4c5",
      "#c6a25e"
    ];

    function randomBetween(min, max) {
      return Math.random() * (max - min) + min;
    }

    function randomItem(items) {
      return items[Math.floor(Math.random() * items.length)];
    }

    // Create falling rose petals.
    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement("span");

      petal.className = "falling-petal";
      petal.setAttribute("aria-hidden", "true");

      petal.style.setProperty(
        "--petal-left",
        randomBetween(0, 100) + "%"
      );

      petal.style.setProperty(
        "--petal-width",
        randomBetween(8, 15) + "px"
      );

      petal.style.setProperty(
        "--petal-height",
        randomBetween(12, 21) + "px"
      );

      petal.style.setProperty(
        "--petal-opacity",
        randomBetween(0.25, 0.5)
      );

      petal.style.setProperty(
        "--petal-duration",
        randomBetween(12, 23) + "s"
      );

      petal.style.setProperty(
        "--petal-delay",
        randomBetween(-23, 0) + "s"
      );

      petal.style.setProperty(
        "--petal-color",
        randomItem(petalColors)
      );

      container.appendChild(petal);
    }

    // Create small decorative falling flowers.
    for (let i = 0; i < flowerCount; i++) {
      const flower = document.createElement("span");

      flower.className = "falling-flower";
      flower.setAttribute("aria-hidden", "true");
      flower.textContent = "✿";

      flower.style.setProperty(
        "--petal-left",
        randomBetween(0, 100) + "%"
      );

      flower.style.setProperty(
        "--flower-size",
        randomBetween(11, 17) + "px"
      );

      flower.style.setProperty(
        "--petal-opacity",
        randomBetween(0.25, 0.45)
      );

      flower.style.setProperty(
        "--petal-duration",
        randomBetween(17, 27) + "s"
      );

      flower.style.setProperty(
        "--petal-delay",
        randomBetween(-25, 0) + "s"
      );

      flower.style.setProperty(
        "--flower-color",
        randomItem(flowerColors)
      );

      container.appendChild(flower);
    }
  }

  initFallingPetals();


  // ==========================================
  // 3. BACKGROUND MUSIC
  // ==========================================

  const music = document.getElementById("background-music");
  const musicToggle = document.getElementById("music-toggle");
  const musicLabel = document.querySelector(".music-toggle-label");

  if (music) {
    music.loop = true;
    music.volume = 0.4;
  }

  function updateMusicButton(isPlaying) {
    if (musicToggle) {
      musicToggle.classList.toggle("music-playing", isPlaying);
      musicToggle.classList.toggle("is-playing", isPlaying);

      musicToggle.setAttribute("aria-pressed", String(isPlaying));

      musicToggle.setAttribute(
        "aria-label",
        isPlaying ? "Pause background music" : "Play background music"
      );
    }

    if (musicLabel) {
      musicLabel.textContent = isPlaying ? "Pause music" : "Play music";
    }
  }

  async function toggleBackgroundMusic() {
    if (!music) return;

    if (!music.paused) {
      music.pause();
      return;
    }

    try {
      await music.play();
    } catch (error) {
      updateMusicButton(false);

      console.error(
        "Music could not play. Check that the audio file path is correct.",
        error
      );
    }
  }

  if (music && musicToggle) {
    musicToggle.addEventListener("click", toggleBackgroundMusic);

    music.addEventListener("play", () => updateMusicButton(true));
    music.addEventListener("pause", () => updateMusicButton(false));
    music.addEventListener("ended", () => updateMusicButton(false));

    updateMusicButton(!music.paused);
  }


  // ==========================================
  // 4. MOBILE MENU
  // ==========================================

  const mobileBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener("click", () => {
      const isExpanded =
        mobileBtn.getAttribute("aria-expanded") === "true";

      mobileBtn.setAttribute("aria-expanded", String(!isExpanded));
      mobileMenu.classList.toggle("active", !isExpanded);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        mobileBtn.setAttribute("aria-expanded", "false");
      });
    });

    // Close the menu when clicking outside it.
    document.addEventListener("click", (event) => {
      if (
        mobileMenu.classList.contains("active") &&
        !mobileMenu.contains(event.target) &&
        !mobileBtn.contains(event.target)
      ) {
        mobileMenu.classList.remove("active");
        mobileBtn.setAttribute("aria-expanded", "false");
      }
    });

    // Close the mobile menu with the Escape key.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        mobileMenu.classList.remove("active");
        mobileBtn.setAttribute("aria-expanded", "false");
      }
    });
  }


  // ==========================================
  // 5. WEDDING COUNTDOWN TIMER
  // Currently set to 15 November 2026, 9:00 AM.
  // ==========================================

  const weddingDate = new Date(
    "November 15, 2026 09:00:00"
  ).getTime();

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function updateCountdown() {
    const now = Date.now();
    const distance = weddingDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minutesEl) minutesEl.textContent = "00";
      if (secondsEl) secondsEl.textContent = "00";
      return;
    }

    const days = Math.floor(
      distance / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) /
      (1000 * 60 * 60)
    );

    const minutes = Math.floor(
      (distance % (1000 * 60 * 60)) /
      (1000 * 60)
    );

    const seconds = Math.floor(
      (distance % (1000 * 60)) / 1000
    );

    if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);


  // ==========================================
  // 6. SCROLL REVEAL ANIMATIONS
  // ==========================================

  const revealItems = document.querySelectorAll(".reveal-item");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.15
      }
    );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });
  } else {
    // Fallback for browsers without IntersectionObserver.
    revealItems.forEach((item) => {
      item.classList.add("revealed");
    });
  }

});