const Photos = {
  photos: [],
  MAX_STORAGE_KB: 4500,

  load() {
    this.photos = Storage.getPhotos();
  },

  save() {
    Storage.setPhotos(this.photos);
  },

  /** Compress and resize image to safe size */
  _compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const maxW = 600;
          let w = img.width, h = img.height;
          if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }

          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);

          let quality = 0.65;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);
          while (dataUrl.length > 200 * 1024 && quality > 0.15) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('图片加载失败'));
        img.src = reader.result;
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  },

  addPhoto(dataUrl, caption) {
    const newSize = Math.round(dataUrl.length / 1024);
    const used = Storage.getStorageUsed();
    if (used + newSize > this.MAX_STORAGE_KB) {
      alert(`存储空间不足！已用 ${used}KB / ${this.MAX_STORAGE_KB}KB，此图片 ${newSize}KB。请删除一些旧照片后再试。`);
      return false;
    }

    this.photos.unshift({
      id: Date.now(),
      data: dataUrl,
      caption: caption || '',
      createTime: new Date().toISOString(),
    });
    this.save();
    return true;
  },

  removePhoto(id) {
    this.photos = this.photos.filter(p => p.id !== id);
    this.save();
  },

  render(el) {
    this.load();

    let html = `
      <div style="display:flex;gap:8px;margin-bottom:12px;align-items:center;">
        <input type="file" id="photo-upload" accept="image/*" style="display:none">
        <button id="photo-upload-btn" style="background:var(--accent-strong);color:#fff;border:none;border-radius:10px;padding:8px 16px;font-size:0.85rem;cursor:pointer;font-weight:600;">📷 上传照片</button>
        <input id="photo-caption" placeholder="添加说明（可选）" style="flex:1;padding:8px 12px;border:1.5px solid #E0D8D0;border-radius:10px;font-size:0.85rem;font-family:var(--font);background:#FFFDFA;">
      </div>
      <div style="font-size:0.72rem;color:var(--text-sub);margin-bottom:8px;">已用 ${Storage.getStorageUsed()}KB / ${this.MAX_STORAGE_KB}KB</div>
    `;

    if (this.photos.length === 0) {
      html += '<div style="text-align:center;color:var(--text-sub);font-size:0.85rem;padding:12px 0;">还没有照片，上传一张吧~</div>';
    } else {
      html += '<div class="photo-grid">';
      html += this.photos.map(p => `
        <div class="photo-item">
          <img src="${p.data}" alt="${p.caption}" data-photo-id="${p.id}">
          <button class="photo-delete" data-photo-id="${p.id}">✕</button>
          ${p.caption ? `<div class="photo-caption">${p.caption}</div>` : ''}
        </div>
      `).join('');
      html += '</div>';
    }

    el.innerHTML = html;

    // Upload
    document.getElementById('photo-upload-btn')?.addEventListener('click', () => {
      document.getElementById('photo-upload').click();
    });

    document.getElementById('photo-upload')?.addEventListener('change', async (ev) => {
      const file = ev.target.files[0];
      if (!file) return;
      try {
        const dataUrl = await this._compressImage(file);
        const caption = document.getElementById('photo-caption').value.trim();
        if (this.addPhoto(dataUrl, caption)) {
          this.render(el);
        }
      } catch (err) {
        alert('图片处理失败: ' + err.message);
      }
    });

    // Delete
    el.querySelectorAll('.photo-delete').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (confirm('确定删除这张照片吗？')) {
          this.removePhoto(parseInt(btn.dataset.photoId));
          this.render(el);
        }
      });
    });

    // Lightbox
    el.querySelectorAll('.photo-item img').forEach(img => {
      img.addEventListener('click', () => {
        const lightbox = document.getElementById('photo-lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        if (lightbox && lightboxImg) {
          lightboxImg.src = img.src;
          lightbox.classList.remove('hidden');
        }
      });
    });

    // Lightbox close
    const lightbox = document.getElementById('photo-lightbox');
    if (lightbox) {
      lightbox.querySelector('.lightbox-close')?.addEventListener('click', () => {
        lightbox.classList.add('hidden');
      });
      lightbox.addEventListener('click', (ev) => {
        if (ev.target === lightbox) lightbox.classList.add('hidden');
      });
    }
  },
};
