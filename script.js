(() => {
    'use strict';

    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const header = $('#header');
    const toTop = $('#toTop');
    const nav = $('#nav');
    const menuToggle = $('#menuToggle');
    const navLinks = $$('.nav-link');
    const navSections = navLinks
        .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
        .filter(Boolean);

    toTop.textContent = '↑';
    $('#lightboxPrev').textContent = '←';
    $('#lightboxNext').textContent = '→';

    let scrollTicking = false;

    function updateScrollUI() {
        const y = window.scrollY;
        header.classList.toggle('scrolled', y > 16);
        toTop.classList.toggle('show', y > 700);

        let currentId = '';
        navSections.forEach((section) => {
            if (y >= section.offsetTop - 180) currentId = section.id;
        });

        navLinks.forEach((link) => {
            const isCurrent = link.getAttribute('href') === `#${currentId}`;
            link.classList.toggle('active', isCurrent);
            if (isCurrent) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });

        scrollTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            scrollTicking = true;
            requestAnimationFrame(updateScrollUI);
        }
    }, { passive: true });

    updateScrollUI();

    toTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    function setMenu(open) {
        nav.classList.toggle('open', open);
        document.body.classList.toggle('menu-open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');

        if (open) {
            window.setTimeout(() => navLinks[0]?.focus(), reduceMotion ? 0 : 180);
        }
    }

    menuToggle.addEventListener('click', () => {
        setMenu(!nav.classList.contains('open'));
    });

    $$('a', nav).forEach((link) => link.addEventListener('click', () => setMenu(false)));
    $('.header .logo').addEventListener('click', () => setMenu(false));

    window.addEventListener('resize', () => {
        if (window.innerWidth > 960 && nav.classList.contains('open')) setMenu(false);
    });

    const filterButtons = $$('.filter');
    const bouquetCards = $$('.bouquet-card');
    const catalogCount = $('#catalogCount');

    function formatBouquetCount(count) {
        const mod10 = count % 10;
        const mod100 = count % 100;
        if (mod10 === 1 && mod100 !== 11) return `${count} букет`;
        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} букета`;
        return `${count} букетов`;
    }

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            let visibleCount = 0;

            filterButtons.forEach((item) => {
                const isActive = item === button;
                item.classList.toggle('is-active', isActive);
                item.setAttribute('aria-pressed', String(isActive));
            });

            bouquetCards.forEach((card) => {
                const show = filter === 'all' || card.dataset.category === filter;
                card.hidden = !show;
                if (show) {
                    visibleCount += 1;
                    card.classList.add('visible');
                }
            });

            catalogCount.textContent = formatBouquetCount(visibleCount);
        });
    });

    const bouquetGrid = $('#bouquetGrid');
    const selectedBouquet = $('#selectedBouquet');
    const message = $('#message');
    const nameInput = $('#name');
    const toast = $('#toast');
    const toastText = $('#toastText');
    let toastTimer = null;

    function showToast(text) {
        toastText.textContent = text;
        toast.classList.add('show');
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3600);
    }

    bouquetGrid.addEventListener('click', (event) => {
        const button = event.target.closest('.card-order');
        if (!button) return;

        const bouquetName = button.dataset.bouquet;
        selectedBouquet.value = bouquetName;

        if (!message.value.trim()) {
            message.value = `Хочу заказать букет «${bouquetName}».`;
        }

        showToast(`Букет «${bouquetName}» выбран. Оставьте контакты — уточним детали.`);
        $('#contact').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });

        window.setTimeout(() => {
            nameInput.focus({ preventScroll: true });
        }, reduceMotion ? 0 : 650);
    });

    const galleryItems = $$('.gallery-item');
    const lightbox = $('#lightbox');
    const lightboxImage = $('#lightboxImage');
    const lightboxCaption = $('#lightboxCaption');
    const lightboxClose = $('#lightboxClose');
    const lightboxPrev = $('#lightboxPrev');
    const lightboxNext = $('#lightboxNext');
    let currentPhoto = 0;
    let lastFocused = null;

    function renderLightbox(index) {
        const item = galleryItems[index];
        const image = $('img', item);
        currentPhoto = index;
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        lightboxCaption.textContent = `${item.dataset.caption} — ${item.dataset.category}`;
    }

    function openLightbox(index) {
        lastFocused = document.activeElement;
        renderLightbox(index);
        lightbox.hidden = false;
        document.body.classList.add('lightbox-open');
        lightboxClose.focus();
    }

    function closeLightbox() {
        lightbox.hidden = true;
        document.body.classList.remove('lightbox-open');
        lightboxImage.removeAttribute('src');
        if (lastFocused instanceof HTMLElement) lastFocused.focus();
    }

    function stepLightbox(direction) {
        const next = (currentPhoto + direction + galleryItems.length) % galleryItems.length;
        renderLightbox(next);
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => stepLightbox(-1));
    lightboxNext.addEventListener('click', () => stepLightbox(1));

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (event) => {
        if (!lightbox.hidden) {
            if (event.key === 'Escape') closeLightbox();
            if (event.key === 'ArrowLeft') stepLightbox(-1);
            if (event.key === 'ArrowRight') stepLightbox(1);

            if (event.key === 'Tab') {
                const focusables = [lightboxClose, lightboxPrev, lightboxNext];
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
            return;
        }

        if (nav.classList.contains('open')) {
            if (event.key === 'Escape') {
                setMenu(false);
                menuToggle.focus();
                return;
            }

            if (event.key === 'Tab') {
                const focusables = [...$$('a', nav), menuToggle].filter((element) => element.offsetParent !== null);
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
        }
    });

    $$('.faq-item').forEach((item) => {
        item.addEventListener('toggle', () => {
            if (!item.open) return;
            $$('.faq-item').forEach((other) => {
                if (other !== item) other.open = false;
            });
        });
    });

    const revealTargets = $$('.reveal');
    $$('.bouquet-card').forEach((card, index) => {
        card.style.setProperty('--reveal-delay', `${(index % 3) * 0.06}s`);
    });
    $$('.gallery-item').forEach((item, index) => {
        item.style.setProperty('--reveal-delay', `${(index % 3) * 0.05}s`);
    });
    $$('.delivery-step').forEach((item, index) => {
        item.style.setProperty('--reveal-delay', `${index * 0.07}s`);
    });

    if ('IntersectionObserver' in window && !reduceMotion) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });

        revealTargets.forEach((target) => revealObserver.observe(target));
    } else {
        revealTargets.forEach((target) => target.classList.add('visible'));
    }

    const phoneInput = $('#phone');
    const orderForm = $('#orderForm');
    const formStatus = $('#formStatus');
    const dateInput = $('#date');
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    dateInput.min = localToday;

    phoneInput.addEventListener('input', () => {
        let digits = phoneInput.value.replace(/\D/g, '');

        if (!digits) {
            phoneInput.value = '';
            return;
        }

        if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
        if (!digits.startsWith('7')) digits = `7${digits}`;
        digits = digits.slice(0, 11);

        let formatted = '+7';
        if (digits.length > 1) formatted += ` (${digits.slice(1, 4)}`;
        if (digits.length >= 5) formatted += `) ${digits.slice(4, 7)}`;
        if (digits.length >= 8) formatted += `-${digits.slice(7, 9)}`;
        if (digits.length >= 10) formatted += `-${digits.slice(9, 11)}`;

        phoneInput.value = formatted;
        phoneInput.classList.remove('invalid');
        phoneInput.removeAttribute('aria-invalid');
    });

    nameInput.addEventListener('input', () => {
        nameInput.classList.remove('invalid');
        nameInput.removeAttribute('aria-invalid');
    });

    orderForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const nameValue = nameInput.value.trim();
        const digits = phoneInput.value.replace(/\D/g, '');
        let firstInvalid = null;

        nameInput.classList.toggle('invalid', !nameValue);
        phoneInput.classList.toggle('invalid', digits.length !== 11 || !digits.startsWith('7'));
        nameInput.setAttribute('aria-invalid', String(!nameValue));
        phoneInput.setAttribute('aria-invalid', String(digits.length !== 11 || !digits.startsWith('7')));

        if (!nameValue) firstInvalid = nameInput;
        if (digits.length !== 11 || !digits.startsWith('7')) firstInvalid = firstInvalid || phoneInput;

        if (firstInvalid) {
            formStatus.textContent = 'Пожалуйста, укажите имя и корректный номер телефона.';
            firstInvalid.focus();
            return;
        }

        formStatus.textContent = '';
        const submitButton = $('button[type="submit"]', orderForm);
        const originalContent = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.textContent = 'Отправляем…';

        window.setTimeout(() => {
            submitButton.textContent = 'Заявка отправлена';
            formStatus.textContent = 'Спасибо! Свяжемся с вами в течение 15 минут в рабочее время.';
            showToast('Заявка принята. Мы скоро свяжемся с вами.');
            orderForm.reset();
            selectedBouquet.value = '';
            dateInput.min = localToday;

            window.setTimeout(() => {
                submitButton.innerHTML = originalContent;
                submitButton.disabled = false;
            }, 2400);
        }, 750);
    });
})();
