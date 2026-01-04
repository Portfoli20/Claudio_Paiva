
window.addEventListener('load', () => {
    const loader = document.querySelector('.loading');
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
    }, 500);
});


window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.custom-navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.padding = '0.5rem 0';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        navbar.style.padding = '1rem 0';
    }
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});


const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);


document.querySelectorAll('.project-card, .about-image, .section-title, .hero-image, .skill-tags, .social-buttons').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});


const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

const observeSection = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, {
    rootMargin: '-50% 0px -50% 0px'
});

sections.forEach(section => observeSection.observe(section));


document.querySelectorAll('.project-card').forEach(card => {
    const handleHover = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.transform = 'scale(1.02) translateY(-10px)';
        card.style.transition = 'all 0.3s ease';
    };

    const handleLeave = () => {
        card.style.transform = 'none';
    };

    card.addEventListener('mouseenter', handleHover);
    card.addEventListener('mouseleave', handleLeave);
    card.addEventListener('touchstart', handleHover, { passive: true });
    card.addEventListener('touchend', handleLeave);
});


const navbarToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');
let isMenuOpen = false;

if (navbarToggler && navbarCollapse) {
  
    navbarToggler.addEventListener('click', (e) => {
        e.stopPropagation();
        isMenuOpen = !isMenuOpen;
        navbarToggler.setAttribute('aria-expanded', isMenuOpen);
        navbarCollapse.classList.toggle('show');
        
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });


    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
            isMenuOpen = false;
            navbarToggler.setAttribute('aria-expanded', 'false');
            navbarCollapse.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

  
    navbarCollapse.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            isMenuOpen = false;
            navbarToggler.setAttribute('aria-expanded', 'false');
            navbarCollapse.classList.remove('show');
            document.body.style.overflow = '';
        });
    });


    navbarCollapse.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}


window.addEventListener('resize', () => {
    if (window.innerWidth > 991 && isMenuOpen) {
        isMenuOpen = false;
        navbarToggler.setAttribute('aria-expanded', 'false');
        navbarCollapse.classList.remove('show');
        document.body.style.overflow = '';
    }
});


let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
    }, 400);
});


let lastTap = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTap < DOUBLE_TAP_DELAY) {
        e.preventDefault();
    }
    
    lastTap = now;
}, { passive: false });

$(document).on('click', '.carousel-control-prev, .carousel-control-next', function (event) {
    event.preventDefault();  
    $('html, body').scrollTop($(window).scrollTop());
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const offset = 70; 

        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

document.addEventListener('scroll', function() {
    const profilePicSmall = document.getElementById('profile-pic-small');
    const profilePicLarge = document.getElementById('profile-pic-large');
    const profileSection = document.querySelector('.profile');

    if (!profileSection || !profilePicSmall || !profilePicLarge) return;

    const rect = profileSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
        profilePicSmall.style.opacity = '0';  
        profilePicLarge.style.opacity = '1';  
        profilePicLarge.style.transform = 'translateY(0)';  
    } else {
        profilePicSmall.style.opacity = '1';  
        profilePicLarge.style.opacity = '0';  
        profilePicLarge.style.transform = 'translateY(50px)';  
    }
});


const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeIn 1s forwards;
        opacity: 1 !important;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(element => observer.observe(element));

 
    const scrollProgress = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = `${scrolled}%`;
    });

    
    const moreProjects = document.getElementById('more-projects');
    const toggleBtn = document.getElementById('toggle-projects-btn');
    if (moreProjects && toggleBtn && window.jQuery) {
        $('#more-projects').on('shown.bs.collapse', function () {
            toggleBtn.textContent = 'Ver menos projetos';
            toggleBtn.setAttribute('aria-expanded', 'true');
        });
        $('#more-projects').on('hidden.bs.collapse', function () {
            toggleBtn.textContent = 'Ver mais projetos';
            toggleBtn.setAttribute('aria-expanded', 'false');
        });
    }

    // Overlay preview logic for project videos (hover to enlarge, click to open)
    const overlay = document.getElementById('preview-overlay');
    const overlayBody = overlay ? overlay.querySelector('.preview-body') : null;
    const overlayClose = overlay ? overlay.querySelector('.preview-close') : null;

    const openPreview = (videoEl) => {
        if (!overlay || !overlayBody) return;
        overlayBody.innerHTML = '';
        const bigVideo = document.createElement('video');
        bigVideo.src = videoEl.currentSrc || videoEl.getAttribute('src');
        bigVideo.controls = true;
        bigVideo.autoplay = true;
        bigVideo.muted = true;
        bigVideo.playsInline = true;
        bigVideo.setAttribute('playsinline', '');
        overlayBody.appendChild(bigVideo);
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closePreview = () => {
        if (!overlay || !overlayBody) return;
        const v = overlayBody.querySelector('video');
        if (v) {
            try { v.pause(); } catch(e){}
        }
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        setTimeout(() => { overlayBody.innerHTML = ''; }, 150);
        document.body.style.overflow = '';
    };

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            const dialog = overlay.querySelector('.preview-dialog');
            if (!dialog || !dialog.contains(e.target)) closePreview();
        });
    }
    if (overlayClose) {
        overlayClose.addEventListener('click', closePreview);
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePreview();
    });

    document.querySelectorAll('.project-card video.card-img-top').forEach(v => {
        let hoverTimer;
        v.style.cursor = 'zoom-in';
        v.addEventListener('mouseenter', () => {
            hoverTimer = setTimeout(() => openPreview(v), 220);
        });
        v.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimer);
        });
        v.addEventListener('click', (e) => {
            e.preventDefault();
            openPreview(v);
        });
    });

  
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.classList.add('loading-image');
        img.addEventListener('load', function() {
            this.classList.remove('loading-image');
        });
    });

   
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    navbarToggler.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navbarCollapse.classList.toggle('show');
    });

   
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navbarCollapse.classList.remove('show');
            navbarToggler.setAttribute('aria-expanded', 'false');
        });
    });

  
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

  
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.style.transform = `
                perspective(1000px)
                rotateX(${(y - rect.height/2) / 20}deg)
                rotateY(${-(x - rect.width/2) / 20}deg)
                translateZ(10px)
            `;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'none';
        });
    });

  
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(10deg)';
        });

        whatsappBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

  
    document.querySelectorAll('.badge').forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) rotate(5deg)';
        });

        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'none';
        });
    });

    
    window.addEventListener('load', function() {
        document.querySelector('.loading').style.display = 'none';
    });
});
