/**
 * AIVIDEOSTUDIOONLINE.ONLINE - Interactive Logic & UI Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroPrompts();
  initInteractiveStudio();
  initComparisonSlider();
  initProductFilter();
  initPricingToggle();
  initFaqAccordion();
  initModalPreview();
  initSocialProofToasts();
  initSmoothScroll();
});

/* -------------------------------------------------------------
 * 1. NAVBAR SCROLL & MOBILE TOGGLE
 * ----------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = menuToggle.querySelector('span');
      if (icon) {
        icon.textContent = navMenu.classList.contains('open') ? '✕' : '☰';
      }
    });

    // Close when clicking nav links
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = menuToggle.querySelector('span');
        if (icon) icon.textContent = '☰';
      });
    });
  }
}

/* -------------------------------------------------------------
 * 2. HERO PROMPT PRESETS
 * ----------------------------------------------------------- */
function initHeroPrompts() {
  const heroInput = document.getElementById('heroPromptInput');
  const chips = document.querySelectorAll('.prompt-chip');
  const heroBtn = document.getElementById('heroGenerateBtn');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-prompt');
      if (heroInput && text) {
        heroInput.value = text;
        heroInput.focus();
        // Visual pulse
        chip.style.transform = 'scale(1.05)';
        setTimeout(() => chip.style.transform = '', 200);
      }
    });
  });

  if (heroBtn && heroInput) {
    heroBtn.addEventListener('click', () => {
      const val = heroInput.value.trim() || 'Thành phố tương lai Cyberpunk rực rỡ với xe bay tốc độ cao';
      // Smooth scroll to studio playground and inject prompt
      const playground = document.getElementById('playground');
      const studioInput = document.getElementById('studioPromptInput');
      if (studioInput) studioInput.value = val;
      if (playground) {
        playground.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const runBtn = document.getElementById('studioRunBtn');
          if (runBtn) runBtn.click();
        }, 600);
      }
    });
  }
}

/* -------------------------------------------------------------
 * 3. INTERACTIVE AI STUDIO PLAYGROUND
 * ----------------------------------------------------------- */
function initInteractiveStudio() {
  const modelPills = document.querySelectorAll('.model-pill');
  const aspectTabs = document.querySelectorAll('.aspect-tab');
  const cameraTabs = document.querySelectorAll('.camera-tab');
  const studioInput = document.getElementById('studioPromptInput');
  const runBtn = document.getElementById('studioRunBtn');
  const renderOverlay = document.getElementById('renderOverlay');
  const renderStep = document.getElementById('renderStepText');
  const renderProgress = document.getElementById('renderProgressFill');
  const renderPercent = document.getElementById('renderPercentText');
  const previewScreen = document.getElementById('previewScreenWrap');
  const previewImg = document.getElementById('previewActiveImg');
  const metaModel = document.getElementById('metaModelName');
  const metaAspect = document.getElementById('metaAspectRatio');

  // Model selection
  modelPills.forEach(pill => {
    pill.addEventListener('click', () => {
      modelPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const modelName = pill.querySelector('.model-pill-name').textContent;
      if (metaModel) metaModel.textContent = modelName;
    });
  });

  // Aspect ratio switch
  aspectTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      aspectTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const ratio = tab.getAttribute('data-ratio');
      if (metaAspect) metaAspect.textContent = ratio;
      if (previewScreen) {
        if (ratio === '16:9') previewScreen.style.aspectRatio = '16 / 9';
        else if (ratio === '9:16') previewScreen.style.aspectRatio = '9 / 16';
        else if (ratio === '1:1') previewScreen.style.aspectRatio = '1 / 1';
      }
    });
  });

  // Camera motion
  cameraTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      cameraTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // Simulated AI Render Pipeline
  let isRendering = false;

  const sampleResults = [
    {
      keyword: 'cyberpunk',
      img: 'assets/images/cyberpunk-car.jpg',
      prompt: 'Thành phố Cyberpunk mưa đêm rực rỡ neon, xe bay lướt tốc độ cao 60fps'
    },
    {
      keyword: 'avatar',
      img: 'assets/images/avatar-ai.jpg',
      prompt: 'MC ảo người châu Á xinh đẹp dẫn chương trình Future Sync AI'
    },
    {
      keyword: 'anime',
      img: 'assets/images/anime-fantasy.jpg',
      prompt: 'Thế giới Anime hòn đảo bay kỳ ảo, bầu trời sao băng Makoto Shinkai 4K'
    },
    {
      keyword: 'upscaler',
      img: 'assets/images/upscaler-8k.jpg',
      prompt: 'Cận cảnh mắt người máy sinh học Cybernetic lens sapphire 8K'
    }
  ];

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      if (isRendering) return;
      isRendering = true;
      runBtn.disabled = true;
      runBtn.style.opacity = '0.7';

      // Pick result image based on prompt content
      const userText = (studioInput ? studioInput.value : '').toLowerCase();
      let matched = sampleResults[0];
      if (userText.includes('mc') || userText.includes('avatar') || userText.includes('người') || userText.includes('nữ')) {
        matched = sampleResults[1];
      } else if (userText.includes('anime') || userText.includes('hoạt hình') || userText.includes('đảo') || userText.includes('sao')) {
        matched = sampleResults[2];
      } else if (userText.includes('mắt') || userText.includes('robot') || userText.includes('8k') || userText.includes('nét')) {
        matched = sampleResults[3];
      } else {
        // Random pick from list
        matched = sampleResults[Math.floor(Math.random() * sampleResults.length)];
      }

      if (renderOverlay) renderOverlay.classList.add('active');

      const steps = [
        { progress: 22, text: 'Giai đoạn 1/4: Phân tích Prompt ngữ nghĩa & Ray-tracing...' },
        { progress: 54, text: 'Giai đoạn 2/4: Khởi tạo mô hình Latent Diffusion Tensor 60FPS...' },
        { progress: 82, text: 'Giai đoạn 3/4: Tinh chỉnh vật lý ánh sáng & Khử nhiễu quang học...' },
        { progress: 100, text: 'Giai đoạn 4/4: Hoàn tất Render 4K HDR & Mastering Âm thanh!' }
      ];

      let currentStep = 0;

      function advanceStep() {
        if (currentStep < steps.length) {
          const s = steps[currentStep];
          if (renderStep) renderStep.textContent = s.text;
          if (renderProgress) renderProgress.style.width = s.progress + '%';
          if (renderPercent) renderPercent.textContent = s.progress + '%';

          currentStep++;
          setTimeout(advanceStep, 700);
        } else {
          // Finished
          setTimeout(() => {
            if (previewImg) {
              previewImg.src = matched.img;
              previewImg.style.transform = 'scale(1.05)';
              setTimeout(() => previewImg.style.transform = 'scale(1)', 400);
            }
            if (renderOverlay) renderOverlay.classList.remove('active');
            isRendering = false;
            runBtn.disabled = false;
            runBtn.style.opacity = '1';

            // Show Toast
            showToast('🎉 Video 4K đã tạo thành công!', 'Bạn có thể tải về hoặc xuất bản ngay lập tức.');
          }, 400);
        }
      }

      advanceStep();
    });
  }

  // Copy Prompt Button
  const copyBtn = document.getElementById('copyPromptBtn');
  if (copyBtn && studioInput) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(studioInput.value).then(() => {
        showToast('📋 Đã sao chép kịch bản!', 'Prompt đã được lưu vào bộ nhớ tạm.');
      }).catch(() => {
        showToast('📋 Kịch bản đã chọn', studioInput.value);
      });
    });
  }

  // Download Action
  const downloadBtn = document.getElementById('downloadVideoBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      showToast('⬇️ Đang chuẩn bị tải xuống 4K HDR...', 'Tệp video Ultra-HD sẽ sẵn sàng trong giây lát.');
    });
  }
}

/* -------------------------------------------------------------
 * 4. BEFORE / AFTER COMPARISON SLIDER
 * ----------------------------------------------------------- */
function initComparisonSlider() {
  const container = document.getElementById('compSliderBox');
  const afterWrap = document.getElementById('compAfterWrap');
  const handle = document.getElementById('compHandle');

  if (!container || !afterWrap || !handle) return;

  let isDragging = false;

  function updateSlider(xPos) {
    const rect = container.getBoundingClientRect();
    let offsetX = xPos - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;

    const percentage = (offsetX / rect.width) * 100;
    afterWrap.style.width = percentage + '%';
    handle.style.left = percentage + '%';
  }

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Support
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSlider(e.touches[0].clientX);
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateSlider(e.touches[0].clientX);
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* -------------------------------------------------------------
 * 5. PRODUCT SHOWCASE FILTERING
 * ----------------------------------------------------------- */
function initProductFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------
 * 6. BILLING PRICING TOGGLE
 * ----------------------------------------------------------- */
function initPricingToggle() {
  const toggle = document.getElementById('billingToggle');
  const labelMonthly = document.getElementById('labelMonthly');
  const labelYearly = document.getElementById('labelYearly');

  const priceStarter = document.getElementById('priceStarter');
  const pricePro = document.getElementById('pricePro');
  const priceEnterprise = document.getElementById('priceEnterprise');
  const periodStarter = document.getElementById('periodStarter');
  const periodPro = document.getElementById('periodPro');
  const periodEnterprise = document.getElementById('periodEnterprise');

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const isYearly = toggle.classList.toggle('active');

    if (isYearly) {
      if (labelMonthly) labelMonthly.classList.remove('active');
      if (labelYearly) labelYearly.classList.add('active');

      if (priceStarter) priceStarter.textContent = '0';
      if (pricePro) pricePro.textContent = '29';
      if (priceEnterprise) priceEnterprise.textContent = '89';

      if (periodStarter) periodStarter.textContent = '/tháng (thanh toán năm)';
      if (periodPro) periodPro.textContent = '/tháng (tiết kiệm 25%)';
      if (periodEnterprise) periodEnterprise.textContent = '/tháng (tiết kiệm 25%)';
    } else {
      if (labelMonthly) labelMonthly.classList.add('active');
      if (labelYearly) labelYearly.classList.remove('active');

      if (priceStarter) priceStarter.textContent = '0';
      if (pricePro) pricePro.textContent = '39';
      if (priceEnterprise) priceEnterprise.textContent = '119';

      if (periodStarter) periodStarter.textContent = '/tháng';
      if (periodPro) periodPro.textContent = '/tháng';
      if (periodEnterprise) periodEnterprise.textContent = '/tháng';
    }
  });
}

/* -------------------------------------------------------------
 * 7. FAQ ACCORDION
 * ----------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close others
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });
}

/* -------------------------------------------------------------
 * 8. VIDEO PREVIEW MODAL
 * ----------------------------------------------------------- */
function initModalPreview() {
  const modal = document.getElementById('previewModal');
  const modalClose = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalPreviewImg');
  const modalTitle = document.getElementById('modalVideoTitle');
  const modalDesc = document.getElementById('modalVideoDesc');

  // Trigger from hero play button
  const heroPlay = document.getElementById('heroPlayCenter');
  if (heroPlay) {
    heroPlay.addEventListener('click', () => {
      openModal(
        'AIVideoStudio V4.5 - Demo Tổng Quan Studio',
        'Khám phá quy trình sản xuất video điện ảnh với mô hình Quantum Latent Flow và công nghệ dựng cảnh thời gian thực.',
        'assets/images/hero-studio.jpg'
      );
    });
  }

  // Trigger from product cards
  const playButtons = document.querySelectorAll('.mini-play-btn, .card-media-wrap');
  playButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      if (!card) return;
      const img = card.querySelector('img');
      const title = card.querySelector('.card-title');
      const desc = card.querySelector('.card-desc');

      if (img && title && desc) {
        openModal(title.textContent, desc.textContent, img.getAttribute('src'));
      }
    });
  });

  function openModal(title, desc, imgSrc) {
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;
    if (modalImg) modalImg.src = imgSrc;
    if (modal) modal.classList.add('active');
  }

  function closeModal() {
    if (modal) modal.classList.remove('active');
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* -------------------------------------------------------------
 * 9. LIVE SOCIAL PROOF TOAST NOTIFICATIONS
 * ----------------------------------------------------------- */
function showToast(title, subtitle) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `
    <div class="toast-icon">⚡</div>
    <div class="toast-text">
      <strong>${title}</strong>
      <span>${subtitle}</span>
    </div>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 100);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

function initSocialProofToasts() {
  const notifications = [
    { title: 'Quốc Huy (Đạo diễn VFX, TP.HCM)', desc: 'Vừa render thành công video 4K Cyberpunk 60FPS' },
    { title: 'Lan Anh (Agency Marketing, Hà Nội)', desc: 'Đã tạo 5 Digital Avatar dẫn tin tức đa ngôn ngữ' },
    { title: 'Studio Apex (Đà Nẵng)', desc: 'Vừa nâng cấp 12 phút video cũ lên chuẩn 8K HDR' },
    { title: 'Trọng Nam (YouTuber công nghệ)', desc: 'Vừa tạo lồng tiếng song ngữ với Neural VoiceForge' }
  ];

  let index = 0;
  setInterval(() => {
    const item = notifications[index % notifications.length];
    showToast(item.title, item.desc);
    index++;
  }, 14000);

  // Initial toast after 4 seconds
  setTimeout(() => {
    const item = notifications[0];
    showToast(item.title, item.desc);
    index = 1;
  }, 4000);
}

/* -------------------------------------------------------------
 * 10. SMOOTH SCROLL FOR NAV LINKS
 * ----------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // CTA Subscription form handling
  const ctaForm = document.getElementById('ctaForm');
  if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = ctaForm.querySelector('input[type="email"]');
      if (input && input.value) {
        showToast('✨ Chúc mừng!', `Tài khoản ${input.value} đã nhận được 100 Tín chỉ AI miễn phí.`);
        input.value = '';
      }
    });
  }
}
