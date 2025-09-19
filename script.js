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

  // Mobile nav toggle
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu?.classList.toggle('open');
    navToggle.setAttribute('aria-label', expanded ? '메뉴 열기' : '메뉴 닫기');
  });
  // Close menu after clicking a link (mobile)
  navMenu?.addEventListener('click', (e) => {
    if ((e.target).closest('a')) {
      navMenu.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
      navToggle?.setAttribute('aria-label', '메뉴 열기');
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
  const linkById = (id) => navLinks.find(a => a.getAttribute('href') === `#${id}`);
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = linkById(entry.target.id);
      if (link) link.classList.toggle('active', entry.isIntersecting);
    });
  }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => io.observe(s));
})();
