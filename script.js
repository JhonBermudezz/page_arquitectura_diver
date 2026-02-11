/**
 * PORTAFOLIO ARQUITECTÓNICO - DIVER QUICENO
 * GSAP + ScrollTrigger | Loader | Hero | Modal | Microinteracciones
 */

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initHeroAnimations();
    initScrollReveal();
    initSkillBars();
    initNavigation();
    initProjectModal();
    initContactForm();
    initFooterYear();
});

/**
 * LOADER
 */
function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    window.addEventListener('load', () => {
        gsap.to(loader, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            delay: 0.3,
            onComplete: () => {
                loader.classList.add('hidden');
                animateHeroEntrance();
            },
        });
    });

    setTimeout(() => {
        if (!loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
            gsap.set(loader, { opacity: 0 });
            animateHeroEntrance();
        }
    }, 4000);
}

/**
 * HERO - Entrada cinematográfica
 */
function animateHeroEntrance() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.hero__title', {
        opacity: 1,
        y: 0,
        duration: 1.4,
    })
    .to('.hero__subtitle', {
        opacity: 1,
        y: 0,
        duration: 1,
    }, '-=0.7')
    .to('.hero__tagline', {
        opacity: 1,
        y: 0,
        duration: 0.8,
    }, '-=0.5')
    .to('.hero__scroll-indicator', {
        opacity: 1,
        duration: 1,
    }, '-=0.3');
}

/**
 * HERO - Scroll-driven con frames en canvas
 */
function initHeroAnimations() {
    const canvas = document.getElementById('heroCanvas');
    const hero = document.getElementById('hero');
    const heroContent = document.querySelector('.hero__content');
    const heroOverlay = document.querySelector('.hero__overlay');
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d');
    const FRAME_COUNT = 64;
    const FRAME_PATH = 'ezgif-7b5f8e791b864392_frames (1)/ezgif-7b5f8e791b864392_frames/ezgif-7b5f8e791b864392_';
    const frames = [];
    let loadedCount = 0;
    let currentFrame = 0;

    // Resize canvas al tamaño de la ventana
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawFrame(currentFrame);
    }

    // Dibujar un frame en el canvas (cover fit)
    function drawFrame(index) {
        const img = frames[index];
        if (!img || !img.complete) return;

        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;

        // Cover fit
        const scale = Math.max(cw / iw, ch / ih);
        const w = iw * scale;
        const h = ih * scale;
        const x = (cw - w) / 2;
        const y = (ch - h) / 2;

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, x, y, w, h);
    }

    // Precargar todos los frames
    for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        img.src = FRAME_PATH + String(i).padStart(3, '0') + '.png';
        img.onload = () => {
            loadedCount++;
            if (loadedCount === FRAME_COUNT) {
                resizeCanvas();
                ScrollTrigger.refresh();
            }
        };
        frames.push(img);
    }

    window.addEventListener('resize', resizeCanvas);

    // ScrollTrigger para cambiar frames
    ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
            const frameIndex = Math.min(
                FRAME_COUNT - 1,
                Math.floor(self.progress * FRAME_COUNT)
            );
            if (frameIndex !== currentFrame) {
                currentFrame = frameIndex;
                drawFrame(currentFrame);
            }
        },
    });

    // Parallax del contenido al scroll
    if (heroContent) {
        gsap.to(heroContent, {
            y: -120,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: '50% top',
                scrub: true,
            },
        });
    }

    if (heroOverlay) {
        gsap.to(heroOverlay, {
            opacity: 0.95,
            ease: 'none',
            scrollTrigger: {
                trigger: hero,
                start: '50% top',
                end: 'bottom bottom',
                scrub: true,
            },
        });
    }
}

/**
 * SCROLL REVEAL
 */
function initScrollReveal() {
    gsap.utils.toArray('.reveal-item').forEach((el) => {
        gsap.fromTo(
            el,
            { opacity: 0, y: 60 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
            }
        );
    });

    // Big text: reveal con clip-path
    gsap.utils.toArray('.big-text').forEach((el, i) => {
        gsap.fromTo(
            el,
            { opacity: 0, y: 80, clipPath: 'inset(0 0 100% 0)' },
            {
                opacity: 1,
                y: 0,
                clipPath: 'inset(0 0 0% 0)',
                duration: 1.2,
                delay: i * 0.15,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                },
            }
        );
    });
}

/**
 * BARRAS DE HABILIDAD
 */
function initSkillBars() {
    const skills = document.querySelectorAll('.skill-progress');
    skills.forEach((bar) => {
        ScrollTrigger.create({
            trigger: bar,
            start: 'top 90%',
            onEnter: () => {
                const progress = bar.getAttribute('data-progress');
                gsap.to(bar, {
                    width: `${progress}%`,
                    duration: 1.4,
                    ease: 'power2.out',
                    overwrite: true,
                });
                bar.classList.add('animated');
                bar.style.setProperty('--progress', `${progress}%`);
            },
        });
    });
}

/**
 * NAVEGACIÓN - Solo hamburguesa (sin scroll effects)
 */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const burger = document.querySelector('.nav__burger');
    const menu = document.querySelector('.nav__menu');
    const links = document.querySelectorAll('.nav__menu a');
    const overlay = document.querySelector('.nav__overlay');

    const open = () => {
        burger?.setAttribute('aria-expanded', 'true');
        menu?.classList.add('open');
        overlay?.classList.add('open');
        document.body.style.overflow = 'hidden';
    };
    const close = () => {
        burger?.setAttribute('aria-expanded', 'false');
        menu?.classList.remove('open');
        overlay?.classList.remove('open');
        document.body.style.overflow = '';
    };

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) nav?.classList.add('scrolled');
        else nav?.classList.remove('scrolled');
    }, { passive: true });
    if (window.scrollY > 80) nav?.classList.add('scrolled');

    burger?.addEventListener('click', () => {
        if (burger.getAttribute('aria-expanded') === 'true') close();
        else open();
    });

    links.forEach((link) => link.addEventListener('click', close));
    overlay?.addEventListener('click', close);
}

/**
 * MODAL DE PROYECTOS
 */
function initProjectModal() {
    const modalOverlay = document.getElementById('projectModal');
    if (!modalOverlay) return;

    const modalImg = document.getElementById('modalImg');
    const modalNum = document.getElementById('modalNum');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const closeBtn = modalOverlay.querySelector('.modal__close');

    const openModal = (card) => {
        const img = card.dataset.img;
        const num = card.dataset.num;
        const title = card.dataset.title;
        const desc = card.dataset.desc;

        if (modalImg) { modalImg.src = img; modalImg.alt = title; }
        if (modalNum) modalNum.textContent = num;
        if (modalTitle) modalTitle.textContent = title;
        if (modalDesc) modalDesc.textContent = desc;

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    document.querySelectorAll('.proyecto-card').forEach((card) => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(card);
        });
    });

    closeBtn?.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

/**
 * FORMULARIO DE CONTACTO
 */
function initContactForm() {
    const form = document.querySelector('.contacto__form');
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Mensaje enviado. (Conecta este formulario con tu backend o servicio de email)');
    });
}

/**
 * AÑO EN FOOTER
 */
function initFooterYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}
