document.addEventListener('DOMContentLoaded', () => {
    // Active nav link (and its parent item when inside a submenu)
    const here = location.pathname.replace(/\/index\.html$/, '/');
    document.querySelectorAll('.nav-menu a').forEach(a => {
        if (a.pathname.replace(/\/index\.html$/, '/') !== here) return;
        a.classList.add('active');
        const parent = a.closest('.has-sub');
        if (parent) parent.querySelector(':scope > .nav-link').classList.add('active');
    });

    const toggle = document.querySelector('.nav-toggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const open = document.querySelector('.nav-menu').classList.toggle('active');
            toggle.setAttribute('aria-expanded', open);
        });
    }

    // Home slider
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length) {
        const order = [...slides];
        for (let i = order.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [order[i], order[j]] = [order[j], order[i]];
        }

        const storageKey = 'home-slider-last-image';
        try {
            const previousImage = sessionStorage.getItem(storageKey);
            if (order.length > 1 && order[0].style.backgroundImage === previousImage) {
                const j = 1 + Math.floor(Math.random() * (order.length - 1));
                [order[0], order[j]] = [order[j], order[0]];
            }
            sessionStorage.setItem(storageKey, order[0].style.backgroundImage);
        } catch {
            // Continue with the shuffled order if browser storage is unavailable.
        }

        let i = 0;
        order[i].classList.add('is-active');
        setInterval(() => {
            order[i].classList.remove('is-active');
            i = (i + 1) % order.length;
            order[i].classList.add('is-active');
        }, 5000);
    }

    // Reveal on scroll
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // Lightbox
    const imgs = [...document.querySelectorAll('.masonry img')];
    if (imgs.length) {
        const lb = document.createElement('div');
        lb.className = 'lightbox';
        lb.innerHTML = '<button class="lb-close" aria-label="Close">&times;</button>' +
            '<button class="lb-prev" aria-label="Previous">&#8249;</button><img alt="">' +
            '<button class="lb-next" aria-label="Next">&#8250;</button>';
        document.body.appendChild(lb);
        const big = lb.querySelector('img');
        let cur = 0;
        const show = n => {
            cur = (n + imgs.length) % imgs.length;
            big.src = imgs[cur].src;
            big.alt = imgs[cur].alt;
            lb.classList.add('open');
        };
        const close = () => lb.classList.remove('open');
        imgs.forEach((im, n) => im.addEventListener('click', () => show(n)));
        lb.querySelector('.lb-close').addEventListener('click', close);
        lb.querySelector('.lb-prev').addEventListener('click', () => show(cur - 1));
        lb.querySelector('.lb-next').addEventListener('click', () => show(cur + 1));
        lb.addEventListener('click', e => { if (e.target === lb) close(); });
        document.addEventListener('keydown', e => {
            if (!lb.classList.contains('open')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') show(cur - 1);
            if (e.key === 'ArrowRight') show(cur + 1);
        });
    }
});
