(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const toTop = document.getElementById('toTop');
  const year = document.getElementById('year');
  const lastUpdated = document.getElementById('lastUpdated');

  // Footer info
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
  if (lastUpdated) {
    const updatedDate = new Date(document.lastModified);
    lastUpdated.textContent = updatedDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Theme: load saved preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    root.setAttribute('data-theme', savedTheme);
  }
  updateThemeButton();

  themeToggle?.addEventListener('click', () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = root.getAttribute('data-theme') || (prefersDark ? 'dark' : 'light');
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    updateThemeButton();
  });

  function updateThemeButton() {
    if (!themeToggle) return;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeAttribute = root.getAttribute('data-theme');
    const isDark = themeAttribute ? themeAttribute === 'dark' : prefersDark;

    themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('title', isDark ? '라이트 모드로 전환' : '다크 모드로 전환');
  }

  // Mobile nav toggle
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu?.classList.toggle('open');
    navToggle.setAttribute('aria-label', expanded ? '메뉴 열기' : '메뉴 닫기');
  });

  // Close menu after clicking a link (mobile)
  navMenu?.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest('a')) {
      navMenu.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
      navToggle?.setAttribute('aria-label', '메뉴 열기');
    }
  });

  // Back to top button visibility
  const updateToTopVisibility = () => {
    if (!toTop) return;
    if (window.scrollY > 600) {
      toTop.classList.add('show');
    } else {
      toTop.classList.remove('show');
    }
  };
  window.addEventListener('scroll', updateToTopVisibility, { passive: true });
  updateToTopVisibility();
  toTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Active section highlight in nav
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav__menu a'));
  const linkById = (id) => navLinks.find((anchor) => anchor.getAttribute('href') === #);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = linkById(entry.target.id);
          if (link) {
            link.classList.toggle('active', entry.isIntersecting);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
  }
})();
