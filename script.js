document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const backToTop = document.getElementById('back-to-top');

  // ── Scroll: sticky header appears ──
  window.addEventListener('scroll', () => {
    const y = window.pageYOffset;
    const heroH = document.getElementById('hero')?.offsetHeight || 500;
    if (y > heroH - 100) header.classList.add('header--visible');
    else header.classList.remove('header--visible');
    if (y > 400) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  }, { passive: true });

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ── Mobile menu ──
  const menuToggle = document.getElementById('menu-toggle');
  const menuOverlay = document.getElementById('menu-overlay');
  if (menuToggle && menuOverlay) {
    menuToggle.addEventListener('click', () => {
      const isActive = menuToggle.classList.toggle('active');
      menuOverlay.classList.toggle('active');
      document.body.style.overflow = isActive ? 'hidden' : '';
    });
    document.querySelectorAll('.menu-overlay__link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Hero Slider + CTA switching ──
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');
  const ctaButtons = document.querySelectorAll('[data-slide-cta]');
  let currentSlide = 0, slideInterval;

  function goToSlide(i) {
    slides.forEach(s => s.classList.remove('hero__slide--active'));
    dots.forEach(d => d.classList.remove('hero__dot--active'));
    ctaButtons.forEach(b => b.style.display = 'none');
    currentSlide = ((i % slides.length) + slides.length) % slides.length;
    slides[currentSlide].classList.add('hero__slide--active');
    dots[currentSlide].classList.add('hero__dot--active');
    const activeCta = document.querySelector(`[data-slide-cta="${currentSlide}"]`);
    if (activeCta) activeCta.style.display = 'inline-flex';
  }
  function startSlideshow() { slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000); }
  function resetSlideshow() { clearInterval(slideInterval); startSlideshow(); }

  dots.forEach(dot => dot.addEventListener('click', () => { goToSlide(parseInt(dot.dataset.dot)); resetSlideshow(); }));
  startSlideshow();

  // ── Vehicle Carousel – infinite auto-scroll ──
  const track = document.getElementById('vehicle-track');
  const prevBtn = document.getElementById('vehicle-prev');
  const nextBtn = document.getElementById('vehicle-next');

  if (track && prevBtn && nextBtn) {
    const originalSlides = track.querySelectorAll('.vehicle-slide');
    const totalOriginal = originalSlides.length;

    // Clone for infinite loop
    originalSlides.forEach(slide => {
      const clone = slide.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    let position = 0;
    let isTransitioning = false;
    let autoScrollTimer;

    function getSlideWidth() {
      const slide = track.querySelector('.vehicle-slide');
      return slide ? slide.offsetWidth + 16 : 300;
    }

    function updatePosition(animate) {
      track.style.transition = animate ? 'transform 0.6s ease' : 'none';
      track.style.transform = `translateX(-${position * getSlideWidth()}px)`;
    }

    function nextVehicle() {
      if (isTransitioning) return;
      isTransitioning = true;
      position++;
      updatePosition(true);
    }

    function prevVehicle() {
      if (isTransitioning) return;
      if (position <= 0) {
        position = totalOriginal;
        updatePosition(false);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => { position--; isTransitioning = true; updatePosition(true); });
        });
        return;
      }
      isTransitioning = true;
      position--;
      updatePosition(true);
    }

    track.addEventListener('transitionend', () => {
      isTransitioning = false;
      if (position >= totalOriginal) { position = 0; updatePosition(false); }
    });

    function startAutoScroll() { autoScrollTimer = setInterval(nextVehicle, 1500); }
    function stopAutoScroll() { clearInterval(autoScrollTimer); }
    function resetAutoScroll() { stopAutoScroll(); startAutoScroll(); }

    nextBtn.addEventListener('click', () => { nextVehicle(); resetAutoScroll(); });
    prevBtn.addEventListener('click', () => { prevVehicle(); resetAutoScroll(); });
    track.addEventListener('mouseenter', stopAutoScroll);
    track.addEventListener('mouseleave', startAutoScroll);
    startAutoScroll();
    window.addEventListener('resize', () => updatePosition(false));
  }

  // ── Scroll animations ──
  const animEls = document.querySelectorAll('.engagement-card, .about__text-block, .about__founder, .about__images-row, .services-strip__card');
  animEls.forEach(el => el.classList.add('animate-on-scroll'));
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.children].filter(c => c.classList.contains('animate-on-scroll'));
        entry.target.style.transitionDelay = `${siblings.indexOf(entry.target) * .1}s`;
        entry.target.classList.add('animated');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: .1 });
  animEls.forEach(el => obs.observe(el));

  // ── Smooth scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
      }
    });
  });
});
