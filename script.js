/* ============================================================
   БУТОН — живой лендинг
   ============================================================ */

(() => {
    'use strict';

    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- CSS-цветок ---------- */
    function makeFlower(options = {}) {
        const {
            size = 90,
            petals = 9,
            layers = 1,
            gradient = 'linear-gradient(160deg, #ffd6e2, #cf5f7c)',
            core = '#c2a26a',
            duration = 6,
            delay = 0
        } = options;

        const flower = document.createElement('div');
        flower.className = 'flower';
        flower.style.setProperty('--size', size + 'px');
        flower.style.setProperty('--petal-bg', gradient);
        flower.style.setProperty('--core', core);
        flower.style.setProperty('--dur', duration + 's');
        flower.style.setProperty('--delay', delay + 's');

        for (let layer = 0; layer < layers; layer++) {
            const count = petals + layer * 2;
            const offset = layer * (360 / count / 2);

            for (let i = 0; i < count; i++) {
                const petal = document.createElement('span');
                petal.className = 'petal' + (layer > 0 ? ' center-ring' : '');
                petal.style.setProperty('--a', (i * (360 / count) + offset) + 'deg');
                flower.appendChild(petal);
            }
        }

        const coreEl = document.createElement('span');
        coreEl.className = 'core';
        flower.appendChild(coreEl);

        return flower;
    }

    /* ---------- Живой фон ---------- */
    (function atmosphere() {
        const layer = $('#atmosphere');
        const colors = ['#f3d8df', '#ecc7d2', '#efe8df', '#f0d9c9', '#dfe7dc'];

        for (let i = 0; i < 26; i++) {
            const petal = document.createElement('div');
            petal.className = 'falling-petal';

            const size = 9 + Math.random() * 12;
            petal.style.left = Math.random() * 100 + 'vw';
            petal.style.top = Math.random() * 100 + 'vh';
            petal.style.width = size + 'px';
            petal.style.height = size * 1.35 + 'px';
            petal.style.background = colors[Math.floor(Math.random() * colors.length)];
            petal.style.animationDuration = 16 + Math.random() * 20 + 's';
            petal.style.animationDelay = -Math.random() * 30 + 's';

            layer.appendChild(petal);
        }

        for (let i = 0; i < 3; i++) {
            const butterfly = document.createElement('div');
            butterfly.className = 'butterfly';
            butterfly.style.left = 12 + i * 26 + 'vw';
            butterfly.style.top = 14 + (i % 2) * 30 + 'vh';
            butterfly.style.animationDelay = -i * 4 + 's';
            butterfly.style.animationDuration = 16 + i * 3 + 's';
            butterfly.innerHTML = '<span class="wing left"></span><span class="wing right"></span><span class="body"></span>';
            layer.appendChild(butterfly);
        }
    })();

    /* ---------- Цветы в герое ---------- */
    const heroFlowers = $('#heroFlowers');
    const heroFlowerConfig = [
        { size: 78, petals: 9, gradient: 'linear-gradient(160deg, #ffe0cf, #ff9e7a 70%, #f4785b)', core: '#ffe08a', left: '0%', top: '7%', duration: 6.5, delay: 0 },
        { size: 62, petals: 8, gradient: 'linear-gradient(160deg, #ffffff, #f3e5f5 60%, #ce93d8)', core: '#ffd45e', right: '2%', top: '22%', duration: 7.5, delay: -2 },
        { size: 70, petals: 9, gradient: 'linear-gradient(160deg, #d7f0cf, #8fce8a 70%, #6ba368)', core: '#f9a825', left: '4%', bottom: '16%', duration: 6, delay: -3 },
        { size: 88, petals: 9, layers: 2, gradient: 'linear-gradient(160deg, #ffd6e2, #cf5f7c 65%, #a83e5b)', core: '#c2a26a', right: '3%', bottom: '9%', duration: 8, delay: -1 }
    ];

    heroFlowerConfig.forEach((cfg) => {
        const flower = makeFlower(cfg);
        ['left', 'right', 'top', 'bottom'].forEach((side) => {
            if (cfg[side] != null) flower.style[side] = cfg[side];
        });
        heroFlowers.appendChild(flower);
    });

    /* ---------- Цветок в блоке «О нас» ---------- */
    $('#aboutFlower').appendChild(makeFlower({
        size: 96,
        petals: 9,
        layers: 2,
        gradient: 'linear-gradient(160deg, #ffd6e2, #cf5f7c 65%, #a83e5b)',
        core: '#c2a26a',
        duration: 7
    }));

    /* ---------- Каталог ---------- */
    const catalogData = [
        {
            name: 'Нежность',
            desc: 'Пионы и розы пастельных тонов — идеально для признания в любви.',
            price: '3 900',
            image: 'images/bouquet-1.jpg',
            category: 'delicate',
            badge: 'Хит'
        },
        {
            name: 'Солнечный',
            desc: 'Герберы и хризантемы в тёплой гамме для хорошего настроения.',
            price: '3 200',
            image: 'images/bouquet-2.jpg',
            category: 'bright'
        },
        {
            name: 'Страсть',
            desc: 'Красные розы и пионовидные тюльпаны в элегантной упаковке.',
            price: '4 500',
            image: 'images/bouquet-3.jpg',
            category: 'bright',
            badge: 'Хит'
        },
        {
            name: 'Душевный',
            desc: 'Нежные тюльпаны и веточки эвкалипта — тёплый подарок близкому.',
            price: '2 900',
            image: 'images/bouquet-4.jpg',
            category: 'delicate'
        },
        {
            name: 'Воздушный',
            desc: 'Эустома, лизиантус и гипсофила в лёгком авторском букете.',
            price: '3 600',
            image: 'images/bouquet-5.jpg',
            category: 'author',
            badge: 'Новинка'
        },
        {
            name: 'Праздничный',
            desc: 'Орхидеи и лилии — для особенного вечера и важного случая.',
            price: '5 200',
            image: 'images/bouquet-6.jpg',
            category: 'author'
        }
    ];

    const cardsGrid = $('#cardsGrid');

    function renderCatalog() {
        catalogData.forEach((item, index) => {
            const card = document.createElement('article');
            card.className = 'card reveal';
            card.dataset.category = item.category;
            card.dataset.name = item.name;
            card.style.setProperty('--reveal-delay', `${index * 0.07}s`);

            const badge = item.badge
                ? `<span class="card-badge ${item.badge === 'Новинка' ? 'new' : ''}">${item.badge}</span>`
                : '';

            card.innerHTML = `
                <div class="card-media">
                    <img src="${item.image}" alt="Букет «${item.name}»" width="800" height="600" loading="lazy" decoding="async">
                    ${badge}
                </div>
                <div class="card-body">
                    <h3>${item.name}</h3>
                    <p class="card-desc">${item.desc}</p>
                    <div class="card-foot">
                        <span class="card-price"><small>от</small>${item.price} ₽</span>
                        <button class="card-order" type="button">Заказать <i>→</i></button>
                    </div>
                </div>
            `;

            cardsGrid.appendChild(card);
        });
    }
    renderCatalog();

    /* ---------- Фильтры каталога ---------- */
    const filters = $$('.filter');
    const catalogCards = $$('.card', cardsGrid);

    filters.forEach((button) => {
        button.addEventListener('click', () => {
            filters.forEach((b) => {
                const isCurrent = b === button;
                b.classList.toggle('is-active', isCurrent);
                b.setAttribute('aria-pressed', String(isCurrent));
            });
            const filter = button.dataset.filter;

            catalogCards.forEach((card) => {
                const show = filter === 'all' || card.dataset.category === filter;
                card.classList.remove('card-enter');

                if (show) {
                    card.classList.remove('is-hidden');
                    void card.offsetWidth;
                    card.classList.add('card-enter');
                } else {
                    card.classList.add('is-hidden');
                }
            });
        });
    });

    /* ---------- Галерея ---------- */
    const galleryData = [
        { src: 'images/gallery-1.jpg', caption: 'Розовый сад', cat: 'Авторский букет' },
        { src: 'images/gallery-2.jpg', caption: 'Утренняя нежность', cat: 'Пионы и эустома' },
        { src: 'images/gallery-3.jpg', caption: 'Солнечный день', cat: 'Герберы и хризантемы' },
        { src: 'images/gallery-4.jpg', caption: 'Белый танец', cat: 'Свадебная классика' },
        { src: 'images/gallery-5.jpg', caption: 'Полевой характер', cat: 'Сухоцветы и злаки' },
        { src: 'images/gallery-6.jpg', caption: 'Букет для мамы', cat: 'Тюльпаны и ландыши' }
    ];

    const galleryGrid = $('#galleryGrid');

    galleryData.forEach((item, index) => {
        const figure = document.createElement('figure');
        figure.className = 'gallery-item reveal';
        figure.tabIndex = 0;
        figure.setAttribute('role', 'button');
        figure.setAttribute('aria-label', `Открыть фото: ${item.caption}`);
        figure.style.setProperty('--reveal-delay', `${index * 0.05}s`);

        figure.innerHTML = `
            <img src="${item.src}" alt="${item.caption} — ${item.cat}" width="800" height="800" loading="lazy" decoding="async">
            <figcaption class="gallery-overlay">
                <span class="gallery-caption-group">
                    <span class="gallery-cat">${item.cat}</span>
                    <span class="gallery-caption">${item.caption}</span>
                </span>
            </figcaption>
            <span class="gallery-plus" aria-hidden="true">+</span>
        `;

        figure.addEventListener('click', () => openLightbox(index));
        figure.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightbox(index);
            }
        });

        galleryGrid.appendChild(figure);
    });

    /* ---------- Лайтбокс ---------- */
    const lightbox = $('#lightbox');
    const lightboxImage = $('#lightboxImage');
    const lightboxCaption = $('#lightboxCaption');
    const lightboxCounter = $('#lightboxCounter');
    const lightboxClose = $('#lightboxClose');
    let currentPhoto = 0;
    let lastFocused = null;

    function renderLightbox(index) {
        const item = galleryData[index];
        currentPhoto = index;
        lightboxImage.src = item.src;
        lightboxImage.alt = `${item.caption} — ${item.cat}`;
        lightboxCaption.textContent = `${item.caption} — ${item.cat}`;
        lightboxCounter.textContent =
            `${String(index + 1).padStart(2, '0')} / ${String(galleryData.length).padStart(2, '0')}`;
    }

    function openLightbox(index) {
        lastFocused = document.activeElement;
        renderLightbox(index);
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        lightboxClose.focus();
    }

    function closeLightbox() {
        lightbox.hidden = true;
        document.body.style.overflow = '';
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    function stepLightbox(direction) {
        const next = (currentPhoto + direction + galleryData.length) % galleryData.length;
        renderLightbox(next);
    }

    lightboxClose.addEventListener('click', closeLightbox);
    $('#lightboxPrev').addEventListener('click', () => stepLightbox(-1));
    $('#lightboxNext').addEventListener('click', () => stepLightbox(1));

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (event) => {
        if (lightbox.hidden) return;

        if (event.key === 'Escape') {
            closeLightbox();
            return;
        }

        if (event.key === 'ArrowLeft') stepLightbox(-1);
        if (event.key === 'ArrowRight') stepLightbox(1);

        if (event.key === 'Tab') {
            const focusables = [lightboxClose, $('#lightboxPrev'), $('#lightboxNext')].filter(Boolean);
            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    /* ---------- Бегущая строка ---------- */
    const marqueeTrack = $('#marqueeTrack');
    const marqueeGroup = document.createElement('div');
    marqueeGroup.className = 'marquee-group';

    while (marqueeTrack.firstChild) marqueeGroup.appendChild(marqueeTrack.firstChild);

    const marqueeClone = marqueeGroup.cloneNode(true);
    marqueeClone.setAttribute('aria-hidden', 'true');

    marqueeTrack.appendChild(marqueeGroup);
    marqueeTrack.appendChild(marqueeClone);

    /* ---------- Скролл: прогресс, шапка, кнопка наверх ---------- */
    const header = $('#header');
    const progress = $('#scrollProgress');
    const toTop = $('#toTop');
    const nav = $('#nav');
    const burger = $('#burger');
    const navLinks = $$('.nav-link');

    const navSections = navLinks
        .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
        .filter(Boolean);

    let ticking = false;

    function updateScrollUI() {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;

        progress.style.width = (max > 0 ? Math.min(100, (y / max) * 100) : 0) + '%';
        header.classList.toggle('scrolled', y > 20);
        toTop.classList.toggle('show', y > 520);

        let currentId = '';
        navSections.forEach((section) => {
            if (y >= section.offsetTop - 150) currentId = section.id;
        });

        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateScrollUI);
        }
    }, { passive: true });

    updateScrollUI();

    toTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    /* ---------- Мобильное меню ---------- */
    function closeMenu() {
        nav.classList.remove('open');
        document.body.classList.remove('menu-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Открыть меню');
    }

    burger.addEventListener('click', () => {
        const isOpen = !nav.classList.contains('open');
        nav.classList.toggle('open', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
        burger.setAttribute('aria-expanded', String(isOpen));
        burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    });

    navLinks.forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && nav.classList.contains('open')) closeMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) closeMenu();
    });

    /* ---------- FAQ: аккордеон ---------- */
    $$('.faq-item').forEach((item) => {
        item.addEventListener('toggle', () => {
            if (!item.open) return;
            $$('.faq-item').forEach((other) => {
                if (other !== item) other.open = false;
            });
        });
    });

    /* ---------- Появление при скролле ---------- */
    const revealTargets = $$(
        '.section-head, .about-visual, .about-content, .contact-info, .contact-form, .cta, .reviews-score, .faq-intro'
    );
    revealTargets.forEach((el) => el.classList.add('reveal'));

    $$('.step').forEach((el, index) => {
        el.classList.add('reveal');
        el.style.setProperty('--reveal-delay', `${index * 0.09}s`);
    });

    $$('.faq-item').forEach((el, index) => {
        el.classList.add('reveal');
        el.style.setProperty('--reveal-delay', `${index * 0.05}s`);
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    $$('.reveal').forEach((el) => revealObserver.observe(el));

    /* ---------- Параллакс героя ---------- */
    const heroVisual = $('#heroVisual');
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    if (heroVisual && finePointer && !reduceMotion) {
        const layers = $$('[data-parallax]', heroVisual);

        heroVisual.addEventListener('mousemove', (event) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
            const y = (event.clientY - rect.top - rect.height / 2) / rect.height;

            layers.forEach((layer) => {
                const strength = Number(layer.dataset.parallax) * 5;
                layer.style.translate = `${(-x * strength).toFixed(2)}px ${(-y * strength).toFixed(2)}px`;
            });
        });

        heroVisual.addEventListener('mouseleave', () => {
            layers.forEach((layer) => { layer.style.translate = '0px 0px'; });
        });
    }

    /* ---------- Уведомление ---------- */
    const toast = $('#toast');
    const toastText = $('#toastText');
    let toastTimer = null;

    function showToast(message) {
        toastText.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 3400);
    }

    /* ---------- Заказ букета ---------- */
    function orderBouquet(name) {
        const message = $('#message');
        message.value = `Хочу заказать букет «${name}»`;

        showToast(`Букет «${name}» выбран. Оставьте контакты — перезвоним!`);

        $('#contact').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });

        setTimeout(() => {
            $('#name').focus({ preventScroll: true });
        }, reduceMotion ? 0 : 700);
    }

    cardsGrid.addEventListener('click', (event) => {
        const button = event.target.closest('.card-order');
        if (!button) return;

        const card = button.closest('.card');
        if (card) orderBouquet(card.dataset.name);
    });

    /* ---------- Маска телефона ---------- */
    const phoneInput = $('#phone');

    phoneInput.addEventListener('input', () => {
        let digits = phoneInput.value.replace(/\D/g, '');

        if (!digits) {
            phoneInput.value = '';
            return;
        }

        if (digits.startsWith('8')) digits = '7' + digits.slice(1);
        if (!digits.startsWith('7')) digits = '7' + digits;
        digits = digits.slice(0, 11);

        let formatted = '+7';

        if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
        if (digits.length >= 5) formatted += ') ' + digits.slice(4, 7);
        if (digits.length >= 8) formatted += '-' + digits.slice(7, 9);
        if (digits.length >= 10) formatted += '-' + digits.slice(9, 11);

        phoneInput.value = formatted;
    });

    /* ---------- Форма ---------- */
    const orderForm = $('#orderForm');

    orderForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const nameInput = $('#name');
        const nameValue = nameInput.value.trim();
        const digits = phoneInput.value.replace(/\D/g, '');

        nameInput.classList.remove('invalid');
        phoneInput.classList.remove('invalid');

        let firstInvalid = null;

        if (!nameValue) {
            nameInput.classList.add('invalid');
            firstInvalid = nameInput;
        }

        if (digits.length < 11) {
            phoneInput.classList.add('invalid');
            firstInvalid = firstInvalid || phoneInput;
        }

        if (firstInvalid) {
            firstInvalid.focus();
            showToast('Пожалуйста, проверьте имя и номер телефона');
            return;
        }

        const submitButton = orderForm.querySelector('button[type="submit"]');
        const originalMarkup = submitButton.innerHTML;

        submitButton.innerHTML = 'Отправляем…';
        submitButton.disabled = true;

        setTimeout(() => {
            submitButton.innerHTML = 'Заявка отправлена ✓';
            submitButton.style.background = 'var(--sage)';
            orderForm.reset();

            showToast('Спасибо! Перезвоним в течение 15 минут');

            setTimeout(() => {
                submitButton.innerHTML = originalMarkup;
                submitButton.disabled = false;
                submitButton.style.background = '';
            }, 2600);
        }, 900);
    });

    $$('input', orderForm).forEach((input) => {
        input.addEventListener('input', () => input.classList.remove('invalid'));
    });
})();
