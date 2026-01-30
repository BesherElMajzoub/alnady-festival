document.addEventListener("DOMContentLoaded", () => {
  const WA_NUMBER = "966556288161";
  const WA_MESSAGE = "السلام عليكم، أبغى تجهيز فعالية/افتتاح في الرياض. ممكن تفاصيل وتنسيق سريع؟";

  /* Logo fallback */
  const logoImg = document.querySelector(".logo-img");
  if (logoImg) {
    const markBroken = () => logoImg.classList.add("is-broken");
    const markOk = () => logoImg.classList.remove("is-broken");
    if (logoImg.complete && logoImg.naturalWidth === 0) markBroken();
    logoImg.addEventListener("error", markBroken);
    logoImg.addEventListener("load", markOk);
  }

  /* Toast */
  const toast = document.querySelector(".toast");
  let toastTimer = null;
  const showToast = (text) => {
    if (!toast) return;
    toast.textContent = text;
    toast.hidden = false;
    toast.classList.add("is-visible");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
      toastTimer = setTimeout(() => {
        toast.hidden = true;
      }, 220);
    }, 2000);
  };

  /* Drawer */
  const drawer = document.getElementById("mobileMenu");
  const overlay = document.querySelector(".drawer-overlay");
  const menuToggle = document.querySelector(".menu-toggle");
  const drawerClose = document.querySelector(".drawer-close");
  const mobileLinks = drawer ? drawer.querySelectorAll(".mobile-nav a") : [];
  if (drawer) drawer.setAttribute("aria-hidden", "true");

  const openDrawer = () => {
    if (!drawer) return;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    if (overlay) {
      overlay.hidden = false;
      overlay.classList.add("is-visible");
    }
    document.body.classList.add("drawer-open");
    document.body.style.overflow = "hidden";
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
  };

  const closeDrawer = () => {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    if (overlay) {
      overlay.classList.remove("is-visible");
    }
    document.body.classList.remove("drawer-open");
    document.body.style.overflow = "";
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    if (overlay) {
      setTimeout(() => {
        overlay.hidden = true;
      }, 300);
    }
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = drawer?.classList.contains("is-open");
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  drawerClose?.addEventListener("click", closeDrawer);
  overlay?.addEventListener("click", closeDrawer);
  
  // Close drawer and smooth scroll to section with offset correction
  mobileLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        closeDrawer();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          setTimeout(() => {
            const headerHeight = document.querySelector(".site-header")?.offsetHeight || 80;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
              top: targetPosition,
              behavior: "smooth"
            });
          }, 320);
        }
      } else {
        closeDrawer();
      }
    });
  });
  
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });
  window.matchMedia("(min-width: 980px)").addEventListener("change", (e) => {
    if (e.matches) closeDrawer();
  });

  /* WhatsApp + Call handlers */
  const whatsappButtons = document.querySelectorAll("[data-whatsapp]");
  whatsappButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      const service = btn.dataset.service ? `\nالخدمة: ${btn.dataset.service}` : "";
      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE + service)}`;
      showToast("جارٍ فتح واتساب…");
      setTimeout(() => {
        window.location.href = url;
      }, 120);
    });
  });

  const callButtons = document.querySelectorAll("[data-call]");
  callButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("جارٍ بدء الاتصال…");
      setTimeout(() => {
        window.location.href = `tel:+${WA_NUMBER}`;
      }, 120);
    });
  });

  /* Work slider */
  const slider = document.querySelector(".work-slider");
  if (slider) {
    const track = slider.querySelector(".work-track");
    const slides = Array.from(track.querySelectorAll(".work-slide"));
    const prevBtn = slider.querySelector(".slider-btn.prev");
    const nextBtn = slider.querySelector(".slider-btn.next");
    const dots = Array.from(document.querySelectorAll(".slider-dots .dot"));
    const isRTL = document.documentElement.dir === "rtl";

    let current = 0;
    let autoplayTimer = null;

    const setActiveDot = () => {
      dots.forEach((dot, index) => {
        dot.setAttribute("aria-selected", index === current ? "true" : "false");
      });
    };

    const goTo = (index) => {
      if (!slides.length) return;
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(${current * -100}%)`;
      setActiveDot();
    };

    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const startAutoplay = () => {
      stopAutoplay();
      autoplayTimer = setInterval(next, 3500);
    };

    prevBtn?.addEventListener("click", () => {
      prev();
      startAutoplay();
    });

    nextBtn?.addEventListener("click", () => {
      next();
      startAutoplay();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        goTo(index);
        startAutoplay();
      });
    });

    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", startAutoplay);
    slider.addEventListener("focusin", stopAutoplay);
    slider.addEventListener("focusout", startAutoplay);

    let touchStartX = 0;
    slider.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.touches[0].clientX;
        stopAutoplay();
      },
      { passive: true }
    );

    slider.addEventListener(
      "touchend",
      (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;
        const threshold = 40;

        if (Math.abs(deltaX) > threshold) {
          const shouldGoNext = isRTL ? deltaX > 0 : deltaX < 0;
          if (shouldGoNext) {
            next();
          } else {
            prev();
          }
        }

        startAutoplay();
      },
      { passive: true }
    );

    const slideImgs = slider.querySelectorAll(".work-media img");
    slideImgs.forEach((img) => {
      const markBroken = () => img.classList.add("is-broken");
      if (img.complete && img.naturalWidth === 0) {
        markBroken();
      }
      img.addEventListener("error", markBroken);
    });

    goTo(0);
    startAutoplay();
  }
});
