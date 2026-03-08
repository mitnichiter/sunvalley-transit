/* ═══════════════════════════════════════════════════
   SUNVALLEY TRANSIT — Main JavaScript
   GSAP + ScrollTrigger, Swiper, Nav, Counters, Forms
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // ─── Mark JS as loaded (enables animation-hidden styles) ───
  document.body.classList.add('js-ready');

  // ─── Reduced Motion Check ───
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion && typeof gsap !== 'undefined') {
    gsap.globalTimeline.timeScale(100);
  }

  // ─── Register GSAP Plugins ───
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    initGSAPAnimations();
  }

  // ─── Init Components ───
  initNavigation();
  initMobileMenu();
  initSwipers();
  initSectionTitleReveal();
  initFAQ();
  initContactForm();
  initFillText();
});


/* ═══════════════════════════════════════════════════
   NAVIGATION — Transparent → Solid on Scroll
   ═══════════════════════════════════════════════════ */
function initNavigation() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const handleScroll = () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Active link highlight (Desktop & Mobile)
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-menu-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}


/* ═══════════════════════════════════════════════════
   MOBILE MENU
   ═══════════════════════════════════════════════════ */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-close');

  if (!toggle || !menu) return;

  const openMenu = () => {
    menu.style.transform = 'translateX(0)';
    document.body.classList.add('mobile-menu-open');
    document.body.style.overflow = 'hidden'; // Prevent body scroll
    toggle.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    menu.style.transform = 'translateX(100%)';
    document.body.classList.remove('mobile-menu-open');
    document.body.style.overflow = ''; // Restore body scroll
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}


/* ═══════════════════════════════════════════════════
   GSAP SCROLL ANIMATIONS
   ═══════════════════════════════════════════════════ */
function initGSAPAnimations() {
  const isMobile = window.innerWidth < 768;
  const revealY = isMobile ? 20 : 40;
  const revealX = isMobile ? 20 : 60;
  const staggerSpeed = isMobile ? 0.08 : 0.15;

  // ─── Reveal Up ───
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.fromTo(el,
      { y: revealY, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // ─── Reveal Left ───
  gsap.utils.toArray('.reveal-left').forEach(el => {
    gsap.fromTo(el,
      { x: -revealX, opacity: 0 },
      {
        x: 0, opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // ─── Reveal Right ───
  gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.fromTo(el,
      { x: revealX, opacity: 0 },
      {
        x: 0, opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // ─── Stagger Children ───
  gsap.utils.toArray('.stagger-children').forEach(container => {
    const children = container.children;
    gsap.fromTo(children,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.6,
        stagger: staggerSpeed,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // ─── Counter Animation ───
  gsap.utils.toArray('.counter').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';

    gsap.fromTo(el, { innerText: 0 }, {
      innerText: target,
      duration: 2.5,
      ease: 'power2.out',
      snap: { innerText: 1 },
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      onUpdate: function () {
        el.textContent = prefix + Math.round(this.targets()[0].innerText) + suffix;
      }
    });
  });

  // ─── Hero Content Entrance — Split Letter Animation ───
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    // Split hero title into individual characters for stagger animation
    const heroTitle = heroContent.querySelector('h1');
    if (heroTitle) {
      // Preserve <br> tags while splitting text into character spans
      const originalHTML = heroTitle.innerHTML;
      const parts = originalHTML.split(/(<br[^>]*>)/gi);
      let newHTML = '';
      parts.forEach(part => {
        if (part.match(/<br[^>]*>/i)) {
          newHTML += part; // Keep <br> as-is
        } else {
          // Decode common entities like &amp; to & before splitting
          const decodedPart = part.replace(/&amp;/g, '&');
          // Split text into words, then characters
          newHTML += decodedPart.split('').map(char =>
            char === ' ' ? '<span style="display:inline-block;width:0.3em;"></span>' :
            `<span style="display:inline-block;">${char}</span>`
          ).join('');
        }
      });
      heroTitle.innerHTML = newHTML;
    }

    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(heroContent.querySelector('.overline'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    );

    // Animate individual letters
    const letterSpans = heroTitle ? heroTitle.querySelectorAll('span') : [];
    if (letterSpans.length > 0) {
      tl.from(letterSpans,
        { y: 80, opacity: 0, rotateX: 15, duration: 0.8, ease: 'power4.out', stagger: 0.025 },
        '-=0.3'
      );
    } else if (heroContent.querySelector('h1')) {
      tl.fromTo(heroContent.querySelector('h1'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        '-=0.3'
      );
    }

    tl.fromTo(heroContent.querySelector('.hero-subtitle'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo(heroContent.querySelector('.hero-actions'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      '-=0.2'
    );
  }

  // ─── Parallax on page hero background images (Desktop Only) ───
  ScrollTrigger.matchMedia({
    "(min-width: 768px)": function() {
      gsap.utils.toArray('.parallax-img').forEach(img => {
        gsap.to(img, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: img.closest('section, header, .page-hero'),
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      });
    }
  });
}

/* ═══════════════════════════════════════════════════
   FILL TEXT ON SCROLL (ATB-Inspired Word Animation)
   ═══════════════════════════════════════════════════ */
function initFillText() {
  const container = document.querySelector('.fill-text-container');
  if (!container || typeof gsap === 'undefined') return;

  const sourceEl = container.querySelector('[data-fill-source]');
  if (!sourceEl) return;

  const text = sourceEl.textContent.trim();
  const words = text.split(/\s+/);

  // Clear and rebuild with word spans
  sourceEl.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');

  const wordEls = sourceEl.querySelectorAll('.word');

  const isMobile = window.innerWidth < 768;

  // Animate each word with scroll progress
  gsap.to(wordEls, {
    scrollTrigger: {
      trigger: container,
      start: isMobile ? 'top 85%' : 'top 70%',
      end: isMobile ? 'bottom 30%' : 'bottom 40%',
      scrub: 1
    },
    stagger: 0.05,
    onUpdate: function () {
      const progress = this.progress();
      wordEls.forEach((word, i) => {
        const wordProgress = i / wordEls.length;
        if (wordProgress <= progress) {
          word.classList.add('filled');
        } else {
          word.classList.remove('filled');
        }
      });
    }
  });
}


/* ═══════════════════════════════════════════════════
   SWIPER INITIALIZATION
   ═══════════════════════════════════════════════════ */
function initSwipers() {
  // ─── Packages Carousel ───
  const packagesEl = document.querySelector('.packages-swiper');
  if (packagesEl && typeof Swiper !== 'undefined') {
    new Swiper(packagesEl, {
      slidesPerView: 1.15,
      spaceBetween: 20,
      grabCursor: true,
      breakpoints: {
        640: { slidesPerView: 1.5, spaceBetween: 24 },
        768: { slidesPerView: 2.2, spaceBetween: 28 },
        1024: { slidesPerView: 3, spaceBetween: 32 },
        1280: { slidesPerView: 3.5, spaceBetween: 32 }
      },
      navigation: {
        nextEl: '.packages-next',
        prevEl: '.packages-prev'
      },
      pagination: {
        el: '.packages-pagination',
        type: 'fraction',
        formatFractionCurrent: (n) => String(n).padStart(2, '0'),
        formatFractionTotal: (n) => String(n).padStart(2, '0')
      }
    });
  }

  // ─── Gallery Slider ───
  const galleryEl = document.querySelector('.gallery-swiper');
  if (galleryEl && typeof Swiper !== 'undefined') {
    new Swiper(galleryEl, {
      slidesPerView: 'auto',
      spaceBetween: 16,
      centeredSlides: false, // Ensure we don't cut off images in the middle
      grabCursor: true,
      freeMode: {
        enabled: true,
        sticky: false,
      },
      loop: true,
      speed: 600,
      navigation: {
        nextEl: '.gallery-next',
        prevEl: '.gallery-prev'
      },
      pagination: {
        el: '.gallery-pagination',
        type: 'fraction'
      }
    });
  }

  // ─── Testimonials Slider (mobile only) ───
  const testiEl = document.querySelector('.testimonials-swiper');
  if (testiEl && typeof Swiper !== 'undefined') {
    new Swiper(testiEl, {
      slidesPerView: 1.2, /* Increased 'peek' amount on mobile */
      spaceBetween: 16,
      grabCursor: true,
      breakpoints: {
        640: { slidesPerView: 1.5, spaceBetween: 20 },
        768: { slidesPerView: 2, spaceBetween: 24 },
        1024: { slidesPerView: 3, spaceBetween: 32 }
      }
    });
  }
}


/* ═══════════════════════════════════════════════════
   FAQ ACCORDION
   ═══════════════════════════════════════════════════ */
function initFAQ() {
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const content = trigger.nextElementSibling;
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close all
      document.querySelectorAll('.faq-trigger').forEach(t => {
        t.setAttribute('aria-expanded', 'false');
        t.nextElementSibling.style.maxHeight = '0';
      });

      // Toggle current
      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}


/* ═══════════════════════════════════════════════════
   CONTACT FORM HANDLING (Static — client-side only)
   ═══════════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('inquiry-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const message = formData.get('message');

    // Basic validation
    if (!name || !email || !message) {
      showFormMessage('Please fill in all required fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFormMessage('Please enter a valid email address.', 'error');
      return;
    }

    // Build WhatsApp message
    const waNumber = '919876543210'; // Replace with actual number
    let waText = `Hello! I'm ${name}.%0A`;
    waText += `Email: ${email}%0A`;
    if (phone) waText += `Phone: ${phone}%0A`;
    waText += `%0AMessage: ${message}`;

    // Show success
    showFormMessage('Thank you for your inquiry! Redirecting to WhatsApp...', 'success');

    // Open WhatsApp after brief delay
    setTimeout(() => {
      window.open(`https://wa.me/${waNumber}?text=${waText}`, '_blank');
    }, 1500);

    form.reset();
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormMessage(msg, type) {
  let messageEl = document.getElementById('form-message');
  if (!messageEl) {
    messageEl = document.createElement('div');
    messageEl.id = 'form-message';
    const form = document.getElementById('inquiry-form');
    form.parentNode.insertBefore(messageEl, form.nextSibling);
  }

  messageEl.textContent = msg;
  messageEl.style.cssText = `
    padding: 1rem 1.5rem;
    border-radius: 12px;
    margin-top: 1rem;
    font-size: 0.9rem;
    font-weight: 500;
    transition: opacity 0.3s ease;
    ${type === 'error'
      ? 'background: #fff0f0; color: #c0392b; border: 1px solid #e0b0b0;'
      : 'background: #f0fff0; color: #27ae60; border: 1px solid #b0e0b0;'
    }
  `;

  setTimeout(() => {
    messageEl.style.opacity = '0';
    setTimeout(() => messageEl.remove(), 300);
  }, 5000);
}


/* ═══════════════════════════════════════════════════
   SMOOTH SCROLL FOR ANCHOR LINKS
   ═══════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ═══════════════════════════════════════════════════
   SECTION TITLE CLIP-REVEAL ON SCROLL
   ═══════════════════════════════════════════════════ */
function initSectionTitleReveal() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Fallback: just show all titles immediately
    document.querySelectorAll('.section-title').forEach(el => el.classList.add('revealed'));
    return;
  }

  document.querySelectorAll('.section-title').forEach(title => {
    ScrollTrigger.create({
      trigger: title,
      start: 'top 85%',
      onEnter: () => title.classList.add('revealed'),
      once: true
    });
  });

  // Also handle the .reveal class elements
  document.querySelectorAll('.reveal:not(.section-title)').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => el.classList.add('revealed'),
      once: true
    });
  });
}

