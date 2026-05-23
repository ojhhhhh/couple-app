const Diary = {
  entries: [],

  load() {
    this.entries = Storage.getDiary();
  },

  save() {
    Storage.setDiary(this.entries);
  },

  /** Resize and compress an image file to base64 under 150KB */
  _compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const maxW = 400;
          let w = img.width, h = img.height;
          if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }

          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);

          // Try quality levels until under 150KB
          let quality = 0.6;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);
          while (dataUrl.length > 150 * 1024 && quality > 0.15) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          if (dataUrl.length > 150 * 1024) {
            reject(new Error('图片太大，请选择更小的图片'));
          } else {
            resolve(dataUrl);
          }
        };
        img.onerror = () => reject(new Error('图片加载失败'));
        img.src = reader.result;
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  },

  _moodReplies: {
    happy: [
      '看到你开心我也摇尾巴啦~ 汪汪！',
      '开心是会传染的！小狗也觉得今天是好日子~',
      '你的笑容就是最好的阳光☀️',
      '快乐的心情要好好珍藏起来哦~',
      '太好啦！继续保持这份好心情吧~',
      '开心的你最美了！小狗盖章认证~',
      '分享快乐会让快乐翻倍哦~',
      '今天一定是闪闪发光的一天！',
    ],
    normal: [
      '平淡的日子也是好日子~ 汪！',
      '有时候不需要特别开心，平静就很珍贵~',
      '每天都是独一无二的，包括今天~',
      '顺其自然，一切都在慢慢变好~',
      '平常心是最好的人生态度呢~',
      '不急不躁，按自己的节奏来~',
      '温柔地对待每一天，每一天也会温柔待你~',
      '舒服的状态就是最好的状态~',
    ],
    sad: [
      '没关系，难过的时候我陪你~ 摸摸头~',
      '伤心的事情说出来就减轻了一半！',
      '不开心也没关系，小狗会一直在这里~',
      '哭一哭也没事的，眼泪会带走烦恼~',
      '抱抱你，难过的事情都会过去的~',
      '你已经很努力了，累了就休息吧~',
      '明天会是新的一天，一切都会好起来的~',
      '不管发生什么，你都是被爱着的~',
    ],
  },

  _randomReply(mood) {
    const pool = this._moodReplies[mood] || this._moodReplies.normal;
    return pool[Math.floor(Math.random() * pool.length)];
  },

  addEntry(content, mood, imageDataUrl) {
    const entry = {
      id: Date.now(),
      content,
      mood,
      createTime: new Date().toISOString(),
      image: imageDataUrl || null,
      reply: this._randomReply(mood),
    };
    this.entries.unshift(entry);
    this.save();
  },

  removeEntry(id) {
    this.entries = this.entries.filter(e => e.id !== id);
    this.save();
  },

  _moodEmoji(mood) {
    return { happy: '😊', normal: '😐', sad: '😢' }[mood] || '😐';
  },

  _moodClass(mood) {
    return 'diary-mood-' + mood;
  },

  render(el) {
    this.load();
    const recent = this.entries.slice(0, 5);

    let html = `
      <div class="diary-form">
        <textarea id="diary-text" placeholder="今天想说什么呢..."></textarea>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="diary-moods">
            <button class="diary-mood-btn" data-mood="happy">😊</button>
            <button class="diary-mood-btn" data-mood="normal">😐</button>
            <button class="diary-mood-btn" data-mood="sad">😢</button>
          </div>
          <div>
            <input type="file" id="diary-image" accept="image/*" style="display:none">
            <button id="diary-image-btn" style="background:none;border:1.5px solid #E0D8D0;border-radius:10px;padding:6px 12px;font-size:0.8rem;cursor:pointer;">📷 图片</button>
            <button id="diary-submit" style="background:var(--accent-strong);color:#fff;border:none;border-radius:10px;padding:7px 16px;font-size:0.85rem;cursor:pointer;font-weight:600;margin-left:6px;">发布</button>
          </div>
        </div>
        <div id="diary-preview" style="margin-top:6px;"></div>
      </div>
    `;

    if (recent.length === 0) {
      html += '<div style="text-align:center;color:var(--text-sub);font-size:0.85rem;padding:8px 0;">还没有日记，写一条吧~</div>';
    } else {
      html += recent.map(e => {
        const date = new Date(e.createTime);
        const dateStr = `${date.getMonth()+1}/${date.getDate()} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
        return `
          <div class="diary-entry ${this._moodClass(e.mood)}">
            <button class="diary-delete" data-diary-id="${e.id}">✕</button>
            <div class="diary-text">${this._moodEmoji(e.mood)} ${e.content}</div>
            ${e.image ? `<img class="diary-image" src="${e.image}" alt="">` : ''}
            <div class="diary-meta">
              <span>${dateStr}</span>
            </div>
            ${e.reply ? `<div class="diary-reply">🐾 ${e.reply}</div>` : ''}
          </div>`;
      }).join('');

      if (this.entries.length > 5) {
        html += `<div style="text-align:center;font-size:0.78rem;color:var(--text-sub);margin-top:4px;">还有 ${this.entries.length - 5} 条更早的日记...</div>`;
      }
    }

    el.innerHTML = html;

    // --- bind events ---
    let selectedMood = 'happy';
    let imageDataUrl = null;

    const moodBtns = el.querySelectorAll('.diary-mood-btn');
    moodBtns.forEach(b => {
      b.addEventListener('click', () => {
        moodBtns.forEach(x => x.classList.remove('selected'));
        b.classList.add('selected');
        selectedMood = b.dataset.mood;
      });
    });
    // Default select happy
    moodBtns[0]?.classList.add('selected');

    document.getElementById('diary-image-btn')?.addEventListener('click', () => {
      document.getElementById('diary-image').click();
    });

    document.getElementById('diary-image')?.addEventListener('change', async (ev) => {
      const file = ev.target.files[0];
      if (!file) return;
      try {
        imageDataUrl = await this._compressImage(file);
        document.getElementById('diary-preview').innerHTML = `<img src="${imageDataUrl}" style="max-width:120px;border-radius:8px;"><span style="font-size:0.75rem;color:var(--text-sub);margin-left:6px;">已选择</span>`;
      } catch (err) {
        alert(err.message);
      }
    });

    document.getElementById('diary-submit')?.addEventListener('click', () => {
      const text = document.getElementById('diary-text').value.trim();
      if (!text) return;
      this.addEntry(text, selectedMood, imageDataUrl);
      this.render(el);
    });

    // Delete buttons
    el.querySelectorAll('.diary-delete').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        this.removeEntry(parseInt(btn.dataset.diaryId));
        this.render(el);
      });
    });
  },
};
