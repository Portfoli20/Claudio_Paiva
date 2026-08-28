/* Scroll choreography: progressive enhancement powered by GSAP + ScrollTrigger. */
(() => {
    const ready = () => {
        const hero = document.querySelector('.hero');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (hero && !hero.querySelector('.spatial-orbit')) {
            const orbit = document.createElement('div');
            orbit.className = 'spatial-orbit';
            orbit.setAttribute('aria-hidden', 'true');
            orbit.innerHTML = '<span class="node"></span><span class="node"></span>';
            hero.prepend(orbit);
        }

        const sections = [hero, document.querySelector('#videos-destaque'), document.querySelector('#projetos'), document.querySelector('#sobre-mim'), document.querySelector('#contatos')].filter(Boolean);
        const labels = ['01 / ORIGEM', '02 / EM AÇÃO', '03 / PROJETOS', '04 / TRAJETÓRIA', '05 / CONTATO'];
        sections.forEach((section, index) => {
            section.dataset.label = labels[index];
            if (index) section.classList.add('scroll-depth');
        });

        const stage = document.createElement('nav');
        stage.className = 'scroll-stage';
        stage.setAttribute('aria-label', 'Progresso da página');
        stage.innerHTML = sections.map((_, index) => `<span data-index="${index}"></span>`).join('');
        document.body.appendChild(stage);
        const stageItems = [...stage.querySelectorAll('span')];
        const setActiveStage = index => stageItems.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === index));

        const activateFallback = () => {
            const observer = new IntersectionObserver(entries => entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in-view');
                    setActiveStage(sections.indexOf(entry.target));
                }
            }), { threshold: .28 });
            sections.forEach(section => observer.observe(section));
        };

        if (!window.gsap || !window.ScrollTrigger || reducedMotion) {
            activateFallback();
            return;
        }

        gsap.registerPlugin(ScrollTrigger);
        document.documentElement.classList.add('gsap-ready');
        gsap.set(sections.slice(1), { autoAlpha: 1 });

        const portrait = hero?.querySelector('.hero-image');
        const headline = hero?.querySelector('h1');
        const orbit = hero?.querySelector('.spatial-orbit');
        if (hero) {
            gsap.timeline({
                scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.1 }
            })
                .to(headline, { yPercent: -30, opacity: .1, ease: 'none' }, 0)
                .to(portrait, { yPercent: -18, rotateY: 16, rotateZ: -3, scale: .88, opacity: .35, ease: 'none' }, 0)
                .to(orbit, { rotateZ: 50, scale: 1.2, opacity: .25, ease: 'none' }, 0);
        }

        sections.slice(1).forEach((section, index) => {
            const cards = section.querySelectorAll('.project-card, .video-wall-main, .video-thumb, .timeline-item, .contact-item, .skill-item');
            gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top 76%',
                    end: 'top 35%',
                    scrub: .7,
                    onEnter: () => setActiveStage(index + 1),
                    onEnterBack: () => setActiveStage(index + 1)
                }
            })
                .fromTo(section, { y: 65, rotateX: 8 }, { y: 0, rotateX: 0, duration: 1, ease: 'power2.out' }, 0)
                .fromTo(cards, { y: 55, z: -90, rotateX: 10, autoAlpha: 0 }, { y: 0, z: 0, rotateX: 0, autoAlpha: 1, stagger: .07, duration: .8, ease: 'power2.out' }, .12);
        });

        ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom top', onEnter: () => setActiveStage(0), onEnterBack: () => setActiveStage(0) });
        ScrollTrigger.refresh();
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
    else ready();
})();
