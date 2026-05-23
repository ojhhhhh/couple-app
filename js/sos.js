const SOS = {
  contacts: [],

  load() {
    const settings = Storage.getSettings();
    this.contacts = settings.sosContacts || [];
  },

  save() {
    const settings = Storage.getSettings();
    settings.sosContacts = this.contacts;
    Storage.setSettings(settings);
  },

  /** Compose SMS text with GPS location */
  _composeSMS(lat, lng) {
    const mapUrl = `https://maps.google.com/?q=${lat},${lng}`;
    return `🆘 我需要帮助！\n位置: ${mapUrl}\n经纬度: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  },

  /** Trigger SOS flow */
  trigger() {
    this.load();
    if (this.contacts.length === 0) return;

    // Show the SOS modal
    const overlay = document.createElement('div');
    overlay.className = 'sos-modal-overlay';
    overlay.innerHTML = `
      <div class="sos-modal">
        <h3>🆘 紧急求助</h3>
        <p>将向以下联系人发送求助短信：<br>
        ${this.contacts.map(c => `<strong>${c.name}</strong> ${c.phone}`).join('<br>')}
        </p>
        <div class="sos-actions">
          <button class="sos-cancel" id="sos-cancel">取消</button>
          <button class="sos-confirm" id="sos-confirm">确认求助</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('#sos-cancel').onclick = () => overlay.remove();
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    overlay.querySelector('#sos-confirm').onclick = () => {
      overlay.remove();
      this._execute();
    };
  },

  _execute() {
    if (!navigator.geolocation) {
      this._fallbackSMS('无法获取位置');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const msg = this._composeSMS(pos.coords.latitude, pos.coords.longitude);
        this._sendSMS(msg);
      },
      () => {
        this._fallbackSMS('位置获取失败，请直接联系');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  },

  _sendSMS(body) {
    const phones = this.contacts.map(c => c.phone).join(',');
    window.location.href = `sms:${phones}?body=${encodeURIComponent(body)}`;
  },

  _fallbackSMS(text) {
    const phones = this.contacts.map(c => c.phone).join(',');
    window.location.href = `sms:${phones}?body=${encodeURIComponent('🆘 我需要帮助！' + text)}`;
  },

  /** Render the SOS floating button */
  render() {
    const btn = document.getElementById('sos-button');
    if (!btn) return;
    this.load();
    if (this.contacts.length > 0) {
      btn.classList.remove('hidden');
      btn.onclick = () => this.trigger();
    } else {
      btn.classList.add('hidden');
    }
  },

  renderSettingsForm(formEl) {
    this.load();
    formEl.innerHTML = `
      <div class="settings-section">
        <h3>🆘 紧急联系人（最多3个）</h3>
        <div id="sos-contacts-list"></div>
        ${this.contacts.length < 3 ? `
        <div class="settings-row" style="margin-top:8px;">
          <input id="sos-name" placeholder="联系人姓名" style="flex:1">
          <input id="sos-phone" placeholder="手机号" style="flex:1.5" type="tel">
          <button id="add-sos-btn">添加</button>
        </div>` : '<div style="font-size:0.78rem;color:var(--text-sub);">已达上限3个联系人</div>'}
      </div>
    `;

    this._renderContactList(document.getElementById('sos-contacts-list'));

    const addBtn = document.getElementById('add-sos-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const name = document.getElementById('sos-name').value.trim();
        const phone = document.getElementById('sos-phone').value.trim();
        if (!name || !phone) return;
        this.contacts.push({ name, phone });
        this.save();
        this.renderSettingsForm(formEl);
      });
    }
  },

  _renderContactList(el) {
    el.innerHTML = this.contacts.length === 0
      ? '<div style="color:var(--text-sub);font-size:0.85rem;">还没有添加紧急联系人</div>'
      : this.contacts.map((c, i) => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:0.85rem;border-bottom:1px solid #f0ebe0;">
          <span>${c.name} · ${c.phone}</span>
          <button onclick="SOS.contacts.splice(${i},1);SOS.save();SOS.renderSettingsForm(document.getElementById('sos-contacts-list').parentElement.parentElement)" style="background:none;border:none;color:var(--accent);cursor:pointer;">删除</button>
        </div>`).join('');
  },
};
