(function () {
  'use strict';

  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const scheduleTabs = document.querySelectorAll('.schedule__tab');
  const schedulePanels = document.querySelectorAll('.schedule__panel');

  /* ---- Sticky header ---- */
  function handleScroll() {
    header.classList.toggle('header--scrolled', window.scrollY > 50);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ---- Mobile navigation ---- */
  function closeMenu() {
    navToggle.classList.remove('nav__toggle--open');
    navMenu.classList.remove('nav__menu--open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMenu() {
    navToggle.classList.add('nav__toggle--open');
    navMenu.classList.add('nav__menu--open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  navToggle.addEventListener('click', function () {
    navMenu.classList.contains('nav__menu--open') ? closeMenu() : openMenu();
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');

  function setActiveLink() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector('.nav__link[href="#' + id + '"]');

      if (link && scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (l) { l.classList.remove('nav__link--active'); });
        link.classList.add('nav__link--active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });

  /* ---- Schedule tabs ---- */
  scheduleTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const day = tab.dataset.day;

      scheduleTabs.forEach(function (t) {
        t.classList.remove('schedule__tab--active');
        t.setAttribute('aria-selected', 'false');
      });

      schedulePanels.forEach(function (panel) {
        panel.classList.remove('schedule__panel--active');
        panel.hidden = true;
      });

      tab.classList.add('schedule__tab--active');
      tab.setAttribute('aria-selected', 'true');

      const target = document.getElementById(day);
      if (target) {
        target.classList.add('schedule__panel--active');
        target.hidden = false;
      }
    });
  });

  /* ---- Scroll reveal ---- */
  const revealElements = document.querySelectorAll(
    '.section__header, .program-card, .coach-card, .schedule__wrapper, ' +
    '.testimonial-card, .pricing-card, .contact__center, .cta-banner__inner'
  );

  revealElements.forEach(function (el) {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---- Stagger animations ---- */
  document.querySelectorAll('.program-card, .coach-card, .testimonial-card, .pricing-card').forEach(function (card, i) {
    card.style.transitionDelay = (i % 3 * 0.12) + 's';
  });

  /* ---- Counter animation for hero stats ---- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  const statNumbers = document.querySelectorAll('.hero__stat-number[data-count]');
  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(function (el) {
    counterObserver.observe(el);
  });

const form = document.getElementById("contactForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        program: document.getElementById("program").value
    };

    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbzDQDdowbEYOR7bUxW140h_wHpL4Q9oemdHSfPWq6MS5wtqTmj-XPdbnJwdiW2CWYLw/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("✅ Спасибо! Мы скоро с вами свяжемся.");
            form.reset();
        } else {
            alert("❌ Ошибка отправки.");
        }

    } catch (error) {
        console.error(error);
        alert("❌ Ошибка соединения.");
    }
});

})();
