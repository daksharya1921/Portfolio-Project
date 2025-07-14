// App Configuration
const APP_CONFIG = {
  version: '1.1.0',
  theme: {
    localStorageKey: 'theme',
    default: 'light'
  },
  animation: {
    scrollThreshold: 300,
    statsDuration: 2000,
    intersectionOptions: {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }
  },
  form: {
    toastDuration: 3000
  }
};

// Utility Functions
const Utils = {
  debounce: (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  animateValue: (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      element.textContent = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  },

  showToast: (message, duration = APP_CONFIG.form.toastDuration) => {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// Theme Manager
class ThemeManager {
  constructor() {
    this.prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    this.init();
  }

  init() {
    const savedTheme = localStorage.getItem(APP_CONFIG.theme.localStorageKey);
    const currentTheme = savedTheme || 
                       (this.prefersDarkScheme.matches ? 'dark' : APP_CONFIG.theme.default);
    this.setTheme(currentTheme);
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(APP_CONFIG.theme.localStorageKey, theme);
    document.dispatchEvent(
      new CustomEvent('themeChanged', { detail: { theme } })
    );
  }

  toggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
}

// Mobile Menu Manager
class MobileMenuManager {
  constructor() {
    this.menuToggle = document.querySelector('.mobile-menu-toggle');
    this.navLinks = document.querySelector('.nav-links');
    this.init();
  }

  init() {
    if (!this.menuToggle) return;
    this.menuToggle.addEventListener('click', () => this.toggle());
    
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (this.navLinks.classList.contains('active')) {
          this.toggle();
        }
      });
    });
  }

  toggle() {
    const isExpanded = this.menuToggle.getAttribute('aria-expanded') === 'true';
    this.menuToggle.classList.toggle('active');
    this.menuToggle.setAttribute('aria-expanded', !isExpanded);
    this.navLinks.classList.toggle('active');
    document.body.style.overflow = this.navLinks.classList.contains('active') ? 'hidden' : '';
  }
}

// Animation Manager
class AnimationManager {
  constructor() {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      APP_CONFIG.animation.intersectionOptions
    );
    this.statsAnimated = false;
    this.skillsChartInitialized = false;
    this.init();
  }

  init() {
    document.querySelectorAll('.section').forEach(section => {
      this.observer.observe(section);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      
      entry.target.classList.add('animate');
      
      if (entry.target.id === 'about' && !this.statsAnimated) {
        this.animateStats();
      }
      
      if (entry.target.id === 'skills' && !this.skillsChartInitialized) {
        this.initSkillsChart();
      }
    });
  }

  animateStats() {
    this.statsAnimated = true;
    document.querySelectorAll('.stat-number[data-count]').forEach(stat => {
      const target = parseInt(stat.dataset.count);
      Utils.animateValue(stat, 0, target, APP_CONFIG.animation.statsDuration);
    });
  }

  initSkillsChart() {
    this.skillsChartInitialized = true;
    const ctx = document.getElementById('skillsChart')?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'UI/UX', 'Git'],
        datasets: [{
          label: 'Skills Level',
          data: [90, 80, 75, 70, 65, 85],
          backgroundColor: 'rgba(102, 126, 234, 0.2)',
          borderColor: 'rgba(102, 126, 234, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(102, 126, 234, 1)',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { r: { angleLines: { color: 'rgba(200, 200, 200, 0.3)' }, suggestedMin: 0, suggestedMax: 100 } },
        plugins: { legend: { display: false } }
      }
    });
  }
}

// Form Manager
class FormManager {
  constructor() {
    this.form = document.getElementById('contactForm');
    if (!this.form) return;
    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
    });
  }

  validateField(field) {
    const error = field.nextElementSibling;
    if (!error) return true;

    if (field.required && !field.value.trim()) {
      error.textContent = 'This field is required';
      return false;
    }

    if (field.type === 'email' && !field.validity.valid) {
      error.textContent = 'Please enter a valid email';
      return false;
    }

    error.textContent = '';
    return true;
  }

  validateForm() {
    let isValid = true;
    this.form.querySelectorAll('input, textarea').forEach(input => {
      if (!this.validateField(input)) isValid = false;
    });
    return isValid;
  }

  async handleSubmit(e) {
    e.preventDefault();
    if (!this.validateForm()) return;

    const btn = this.form.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');

    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
    btn.disabled = true;

    try {
      // Replace with actual fetch call
      await new Promise(resolve => setTimeout(resolve, 1500));
      Utils.showToast('Message sent successfully!');
      this.form.reset();
    } catch (error) {
      Utils.showToast('Failed to send message. Please try again.');
    } finally {
      btnText.style.display = 'block';
      btnLoader.style.display = 'none';
      btn.disabled = false;
    }
  }
}

// Main App Initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log(`App v${APP_CONFIG.version} initialized`);

  // Initialize managers
  const themeManager = new ThemeManager();
  new MobileMenuManager();
  new AnimationManager();
  new FormManager();

  // Theme toggle event listeners
  document.querySelectorAll('.theme-toggle, .theme-toggle-btn').forEach(el => {
    el?.addEventListener('click', () => themeManager.toggle());
  });

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => this.handleSmoothScroll(e, anchor));
  });

  // Scroll to top
  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', Utils.debounce(() => {
      scrollToTopBtn.classList.toggle('show', window.pageYOffset > APP_CONFIG.animation.scrollThreshold);
    }, 100));

    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Set current year
  document.getElementById('current-year').textContent = new Date().getFullYear();

  // Service worker registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .catch(err => console.error('ServiceWorker failed:', err));
    });
  }
});

// Handle smooth scroll
function handleSmoothScroll(e, anchor) {
  e.preventDefault();
  const targetId = anchor.getAttribute('href');
  const target = document.querySelector(targetId);
  if (!target) return;

  if (document.querySelector('.nav-links.active')) {
    new MobileMenuManager().toggle();
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (targetId !== '#') history.pushState(null, null, targetId);
}
