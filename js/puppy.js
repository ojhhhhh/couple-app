const Puppy = {
  el: null,
  speechEl: null,
  zoneEl: null,
  dragInfo: null,
  autoTimer: null,
  _suppressNextClick: false,

  // 15张线条小狗贴图
  images: [
    'cbfc6236affba6f248eb2f59b8f68807.png',
    '88209427ab874a1ebfe951bff0013a3f.png',
    'dc8ebbd3dd0345d7be3b211a676ebdf5.png',
    'e954ddb4b60d468e855e67d9f609b495.png',
    '6feaa2d3ec5e413b8762f294ff601bf7.png',
    '6a6380774bd94fb2b9c8759a2cffad85.png',
    '2bf16c1237a545468a415e8e9f6d8311.png',
    '184eb9ce22b340aeb172f87e6500bc53.png',
    'd31ed76b5c07400d9aca15489f9f4a76.png',
    'c96024d9439f4b799f43bc88e208c5f2.png',
    '3ed38fe8731c42058a922e97c0014a6a.png',
    'f381ba1b375f4a3e9e133a05b54b7eff.png',
    '70413328c0c943ed9b7971c78c105a80.png',
    '3b922b73f6314bc7a327c8c17b9a623e.png',
    '90c8ee71db9a407a83e2b40fd1df7b06.png',
  ],

  init() {
    this.el = document.getElementById('puppy-img');
    this.speechEl = document.getElementById('puppy-speech');
    this.zoneEl = document.getElementById('puppy-zone');
    this._injectStyles();
    this.pickDailyImage();
    this.bindEvents();
    this.startAutoBehavior();
    this._startSparkles();
  },

  // 根据一年中的第几天随机选一张，每天一换
  pickDailyImage() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const idx = dayOfYear % this.images.length;
    this.el.src = this.images[idx];
  },

  _injectStyles() {
    if (document.getElementById('puppy-extra-styles')) return;
    const style = document.createElement('style');
    style.id = 'puppy-extra-styles';
    style.textContent = `
      #puppy-img.hop {
        animation: puppy-hop 0.55s ease;
      }
      @keyframes puppy-hop {
        0%, 100% { transform: translateY(0); }
        30% { transform: translateY(-22px); }
        55% { transform: translateY(0); }
        75% { transform: translateY(-8px); }
      }
      #puppy-img.wave {
        animation: puppy-wave 0.7s ease;
      }
      @keyframes puppy-wave {
        0%   { transform: rotate(0deg); }
        15%  { transform: rotate(-8deg); }
        35%  { transform: rotate(10deg); }
        55%  { transform: rotate(-6deg); }
        75%  { transform: rotate(8deg); }
        100% { transform: rotate(0deg); }
      }
      #puppy-img.wiggle {
        animation: puppy-wiggle 0.5s ease;
      }
      @keyframes puppy-wiggle {
        0%, 100% { transform: rotate(0deg); }
        25%  { transform: rotate(6deg); }
        50%  { transform: rotate(-6deg); }
        75%  { transform: rotate(4deg); }
      }
    `;
    document.head.appendChild(style);
  },

  bindEvents() {
    this.el.addEventListener('touchstart', (e) => this.onDragStart(e), { passive: false });
    this.el.addEventListener('touchmove', (e) => this.onDragMove(e), { passive: false });
    this.el.addEventListener('touchend', (e) => this.onDragEnd(e));

    this.el.addEventListener('mousedown', (e) => this.onDragStart(e));
    document.addEventListener('mousemove', (e) => this.onDragMove(e));
    document.addEventListener('mouseup', (e) => this.onDragEnd(e));

    this.el.addEventListener('click', (e) => {
      if (this._suppressNextClick) {
        this._suppressNextClick = false;
        return;
      }
      this.poke();
    });
  },

  onDragStart(e) {
    e.preventDefault();
    const point = e.touches ? e.touches[0] : e;
    this.el.classList.add('dragging');
    this.dragInfo = {
      startX: point.clientX,
      startY: point.clientY,
      moved: false
    };
    this.hideSpeech();
  },

  onDragMove(e) {
    if (!this.dragInfo) return;
    const point = e.touches ? e.touches[0] : e;
    const dx = point.clientX - this.dragInfo.startX;
    const dy = point.clientY - this.dragInfo.startY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      this.dragInfo.moved = true;
    }

    const clampX = Math.max(-80, Math.min(80, dx));
    const clampY = Math.max(-60, Math.min(60, dy));
    this.el.style.transform = `translate(${clampX}px, ${clampY}px)`;
  },

  onDragEnd(e) {
    if (!this.dragInfo) return;
    const wasMoved = this.dragInfo.moved;
    this.el.classList.remove('dragging');
    this.el.style.transform = 'translate(0, 0)';
    this.dragInfo = null;

    if (wasMoved) {
      this._suppressNextClick = true;
      setTimeout(() => { this._suppressNextClick = false; }, 100);
    }
  },

  poke() {
    const animations = ['bounce', 'spin', 'wiggle'];
    const anim = animations[Math.floor(Math.random() * animations.length)];

    const phrases = [
      '汪！', '干嘛呀~', '别戳啦！', '好痒~', '嘻嘻嘻',
      '摸头！', '你真好~', '今天也很想你', '最喜欢你啦', '再来一次！'
    ];
    const text = phrases[Math.floor(Math.random() * phrases.length)];

    this.el.classList.remove('bounce', 'spin', 'wiggle', 'hop', 'wave');
    void this.el.offsetWidth;
    this.el.classList.add(anim);

    this.popHeart();
    this.showSpeech(text);

    setTimeout(() => {
      this.el.classList.remove('bounce', 'spin', 'wiggle', 'hop', 'wave');
    }, 700);
  },

  popHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    const emojis = ['❤️', '💕', '✨', '💖', '🩷', '🌸', '💫', '🌟', '🎀'];
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const rect = this.zoneEl.getBoundingClientRect();
    heart.style.left = (rect.width / 2 + (Math.random() - 0.5) * 60) + 'px';
    heart.style.top = (rect.height / 2 - 40) + 'px';
    this.zoneEl.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
  },

  showSpeech(text) {
    this.speechEl.textContent = text;
    this.speechEl.classList.add('show');
    setTimeout(() => this.speechEl.classList.remove('show'), 2500);
  },

  hideSpeech() {
    this.speechEl.classList.remove('show');
  },

  startAutoBehavior() {
    this.autoTimer = setInterval(() => {
      if (this.dragInfo) return;

      const roll = Math.random();

      if (roll < 0.25) {
        const tilt = (Math.random() - 0.5) * 18;
        this.el.style.transform = `rotate(${tilt}deg)`;
        setTimeout(() => {
          if (!this.dragInfo && !this.el.classList.contains('dragging')) {
            this.el.style.transform = 'translate(0, 0)';
          }
        }, 2200);
      } else if (roll < 0.45) {
        this.el.classList.add('hop');
        setTimeout(() => {
          this.el.classList.remove('hop');
        }, 600);
      } else if (roll < 0.6) {
        this.el.classList.add('wave');
        setTimeout(() => {
          this.el.classList.remove('wave');
        }, 750);
      } else if (roll < 0.7) {
        const shiftX = (Math.random() - 0.5) * 8;
        const shiftY = (Math.random() - 0.5) * 6;
        this.el.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
        setTimeout(() => {
          if (!this.dragInfo && !this.el.classList.contains('dragging')) {
            this.el.style.transform = 'translate(0, 0)';
          }
        }, 1800);
      }
    }, 12000);
  },

  _startSparkles() {
    const container = document.getElementById('sparkles');
    if (!container) return;
    const emojis = ['✨','⭐','💫','🌸','🩷','🎀','·','✧','˚','🫧'];
    const spawn = () => {
      const el = document.createElement('span');
      el.className = 'sparkle';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = (Math.random() * 90 + 5) + '%';
      el.style.top = (Math.random() * 60 + 40) + '%';
      el.style.animationDuration = (6 + Math.random() * 10) + 's';
      el.style.fontSize = (0.5 + Math.random() * 1.2) + 'rem';
      container.appendChild(el);
      setTimeout(() => el.remove(), 12000);
    };
    spawn(); spawn(); spawn();
    setInterval(spawn, 4000);
  },
};
