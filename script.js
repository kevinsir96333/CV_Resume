(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const toTop = document.getElementById('toTop');
  const year = document.getElementById('year');
  const lastUpdated = document.getElementById('lastUpdated');

  // Footer info
  if (year) year.textContent = new Date().getFullYear();
  if (lastUpdated) {
    const d = new Date(document.lastModified);
    lastUpdated.textContent = d.toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric' });
  }

  // Theme: load saved
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    root.setAttribute('data-theme', savedTheme);
  }
  updateThemeButton();

  themeToggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeButton();
  });

  function updateThemeButton(){
    const isDark = (root.getAttribute('data-theme') === 'dark') ||
                   (!root.hasAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches);
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      themeToggle.textContent = isDark ? '☀️' : '🌙';
    }
  }

  const openNavMenu = () => {
    if (!navMenu || !navToggle) return;
    navMenu.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', '메뉴 닫기');
  };

  const closeNavMenu = () => {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', '메뉴 열기');
  };

  // Mobile nav toggle
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    if (expanded) closeNavMenu();
    else openNavMenu();
  });
  // Close menu after clicking a link (mobile)
  navMenu?.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest('a')) {
      closeNavMenu();
    }
  });

  document.addEventListener('click', (event) => {
    if (!navMenu?.classList.contains('open')) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (navMenu.contains(target) || navToggle?.contains(target)) return;
    closeNavMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu?.classList.contains('open')) {
      closeNavMenu();
      navToggle?.focus();
    }
  });

  // "Back to top" visibility
  const onScroll = () => {
    if (!toTop) return;
    if (window.scrollY > 600) toTop.classList.add('show');
    else toTop.classList.remove('show');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Active section highlight in nav
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav__menu a'));
  const sectionVisibility = new Map();
  const setActiveNav = (id) => {
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', Boolean(id) && isActive);
    });
  };
  const clearActiveNav = () => navLinks.forEach(link => link.classList.remove('active'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const ratio = entry.isIntersecting ? entry.intersectionRatio : 0;
      sectionVisibility.set(entry.target.id, ratio);
    });

    let bestId = '';
    let bestRatio = 0;
    sectionVisibility.forEach((ratio, id) => {
      if (ratio > bestRatio) {
        bestId = id;
        bestRatio = ratio;
      }
    });

    if (bestId) setActiveNav(bestId);
    else clearActiveNav();
  }, { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75] });

  sections.forEach(section => {
    sectionVisibility.set(section.id, 0);
    io.observe(section);
  });
})();
