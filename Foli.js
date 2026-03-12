
// Ativar tela cheia no primeiro clique/toque
let fullscreenActivated = false;
function activateFullscreen() {
    if (fullscreenActivated) return;
    fullscreenActivated = true;
    
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
    } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
    } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
    }
    
    document.removeEventListener('click', activateFullscreen);
    document.removeEventListener('touchstart', activateFullscreen);
}
document.addEventListener('click', activateFullscreen, { once: true });
document.addEventListener('touchstart', activateFullscreen, { once: true });

window.addEventListener('load', () => {
    const loader = document.querySelector('.loading');
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
    }, 500);
});


window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.custom-navbar');
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    
    if (window.scrollY > 50) {
        navbar.style.background = isLight ? 'rgba(240, 244, 248, 0.98)' : 'rgba(10, 10, 10, 0.98)';
        navbar.style.padding = '0.5rem 0';
    } else {
        navbar.style.background = isLight ? 'rgba(232, 238, 245, 0.95)' : 'rgba(10, 10, 10, 0.95)';
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

(function() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        html.setAttribute('data-theme', 'light');
    }
    
    function createFallingStars() {
        if (!themeToggle) return;
        
        const existingStars = themeToggle.querySelectorAll('.star-particle');
        existingStars.forEach(star => star.remove());
        
        if (html.getAttribute('data-theme') === 'light') return;
        
        for (let i = 0; i < 6; i++) {
            const star = document.createElement('span');
            star.className = 'star-particle';
            star.style.left = (10 + Math.random() * 40) + 'px';
            star.style.animationDelay = (Math.random() * 2) + 's';
            star.style.animationDuration = (1.5 + Math.random() * 1) + 's';
            themeToggle.appendChild(star);
        }
    }
    
    createFallingStars();
    
    const waveContainer = document.createElement('div');
    waveContainer.className = 'theme-transition-wave';
    document.body.appendChild(waveContainer);
    
    function createParticles(x, y, type) {
        const particleCount = 12;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = `theme-particle ${type}`;
            
            const angle = (i / particleCount) * 360;
            const distance = 50 + Math.random() * 100;
            const tx = Math.cos(angle * Math.PI / 180) * distance;
            const ty = Math.sin(angle * Math.PI / 180) * distance;
            
            particle.style.cssText = `
                left: ${x}px;
                top: ${y}px;
                --tx: ${tx}px;
                --ty: ${ty}px;
            `;
            
            document.body.appendChild(particle);
            
            requestAnimationFrame(() => {
                particle.classList.add('animate');
            });
            
            setTimeout(() => {
                particle.remove();
            }, 600);
        }
    }
    
    function createWaveEffect(x, y, theme) {
        const wave = document.createElement('div');
        wave.className = `theme-wave-circle ${theme}`;
        
        const size = Math.max(window.innerWidth, window.innerHeight) * 2;
        wave.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x - size / 2}px;
            top: ${y - size / 2}px;
        `;
        
        waveContainer.appendChild(wave);
        
        requestAnimationFrame(() => {
            wave.classList.add('animate');
        });
        
        setTimeout(() => {
            wave.remove();
        }, 1200);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            const rect = themeToggle.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            const particleType = newTheme === 'light' ? 'sun' : 'star';
            createParticles(x, y, particleType);
            
            createWaveEffect(x, y, newTheme === 'light' ? 'light' : 'dark');
            
            html.classList.add('theme-transitioning');
            
            setTimeout(() => {
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                createFallingStars();
                
                const navbar = document.querySelector('.custom-navbar');
                if (navbar) {
                    const isLight = newTheme === 'light';
                    if (window.scrollY > 50) {
                        navbar.style.background = isLight ? 'rgba(240, 244, 248, 0.98)' : 'rgba(10, 10, 10, 0.98)';
                    } else {
                        navbar.style.background = isLight ? 'rgba(232, 238, 245, 0.95)' : 'rgba(10, 10, 10, 0.95)';
                    }
                }
            }, 100);
            
            setTimeout(() => {
                html.classList.remove('theme-transitioning');
            }, 800);
        });
    }
})();

(function() {
    const loadingScreen = document.getElementById('loading-screen');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 500);
    });
    
    const cursorGlow = document.getElementById('cursor-glow');
    
    if (cursorGlow && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
            cursorGlow.classList.add('active');
        });
        
        document.addEventListener('mouseleave', () => {
            cursorGlow.classList.remove('active');
        });
    }
    
    const customCursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('cursor-dot');
    
    if (customCursor && cursorDot && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        });
        
        const clickables = document.querySelectorAll('a, button, .project-card, .video-thumb, .stat-card');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => customCursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => customCursor.classList.remove('hover'));
        });
    }
    
    const scrollProgress = document.getElementById('scroll-progress');
    
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        });
    }
    
    const backToTop = document.getElementById('back-to-top');
    
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;
    
    function animateStats() {
        if (statsAnimated) return;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target + '+';
                }
            };
            
            updateCounter();
        });
        
        statsAnimated = true;
    }
    
    const skillBars = document.querySelectorAll('.skill-progress');
    let skillsAnimated = false;
    
    function animateSkills() {
        if (skillsAnimated) return;
        
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        });
        
        skillsAnimated = true;
    }
    
    const typewriterEl = document.getElementById('typewriter');
    
    if (typewriterEl) {
        const text = typewriterEl.textContent;
        typewriterEl.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                typewriterEl.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        setTimeout(typeWriter, 500);
    }
    
    const revealElements = document.querySelectorAll('.fade-in, .section-title, .project-card, .video-wall-main, .video-thumb, .about-image, .contact-item, .stat-card, .timeline-item');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('visible');
            }
        });
        
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            const statsTop = statsSection.getBoundingClientRect().top;
            if (statsTop < windowHeight - revealPoint) {
                animateStats();
            }
        }
        
        const skillsSection = document.querySelector('.skills-progress');
        if (skillsSection) {
            const skillsTop = skillsSection.getBoundingClientRect().top;
            if (skillsTop < windowHeight - revealPoint) {
                animateSkills();
            }
        }
    };
    
    revealOnScroll();
    
    window.addEventListener('scroll', revealOnScroll, { passive: true });
    
    const hero = document.querySelector('.hero');
    const heroGradient = document.querySelector('.hero-gradient');
    
    if (hero && heroGradient) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            
            heroGradient.style.transform = `translateY(${rate}px)`;
        }, { passive: true });
    }
    
    const magneticBtns = document.querySelectorAll('.btn-cyber, .theme-toggle');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
})();

(function() {
    const mainVideo = document.getElementById('main-video');
    const mainTitle = document.getElementById('main-video-title');
    const mainDesc = document.getElementById('main-video-desc');
    const thumbs = document.querySelectorAll('.video-thumb');
    const expandBtn = document.getElementById('expand-main-video');
    
    if (!mainVideo || thumbs.length === 0) return;
    
    let currentIndex = 0;
    let progressInterval = null;
    let rotationInterval = null;
    let progress = 0;
    
    const progressBar = document.createElement('div');
    progressBar.className = 'video-progress';
    mainVideo.parentElement.appendChild(progressBar);
    
    function updateMainVideo(index) {
        const thumb = thumbs[index];
        const videoSrc = thumb.dataset.video;
        const title = thumb.dataset.title;
        const desc = thumb.dataset.desc;
        
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        
        mainVideo.src = videoSrc;
        mainVideo.play().catch(() => {});
        
        mainTitle.textContent = title;
        mainDesc.textContent = desc;
        
        progress = 0;
        progressBar.style.width = '0%';
        
        currentIndex = index;
    }
    
    function startAutoRotation() {
        if (rotationInterval) clearInterval(rotationInterval);
        if (progressInterval) clearInterval(progressInterval);
        
        progressInterval = setInterval(() => {
            progress += 2;
            progressBar.style.width = progress + '%';
            
            if (progress >= 100) {
                progress = 0;
            }
        }, 100);
        
        rotationInterval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % thumbs.length;
            updateMainVideo(nextIndex);
        }, 5000);
    }
    
    thumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            updateMainVideo(index);
            startAutoRotation();
        });
        
        const thumbVideo = thumb.querySelector('video');
        if (thumbVideo) {
            thumb.addEventListener('mouseenter', () => {
                thumbVideo.play().catch(() => {});
            });
            thumb.addEventListener('mouseleave', () => {
                thumbVideo.pause();
                thumbVideo.currentTime = 0;
            });
        }
    });
    
    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            if (rotationInterval) clearInterval(rotationInterval);
            if (progressInterval) clearInterval(progressInterval);
            
            const currentSrc = mainVideo.src;
            const currentTitle = mainTitle.textContent;
            
            const overlay = document.getElementById('preview-overlay');
            const overlayBody = overlay ? overlay.querySelector('.preview-body') : null;
            const previewTitle = overlay ? overlay.querySelector('.preview-title') : null;
            
            if (overlay && overlayBody) {
                overlayBody.innerHTML = '';
                const bigVideo = document.createElement('video');
                bigVideo.src = currentSrc;
                bigVideo.controls = true;
                bigVideo.autoplay = true;
                bigVideo.muted = false;
                bigVideo.playsInline = true;
                bigVideo.setAttribute('playsinline', '');
                overlayBody.appendChild(bigVideo);
                
                if (previewTitle) {
                    previewTitle.textContent = currentTitle;
                }
                
                overlay.classList.add('open');
                overlay.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                
                bigVideo.play().catch(() => {});
            }
        });
    }
    
    const viewProjectBtn = document.getElementById('view-project-btn');
    if (viewProjectBtn) {
        viewProjectBtn.addEventListener('click', () => {
            if (rotationInterval) clearInterval(rotationInterval);
            if (progressInterval) clearInterval(progressInterval);
            
            const currentSrc = mainVideo.src;
            const currentTitle = mainTitle.textContent;
            
            const overlay = document.getElementById('preview-overlay');
            const overlayBody = overlay ? overlay.querySelector('.preview-body') : null;
            const previewTitle = overlay ? overlay.querySelector('.preview-title') : null;
            
            if (overlay && overlayBody) {
                overlayBody.innerHTML = '';
                const bigVideo = document.createElement('video');
                bigVideo.src = currentSrc;
                bigVideo.controls = true;
                bigVideo.autoplay = true;
                bigVideo.muted = false;
                bigVideo.playsInline = true;
                bigVideo.setAttribute('playsinline', '');
                overlayBody.appendChild(bigVideo);
                
                if (previewTitle) {
                    previewTitle.textContent = currentTitle;
                }
                
                overlay.classList.add('open');
                overlay.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                
                bigVideo.play().catch(() => {});
            }
        });
    }
    
    startAutoRotation();
})();
