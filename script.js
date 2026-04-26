document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // ── 1. LENIS SMOOTH SCROLLING ──
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Integrate Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // ── 2. PRELOADER ANIMATION ──
  const plAv = document.querySelector('.pl-av');
  if (plAv) {
    // Preservar o HTML original para manter o <br> no mobile
    const originalHTML = plAv.innerHTML;
    // Criar animação baseada no conteúdo, mas mantendo a estrutura
    // Para simplificar e garantir a quebra de linha, vamos animar apenas a opacidade do bloco ou ajustar o split
    const htmlSegments = originalHTML.split(/<br.*?>/i);
    plAv.innerHTML = '';
    
    htmlSegments.forEach((segment, idx) => {
      const segmentSpan = document.createElement('span');
      segmentSpan.className = 'pl-line';
      segmentSpan.style.display = 'block';
      
      const chars = segment.trim().split('');
      chars.forEach(char => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        segmentSpan.appendChild(span);
      });
      
      plAv.appendChild(segmentSpan);
    });
  }

  const tlPreloader = gsap.timeline();
  tlPreloader
    .fromTo('.pl-av .pl-line span', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.05, ease: 'expo.out' }
    )
    .to('.pl-bar', { width: '100%', duration: 1.5, ease: 'power3.inOut' }, "+=0.4")
    .to('.preloader', { yPercent: -100, duration: 1.5, ease: 'power4.inOut', delay: 0.3 })
    .from('.ht-text', { yPercent: 100, duration: 1.5, stagger: 0.2, ease: 'power4.out' }, "-=0.8")
    .from('.hero-bg img', { scale: 1.3, duration: 3, ease: 'power3.out' }, "-=2.0");

  // ── 3. CUSTOM CURSOR ──
  const cursor = document.getElementById('custom-cursor');
  if (window.innerWidth > 1024) {
    document.addEventListener('mousemove', (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });
    });

    // Magnetic Links Hover
    const magneticLinks = document.querySelectorAll('.magnetic-link, .btn-book');
    magneticLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        cursor.querySelector('.cursor-text').textContent = "Click";
      });
      link.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
      });
    });

    // Gallery Hover
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        cursor.querySelector('.cursor-text').textContent = "View";
      });
      item.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
      });
    });
  } else {
    cursor.style.display = 'none'; // Hide on mobile
  }

  // ── 4. PARALLAX EFFECTS ──
  // Statement Text Reveal
  gsap.from('.statement-text', {
    scrollTrigger: {
      trigger: '.statement',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 1.5,
    ease: 'power3.out'
  });

  // Gold Text Color Transition
  gsap.to('.expertise-left .section-title em', {
    color: '#CBA469',
    duration: 1.5,
    scrollTrigger: {
      trigger: '.expertise',
      start: 'top 70%',
      end: 'top 40%',
      scrub: 1
    }
  });

  // Parallax Break Image
  gsap.to('.parallax-img', {
    scrollTrigger: {
      trigger: '.parallax-break',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    },
    y: '20%',
    ease: 'none'
  });

  // ── 7. GALLERY HORIZONTAL SCROLL (Pinning the entire section) ──
  const track = document.querySelector('.gallery-track');
  const wrapper = document.querySelector('.gallery-wrapper');
  
  if (track && wrapper) {
    const amountToScroll = track.scrollWidth - window.innerWidth;
    
    gsap.to(track, {
      x: () => -amountToScroll,
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: () => `+=${amountToScroll}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });

    // Image Parallax within gallery items
    const imgWrappers = document.querySelectorAll('.gi-img-wrapper img');
    imgWrappers.forEach(img => {
      gsap.to(img, {
        x: '20%',
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${amountToScroll}`,
          scrub: true
        }
      });
    });
  }

  // ── 6. EXPERTISE LIST ANIMATION ──
  const expItems = document.querySelectorAll('.exp-item');
  expItems.forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 85%'
      },
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out'
    });
  });

  // ── 7. ABOUT SPECIALIST ANIMATION ──
  gsap.from('.about-img', {
    scrollTrigger: {
      trigger: '.about-specialist',
      start: 'top 80%',
      scrub: 1
    },
    scale: 1.2,
    duration: 1.5,
    ease: 'power2.out'
  });

  gsap.from('.about-content > *', {
    scrollTrigger: {
      trigger: '.about-content',
      start: 'top 85%'
    },
    opacity: 0,
    y: 50,
    stagger: 0.2,
    duration: 1,
    ease: 'power3.out'
  });

  // ── 8. MASTERCLASS ANIMATION ──
  gsap.from('.masterclass-img', {
    scrollTrigger: {
      trigger: '.masterclass-section',
      start: 'top 80%',
      scrub: 1
    },
    x: 100,
    opacity: 0,
    duration: 1.5,
    ease: 'power2.out'
  });

  gsap.from('.masterclass-content > *', {
    scrollTrigger: {
      trigger: '.masterclass-content',
      start: 'top 85%'
    },
    opacity: 0,
    x: -50,
    stagger: 0.2,
    duration: 1,
    ease: 'power3.out'
  });

  // ── 9. TESTIMONIAL ROTATOR ──
  const slides = document.querySelectorAll('.testi-slide');
  if (slides.length > 0) {
    let currentSlide = 0;
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 6000);
  }

  // ── 10. FOOTER BACK TO TOP ──
  const footerLogo = document.querySelector('.footer-huge-text');
  if (footerLogo) {
    footerLogo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── 11. SCROLL PROGRESS & NAV TOGGLE ──
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    
    // Toggle nav glassmorphism
    if (nav) {
      if (winScroll > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) progressBar.style.width = scrolled + "%";
  });

  // ── 12. LIGHTBOX GALLERY ──
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  
  if (lightbox && lightboxImg && lightboxClose) {
    const galleryImgWrappers = document.querySelectorAll('.gi-img-wrapper');
    
    galleryImgWrappers.forEach(wrapper => {
      wrapper.addEventListener('click', () => {
        const img = wrapper.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightbox.classList.add('active');
          lenis.stop(); // Pause smooth scrolling
        }
      });
    });

    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      lenis.start(); // Resume scrolling
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        lenis.start();
      }
    });
  }

  // ── 12. MOBILE MENU TOGGLE ──
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      
      // Bloqueia o scroll da página quando o menu está aberto
      if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
        lenis.stop();
      } else {
        document.body.style.overflow = '';
        lenis.start();
      }
    });

    // Fecha o menu ao clicar em um link
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        lenis.start();
      });
    });
  }

  // ── 13. HERO LEAD FORM LOGIC (Hair Design VIP) ──
  const leadForm = document.getElementById('lead-form');
  const heroCard = document.querySelector('.hero-form-card');
  const urlParams = new URLSearchParams(window.location.search);
  
  // Oferta Dinâmica via URL
  const dynamicOffer = urlParams.get('o') || 'Consultoria de Hair Design Cortesia';
  
  // Atualiza textos da oferta se existirem no DOM
  const offerTitle = document.querySelector('.hero-form-card h3');
  const offerDesc = document.querySelector('.hero-form-card .form-subtitle');
  if (offerTitle) offerTitle.innerText = dynamicOffer;
  if (offerDesc) offerDesc.innerText = `Preencha abaixo para solicitar sua ${dynamicOffer.toLowerCase()}.`;

  if (leadForm && heroCard) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('lead-name').value;
      const whatsapp = document.getElementById('lead-whatsapp').value;
      
      const message = `Olá Andrea! Meu nome é ${name}. Acabei de solicitar minha *${dynamicOffer}* através do site. Gostaria de agendar meu horário!`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/5512996023596?text=${encodedMessage}`;
      
      // Feedback visual
      const btn = leadForm.querySelector('button');
      btn.textContent = "Reservando sua Vaga...";
      btn.style.opacity = "0.7";
      
      setTimeout(() => {
        heroCard.innerHTML = `
          <div class="hero-form-success" style="text-align: center; animation: fadeIn 0.8s ease forwards;">
            <div class="success-icon" style="color: var(--accent); font-size: 2.5rem; margin-bottom: 1.5rem;">✧</div>
            <h3 style="font-size: 1.2rem; color: var(--accent); margin-bottom: 1rem; font-family: var(--ff-display);">Solicitação Enviada!</h3>
            <p style="font-size: 0.85rem; opacity: 0.8; margin-bottom: 2rem; line-height: 1.6;">Parabéns, ${name}! Sua solicitação de <strong>${dynamicOffer}</strong> foi pré-registrada.</p>
            <a href="${whatsappUrl}" target="_blank" class="hero-form-btn" style="display: block; text-decoration: none;">Confirmar via WhatsApp</a>
            <p class="form-disclaimer" style="margin-top: 1.5rem;">Clique acima para finalizar sua reserva exclusiva.</p>
          </div>
        `;
      }, 1000);
    });
  }

  // ── 14. MENTORSHIP CTA REVEAL LOGIC (YouTube API & Dynamic Control) ──
  const mentorshipActions = document.querySelector('.mentorship-actions');
  const btnVip = document.querySelector('.btn-vip');
  
  const isMentorshipFocus = urlParams.get('mentoria') === 'true';
  const dynamicVideoId = urlParams.get('v') || 'dQw4w9WgXcQ'; // ID padrão caso não venha no link
  const dynamicGroupLink = urlParams.get('g'); // Link do grupo opcional via URL

  // Se vier um link de grupo na URL, atualiza o botão
  if (dynamicGroupLink && btnVip) {
    btnVip.href = dynamicGroupLink.startsWith('http') ? dynamicGroupLink : `https://chat.whatsapp.com/${dynamicGroupLink}`;
  }

  if (isMentorshipFocus) {
    document.body.classList.add('focus-mode');
  }
  
  window.revealMentorshipCta = function() {
    if (mentorshipActions) {
      mentorshipActions.classList.add('reveal');
      if (isMentorshipFocus) {
        document.body.classList.remove('focus-mode');
        ScrollTrigger.refresh();
      }
    }
  }

  // Carrega a API do YouTube
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = function() {
    new YT.Player('mentorship-video', {
      height: '100%',
      width: '100%',
      videoId: dynamicVideoId, 
      playerVars: {
        'autoplay': isMentorshipFocus ? 1 : 0,
        'modestbranding': 1,
        'rel': 0
      },
      events: {
        'onStateChange': onPlayerStateChange
      }
    });
  }

  function onPlayerStateChange(event) {
    if (event.data === 0) {
      revealMentorshipCta();
    }
  }

  // ── 15. STICKY CTA SCROLL LOGIC ──
  const stickyCta = document.querySelector('.sticky-mobile-cta');
  if (stickyCta) {
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercent > 60) {
        stickyCta.style.display = 'block';
        setTimeout(() => stickyCta.classList.add('visible'), 10);
      } else {
        stickyCta.classList.remove('visible');
        setTimeout(() => {
          if (!stickyCta.classList.contains('visible')) {
            stickyCta.style.display = 'none';
          }
        }, 600);
      }
    });
  }
});
