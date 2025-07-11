document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const themeToggleBtn = document.querySelector('.theme-toggle-btn');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');

    // Set initial theme
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Toggle theme
    function toggleTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    }

    themeToggle?.addEventListener('click', toggleTheme);
    themeToggleBtn?.addEventListener('click', toggleTheme);

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuToggle?.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle?.classList.remove('active');
            navLinks?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll to top functionality
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Animate stats counter
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                stat.textContent = Math.floor(current);
                
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                }
            }, 16);
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Animate stats when about section is visible
                if (entry.target.id === 'about') {
                    animateStats();
                }
                
                // Animate skill bars when skills section is visible
                if (entry.target.id === 'skills') {
                    document.querySelectorAll('.skill-progress').forEach(bar => {
                        const level = bar.parentElement.parentElement.getAttribute('data-level');
                        bar.style.width = `${level}%`;
                    });
                    
                    // Initialize skills chart
                    initSkillsChart();
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Initialize skills chart
    function initSkillsChart() {
        const ctx = document.getElementById('skillsChart').getContext('2d');
        const skillsChart = new Chart(ctx, {
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
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(200, 200, 200, 0.3)'
                        },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: {
                            display: false,
                            stepSize: 20
                        },
                        grid: {
                            color: 'rgba(200, 200, 200, 0.3)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                elements: {
                    line: {
                        tension: 0.1
                    }
                }
            }
        });
    }

    // Form validation
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const btnText = btn.querySelector('.btn-text');
            const btnLoader = btn.querySelector('.btn-loader');
            
            // Show loading state
            btnText.style.display = 'none';
            btnLoader.style.display = 'flex';
            btn.disabled = true;
            
            // Reset error messages
            document.querySelectorAll('.error-message').forEach(el => {
                el.textContent = '';
            });
            
            // Simulate form submission
            setTimeout(() => {
                // Hide loading state
                btnText.style.display = 'block';
                btnLoader.style.display = 'none';
                btn.disabled = false;
                
                // Show success message
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            }, 1500);
        });
        
        // Basic form validation
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', function() {
                const error = this.nextElementSibling;
                
                if (this.required && !this.value.trim()) {
                    error.textContent = 'This field is required';
                } else if (this.type === 'email' && !this.validity.valid) {
                    error.textContent = 'Please enter a valid email';
                } else {
                    error.textContent = '';
                }
            });
        });
    }

    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});