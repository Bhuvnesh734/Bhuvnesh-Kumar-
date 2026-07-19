document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. PRELOADER
  ========================================================= */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('done'), 500);
  });
  // fallback in case load event already fired
  setTimeout(() => preloader.classList.add('done'), 2000);

  /* =========================================================
     2. THEME TOGGLE (persisted)
  ========================================================= */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleMobile = document.getElementById('themeToggleMobile');

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      updateThemeIcons('fa-sun');
    } else {
      root.removeAttribute('data-theme');
      updateThemeIcons('fa-moon');
    }
  }
  function updateThemeIcons(iconClass) {
    [themeToggle, themeToggleMobile].forEach(btn => {
      if (!btn) return;
      const i = btn.querySelector('i');
      i.className = 'fa-solid ' + iconClass;
    });
  }
  function toggleTheme() {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('portfolio-theme', next); } catch (e) { /* storage unavailable */ }
  }
  let savedTheme = 'light';
  try { savedTheme = localStorage.getItem('portfolio-theme') || 'light'; } catch (e) { /* storage unavailable */ }
  applyTheme(savedTheme);
  themeToggle && themeToggle.addEventListener('click', toggleTheme);
  themeToggleMobile && themeToggleMobile.addEventListener('click', toggleTheme);

  /* =========================================================
     3. MOBILE MENU
  ========================================================= */
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const overlayMenu = document.getElementById('overlayMenu');

  menuToggle && menuToggle.addEventListener('click', () => overlayMenu.classList.add('open'));
  menuClose && menuClose.addEventListener('click', () => overlayMenu.classList.remove('open'));
  overlayMenu && overlayMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => overlayMenu.classList.remove('open'));
  });

  /* =========================================================
     4. SCROLL PROGRESS BAR
  ========================================================= */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }

  /* =========================================================
     5. SCROLLSPY (active spine link + mobile bar highlight)
  ========================================================= */
  const sections = document.querySelectorAll('.section');
  const spineLinks = document.querySelectorAll('.spine-link');

  function updateActiveSection() {
    let current = sections[0] ? sections[0].id : '';
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) current = sec.id;
    });
    spineLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  /* =========================================================
     6. BACK TO TOP BUTTON
  ========================================================= */
  const backToTop = document.getElementById('backToTop');
  function updateBackToTop() {
    backToTop.classList.toggle('show', window.scrollY > 500);
  }
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Combine all scroll-driven updates into one listener */
  window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateActiveSection();
    updateBackToTop();
  });
  updateScrollProgress();
  updateActiveSection();
  updateBackToTop();

  /* =========================================================
     7. REVEAL ON SCROLL (IntersectionObserver)
  ========================================================= */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* =========================================================
     8. TYPING EFFECT (hero role)
  ========================================================= */
  const typedRole = document.getElementById('typedRole');
  const roles = ['things for the web', 'clean interfaces', 'fast experiences', 'useful products'];
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typedRole.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      typedRole.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 70);
  }
  if (typedRole) typeLoop();

  /* =========================================================
     9. ANIMATED STAT COUNTERS
  ========================================================= */
  const statNumbers = document.querySelectorAll('.stat-number');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  statNumbers.forEach(el => statObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* =========================================================
     10. SKILL BARS ANIMATION
  ========================================================= */
  const barFills = document.querySelectorAll('.bar-fill');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pct = entry.target.getAttribute('data-percent');
        entry.target.style.width = pct + '%';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  barFills.forEach(el => barObserver.observe(el));

  /* =========================================================
     11. TABS (skills + experience)
  ========================================================= */
  document.querySelectorAll('[data-tabs]').forEach(group => {
    const buttons = group.querySelectorAll('.tab-btn');
    const panels = group.querySelectorAll('.tab-panel');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = group.querySelector('[data-panel="' + btn.dataset.tab + '"]');
        if (target) {
          target.classList.add('active');
          target.querySelectorAll('.bar-fill').forEach(fill => {
            const pct = fill.getAttribute('data-percent');
            fill.style.width = pct + '%';
          });
        }
      });
    });
  });

  /* =========================================================
     12. PROJECT FILTER
  ========================================================= */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('hide', !match);
      });
    });
  });

  /* =========================================================
     13. PROJECT MODAL
  ========================================================= */
  const projectModal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTags = document.getElementById('modalTags');
  const modalClose = document.getElementById('modalClose');

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      modalTitle.textContent = card.getAttribute('data-title');
      modalDesc.textContent = card.getAttribute('data-desc');
      const tags = card.getAttribute('data-tags').split(',');
      modalTags.innerHTML = tags.map(t => '<span>' + t.trim() + '</span>').join('');
      projectModal.classList.add('open');
      projectModal.setAttribute('aria-hidden', 'false');
    });
  });

  function closeModal() {
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
  }
  modalClose.addEventListener('click', closeModal);
  projectModal.addEventListener('click', (e) => { if (e.target === projectModal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* =========================================================
     14. TESTIMONIAL SLIDER
  ========================================================= */
  const testiTrack = document.getElementById('testiTrack');
  const testiCards = testiTrack ? testiTrack.querySelectorAll('.testi-card') : [];
  const testiDots = document.getElementById('testiDots');
  let testiIndex = 0;

  if (testiCards.length) {
    testiCards.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToTesti(i));
      testiDots.appendChild(dot);
    });

    function goToTesti(i) {
      testiIndex = (i + testiCards.length) % testiCards.length;
      testiTrack.style.transform = 'translateX(-' + (testiIndex * 100) + '%)';
      testiTrack.style.transition = 'transform 0.5s ease';
      [...testiDots.children].forEach((d, idx) => d.classList.toggle('active', idx === testiIndex));
    }

    document.getElementById('testiPrev').addEventListener('click', () => goToTesti(testiIndex - 1));
    document.getElementById('testiNext').addEventListener('click', () => goToTesti(testiIndex + 1));

    let autoplay = setInterval(() => goToTesti(testiIndex + 1), 6000);
    testiTrack.closest('.testi-slider').addEventListener('mouseenter', () => clearInterval(autoplay));
    testiTrack.closest('.testi-slider').addEventListener('mouseleave', () => {
      autoplay = setInterval(() => goToTesti(testiIndex + 1), 6000);
    });
  }

  /* =========================================================
     15. BLOG SEARCH FILTER
  ========================================================= */
  const blogSearch = document.getElementById('blogSearch');
  const blogCards = document.querySelectorAll('.blog-card');
  const blogEmpty = document.getElementById('blogEmpty');

  blogSearch && blogSearch.addEventListener('input', () => {
    const q = blogSearch.value.trim().toLowerCase();
    let visibleCount = 0;
    blogCards.forEach(card => {
      const title = card.getAttribute('data-title') || '';
      const match = title.includes(q);
      card.classList.toggle('hide', !match);
      if (match) visibleCount++;
    });
    blogEmpty.hidden = visibleCount !== 0;
  });

  /* =========================================================
     16. FAQ ACCORDION
  ========================================================= */
  document.querySelectorAll('.accordion-item').forEach(item => {
    const head = item.querySelector('.accordion-head');
    const body = item.querySelector('.accordion-body');
    head.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.accordion-item').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.accordion-body').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* =========================================================
     17. TOAST NOTIFICATIONS
  ========================================================= */
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(message, icon) {
    toast.innerHTML = '<i class="fa-solid ' + (icon || 'fa-circle-check') + '"></i><span>' + message + '</span>';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  /* =========================================================
     18. CONTACT FORM VALIDATION
  ========================================================= */
  const contactForm = document.getElementById('contactForm');
  contactForm && contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    contactForm.querySelectorAll('.form-group').forEach(group => {
      const input = group.querySelector('input, textarea');
      const errorEl = group.querySelector('.form-error');
      let message = '';
      if (!input.value.trim()) {
        message = 'This field is required.';
      } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        message = 'Enter a valid email address.';
      }
      group.classList.toggle('error', !!message);
      errorEl.textContent = message;
      if (message) valid = false;
    });

    if (valid) {
      showToast('Message sent successfully.', 'fa-paper-plane');
      contactForm.reset();
    } else {
      showToast('Please fix the highlighted fields.', 'fa-triangle-exclamation');
    }
  });

  /* =========================================================
     19. NEWSLETTER FORM
  ========================================================= */
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm && newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Subscribed. Thanks for joining!', 'fa-bell');
    newsletterForm.reset();
  });

  /* =========================================================
     20. COPY EMAIL TO CLIPBOARD
  ========================================================= */
  const copyEmail = document.getElementById('copyEmail');
  copyEmail && copyEmail.addEventListener('click', async () => {
    const email = document.getElementById('emailText').textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
      showToast('Email copied to clipboard.', 'fa-copy');
    } catch (e) {
      showToast('Could not copy email.', 'fa-triangle-exclamation');
    }
  });

  /* =========================================================
     21. FOOTER YEAR
  ========================================================= */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================================================
     22. SMOOTH ANCHOR SCROLL OFFSET FIX (for fixed headers)
  ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

});
