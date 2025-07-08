// Loading Screen
window.addEventListener('load', function() {
    setTimeout(() => {
        document.getElementById('loadingScreen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loadingScreen').style.display = 'none';
        }, 500);
    }, 1000);
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

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    const scrollToTop = document.getElementById('scrollToTop');
    
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
        scrollToTop.classList.add('show');
    } else {
        navbar.classList.remove('scrolled');
        scrollToTop.classList.remove('show');
    }
});

// Scroll to top functionality
document.getElementById('scrollToTop').addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    // About section animation
    observer.observe(document.getElementById('aboutText'));
    observer.observe(document.getElementById('aboutImage'));

    // Projects animation
    document.querySelectorAll('.project-card').forEach((card, index) => {
        setTimeout(() => {
            observer.observe(card);
        }, index * 200);
    });

    // Skills animation
    document.querySelectorAll('.skill').forEach((skill, index) => {
        setTimeout(() => {
            observer.observe(skill);
        }, index * 100);
    });
});

// Contact form handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Simple validation
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }

    // Simulate form submission
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    setTimeout(() => {
        alert('Thank you for your message! I\'ll get back to you soon.');
        this.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
});

// Typing animation for hero text
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    
    typing();
}

// Particle effect for hero section
function createParticles() {
    const hero = document.querySelector('.hero');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${3 + Math.random() * 4}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        hero.appendChild(particle);
    }
}

// Initialize particles
createParticles();

// Add floating animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
    }
`;
document.head.appendChild(style);

// Skills progress animation
function animateSkills() {
    const skills = document.querySelectorAll('.skill');
    skills.forEach((skill, index) => {
        skill.style.animationDelay = `${index * 0.1}s`;
    });
}

// Initialize skills animation when skills section is visible
const skillsSection = document.getElementById('skills');
observer.observe(skillsSection);

// Add click effects to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function(e) {
        if (e.target.tagName !== 'A') {
            const link = this.querySelector('.project-link');
            if (link) {
                link.click();
            }
        }
    });
});

// Add ripple effect to buttons
function addRippleEffect(button) {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Apply ripple effect to all buttons
document.querySelectorAll('button, .project-link, .cta-button').forEach(addRippleEffect);

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Dynamic text color based on scroll position
function updateTextColor() {
    const scrolled = window.pageYOffset;
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrolled;
        const sectionHeight = rect.height;
        
        if (scrolled >= sectionTop - 100 && scrolled < sectionTop + sectionHeight - 100) {
            // Update active nav link
            const navLinks = document.querySelectorAll('.nav-right a');
            navLinks.forEach(link => link.classList.remove('active'));
            
            const activeLink = document.querySelector(`a[href="#${section.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', updateTextColor);

// Mouse cursor effect
function createCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 20px;
        height: 20px;
        background: rgba(102, 126, 234, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: all 0.1s ease;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Cursor hover effects
    document.querySelectorAll('a, button, .project-card').forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.background = 'rgba(102, 126, 234, 0.8)';
        });
        
        element.addEventListener('mouseleave', function() {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'rgba(102, 126, 234, 0.5)';
        });
    });
}

// Initialize cursor effect (only on desktop)
if (window.innerWidth > 768) {
    createCursor();
}

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Performance optimization: debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    updateTextColor();
    
    // Update navbar
    const navbar = document.getElementById('navbar');
    const scrollToTop = document.getElementById('scrollToTop');
    
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
        scrollToTop.classList.add('show');
    } else {
        navbar.classList.remove('scrolled');
        scrollToTop.classList.remove('show');
    }
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('click', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        // Easter egg activated
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// Progressive Web App features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker would be registered here in a real app
        console.log('Portfolio ready for PWA features');
    });
}

// Analytics tracking (placeholder)
function trackEvent(event, data) {
    // This would integrate with Google Analytics or other analytics services
    console.log('Event tracked:', event, data);
}

// Track important user interactions
document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', function() {
        trackEvent('project_click', {
            project: this.closest('.project-card').querySelector('h3').textContent
        });
    });
});

document.getElementById('contactForm').addEventListener('submit', function() {
    trackEvent('contact_form_submit', {
        timestamp: new Date().toISOString()
    });
});

// Initialize all features
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio initialized with enhanced features');
    
    // Add some final touches
    document.body.style.opacity = '1';
    
    // Preload critical images
    const criticalImages = [
        'https://via.placeholder.com/250x250/667eea/ffffff?text=Daksh+Arya'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});