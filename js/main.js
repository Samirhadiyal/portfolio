/* ═══════════════════════════════════════════════════════════════
   SAMIR HADIYAL — PORTFOLIO JAVASCRIPT
   Scroll animations, theme switcher, counters, tilt effects
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // Trigger hero animations immediately on load
  const heroAnims = document.querySelectorAll('#landing .anim');
  heroAnims.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('anim-visible');
    }, index * 100);
  });

  // ── SCROLL-TRIGGERED ANIMATIONS (Intersection Observer) ──────
  const animElements = document.querySelectorAll('.anim:not(#landing .anim)');
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -20px 0px' };

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animElements.forEach(el => animObserver.observe(el));

  // ── NAVBAR — Scroll shadow + active section highlight ────────
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ── SMOOTH SCROLL for anchor links ───────────────────────────
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPos = target.offsetTop - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });

        // Close mobile nav if open
        const navLinksEl = document.getElementById('navLinks');
        const hamburger = document.getElementById('navHamburger');
        if (navLinksEl.classList.contains('open')) {
          navLinksEl.classList.remove('open');
          hamburger.classList.remove('active');
        }
      }
    });
  });

  // ── MOBILE NAV HAMBURGER ─────────────────────────────────────
  const hamburger = document.getElementById('navHamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksEl.classList.toggle('open');
  });

  // ── SKILL BAR ANIMATIONS ─────────────────────────────────────
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillPcts = document.querySelectorAll('.skill-item-pct');
  let skillsAnimated = false;

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        animateSkills();
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) skillObserver.observe(skillsSection);

  function animateSkills() {
    skillBars.forEach((bar, index) => {
      const width = bar.dataset.width;
      setTimeout(() => {
        bar.style.width = width + '%';
      }, index * 60);
    });

    // Animate percentage counters
    skillPcts.forEach((pct, index) => {
      const target = parseInt(pct.dataset.target);
      setTimeout(() => {
        animateCounter(pct, 0, target, 1000, '%');
      }, index * 60);
    });
  }

  // ── STAT COUNTER ANIMATIONS ──────────────────────────────────
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach((stat, index) => {
          const target = parseInt(stat.dataset.count);
          setTimeout(() => {
            animateCounter(stat, 0, target, 1200, '+');
          }, index * 200);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const achieveSection = document.getElementById('achievements');
  if (achieveSection) statsObserver.observe(achieveSection);

  function animateCounter(element, start, end, duration, suffix) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      element.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // ── CERTIFICATE CARD TILT (mouse-follow) ─────────────────────
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });

  // ── CONTACT FORM — Send button pulse after section visible ───
  const contactSection = document.getElementById('contact');
  const sendBtn = document.getElementById('sendBtn');

  const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          sendBtn.classList.add('pulse');
          setTimeout(() => sendBtn.classList.remove('pulse'), 800);
        }, 1500);
        contactObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (contactSection) contactObserver.observe(contactSection);

  // ── CONTACT FORM HANDLING ────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName').value;
      const email = document.getElementById('formEmail').value;
      const subject = document.getElementById('formSubject').value;
      const message = document.getElementById('formMessage').value;

      // Build mailto link with pre-filled fields
      const mailtoLink = `mailto:hadiyalsamir25@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      )}`;
      window.location.href = mailtoLink;

      // Visual feedback
      sendBtn.textContent = 'Opening mail client...';
      setTimeout(() => {
        sendBtn.innerHTML = `Send Message <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>`;
      }, 3000);
    });
  }

  // ── PARALLAX-LIGHT on Hero Section orbs (mouse move) ─────────
  const landing = document.getElementById('landing');
  if (landing) {
    landing.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      landing.style.setProperty('--mouse-x', x + 'px');
      landing.style.setProperty('--mouse-y', y + 'px');
    });
  }

  // ── CERTIFICATE MODAL ────────────────────────────────────────
  const certTriggers = document.querySelectorAll('.cert-modal-trigger');
  const certModal = document.getElementById('certModal');
  const certModalClose = document.getElementById('certModalClose');
  const certModalCanvas = document.getElementById('certModalCanvas');

  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
  }

  let currentRenderTask = null;

  certTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const pdfPath = trigger.getAttribute('data-cert');
      if (pdfPath && window.pdfjsLib) {
        // Clear canvas
        const context = certModalCanvas.getContext('2d');
        context.clearRect(0, 0, certModalCanvas.width, certModalCanvas.height);
        
        certModal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Load PDF page 1
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        loadingTask.promise.then(pdf => {
          pdf.getPage(1).then(page => {
            if (currentRenderTask) {
              currentRenderTask.cancel();
            }

            // Adjust size to fit container width nicely
            const modalContent = document.querySelector('.cert-modal-content');
            const targetWidth = Math.min(modalContent.clientWidth - 40, 1000);
            const tempViewport = page.getViewport({ scale: 1.0 });
            const scale = targetWidth / tempViewport.width;
            
            const viewport = page.getViewport({ scale: Math.max(scale, 1.5) });
            certModalCanvas.height = viewport.height;
            certModalCanvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport: viewport
            };

            currentRenderTask = page.render(renderContext);
            currentRenderTask.promise.then(() => {
              currentRenderTask = null;
            }).catch(err => {
              if (err.name !== 'RenderingCancelledException') {
                console.error(err);
              }
            });
          });
        }).catch(err => {
          console.error('Error loading PDF: ', err);
        });
      }
    });
  });

  // Render small previews for each certificate card on page load
  const cardCanvases = document.querySelectorAll('.cert-card-canvas');
  cardCanvases.forEach(canvas => {
    const card = canvas.closest('.cert-card');
    const pdfPath = card.getAttribute('data-cert');
    if (pdfPath && window.pdfjsLib) {
      pdfjsLib.getDocument(pdfPath).promise.then(pdf => {
        pdf.getPage(1).then(page => {
          const context = canvas.getContext('2d');
          const tempViewport = page.getViewport({ scale: 1.0 });
          const scale = 400 / tempViewport.width; // Fixed width for clean resolution preview
          const viewport = page.getViewport({ scale: scale });
          
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          page.render(renderContext);
        });
      }).catch(err => {
        console.error('Error rendering card preview: ', err);
      });
    }
  });

  function closeCertModal() {
    certModal.classList.remove('show');
    document.body.style.overflow = '';
    if (currentRenderTask) {
      currentRenderTask.cancel();
      currentRenderTask = null;
    }
  }

  if (certModalClose) {
    certModalClose.addEventListener('click', closeCertModal);
  }

  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal || e.target.classList.contains('cert-modal-canvas-wrapper')) {
        closeCertModal();
      }
    });
  }
});
