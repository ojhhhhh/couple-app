const Period = {
  records: [],
  avgCycle: 28,
  avgDuration: 5,

  SYMPTOMS: ['腹痛', '腰痛', '头痛', '疲劳', '情绪波动', '乳房胀痛', '其他'],

  CARE_TIPS: {
    during: [
      '🫖 泡杯红糖水，暖暖的~', '🔥 暖宝宝贴在小腹上，缓解不适~',
      '🛌 早点休息，别熬夜哦~', '🍫 适量吃点黑巧克力，心情会好~',
      '🚿 温水淋浴，放松身心~', '🧘 轻柔的伸展运动有助于缓解~',
    ],
    upcoming: [
      '🎒 包里备好卫生用品~', '💧 这几天多喝水，少喝冷饮~',
      '😴 保证充足睡眠，别太累~', '📅 提前安排好这几天的作息~',
    ],
    normal: [
      '🏃 适当运动有助于调理周期~', '🥗 均衡饮食，保持好状态~',
      '☀️ 晒晒太阳，补充维生素D~', '📝 记得记录下次的日期哦~',
    ],
  },

  load() {
    const raw = Storage.getPeriods();
    this.records = raw.map(r => this._migrate(r));
  },

  save() {
    Storage.setPeriods(this.records);
  },

  /** Migrate old {date} format to new {startDate, endDate, symptoms} */
  _migrate(r) {
    if (r.startDate) return r;
    return {
      startDate: r.date,
      endDate: '',
      symptoms: [],
    };
  },

  addRecord(startDate, endDate, symptoms) {
    this.records.push({
      startDate,
      endDate: endDate || '',
      symptoms: symptoms || [],
    });
    this.records.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    this.save();
  },

  removeRecord(index) {
    this.records.splice(index, 1);
    this.save();
  },

  /** Average cycle length using last 3 records */
  calcAvgCycle() {
    const sorted = [...this.records].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    const last3 = sorted.slice(-3);
    if (last3.length < 2) return this.avgCycle;
    let sum = 0, count = 0;
    for (let i = 1; i < last3.length; i++) {
      const diff = (new Date(last3[i].startDate) - new Date(last3[i-1].startDate)) / 86400000;
      if (diff > 15 && diff < 45) { sum += diff; count++; }
    }
    return count > 0 ? Math.round(sum / count) : this.avgCycle;
  },

  predictNext() {
    if (this.records.length === 0) return null;
    const last = new Date(this.records[this.records.length - 1].startDate);
    const cycle = this.calcAvgCycle();
    last.setDate(last.getDate() + cycle);
    return last;
  },

  getStatus() {
    if (this.records.length === 0) return { phase: 'no_data', text: '还没有记录哦，在设置里添加吧~', icon: '📝' };

    const today = new Date(); today.setHours(0, 0, 0, 0);

    for (const r of this.records) {
      const start = new Date(r.startDate); start.setHours(0, 0, 0, 0);
      const end = r.endDate ? new Date(r.endDate) : new Date(start);
      if (!r.endDate) end.setDate(end.getDate() + this.avgDuration);
      end.setHours(0, 0, 0, 0);

      if (today >= start && today <= end) {
        const dayNum = Math.floor((today - start) / 86400000) + 1;
        return { phase: 'during', text: `生理期第 ${dayNum} 天，注意保暖，多喝热水~`, icon: '🌸' };
      }
    }

    const next = this.predictNext();
    if (next) {
      const diffDays = Math.ceil((next - today) / 86400000);
      if (diffDays <= 3 && diffDays >= 0) {
        return { phase: 'upcoming', text: `预计 ${diffDays === 0 ? '今天' : diffDays + '天后'} 要来啦，提前准备哦~`, icon: '🌱' };
      }
      if (diffDays < 0 && diffDays > -7) {
        return { phase: 'just_ended', text: '刚结束，好好休息补充营养~', icon: '🩷' };
      }
      return { phase: 'normal', text: `下次预计 ${next.getMonth()+1}月${next.getDate()}日，一切正常~`, icon: '✨' };
    }
    return { phase: 'normal', text: '一切安好~', icon: '✨' };
  },

  _randomTip(phase) {
    const tips = this.CARE_TIPS[phase] || this.CARE_TIPS.normal;
    return tips[Math.floor(Math.random() * tips.length)];
  },

  render(el) {
    this.load();
    const status = this.getStatus();
    const tip = this._randomTip(status.phase);

    let html = `<div class="period-phase">${status.icon} ${status.text}</div>`;

    // 3-day advance warning
    if (status.phase === 'upcoming') {
      html += `<div style="margin-top:4px;font-size:0.82rem;color:#D06060;">⚠️ 还有几天就到日子啦，提前准备~</div>`;
    }

    html += `<div class="period-next">${tip}</div>`;

    // Mini calendar
    html += this._renderMiniCalendar();

    el.innerHTML = html;
  },

  _renderMiniCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

    // Collect period days and predicted days
    const periodDays = new Set();
    const predictedDays = new Set();

    for (const r of this.records) {
      const start = new Date(r.startDate);
      const end = r.endDate ? new Date(r.endDate) : new Date(start);
      if (!r.endDate) end.setDate(end.getDate() + this.avgDuration);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (d.getMonth() === month && d.getFullYear() === year) {
          periodDays.add(d.getDate());
        }
      }
    }

    const next = this.predictNext();
    if (next && next.getMonth() === month && next.getFullYear() === year) {
      for (let i = 0; i < this.avgDuration; i++) {
        const d = new Date(next);
        d.setDate(d.getDate() + i);
        if (d.getMonth() === month) predictedDays.add(d.getDate());
      }
    }

    let cells = '';
    // Previous month filler
    for (let i = firstDay - 1; i >= 0; i--) {
      cells += `<div class="cal-day other-month">${prevMonthDays - i}</div>`;
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      let cls = 'cal-day';
      if (d === today) cls += ' today';
      if (periodDays.has(d)) cls += ' period-day';
      else if (predictedDays.has(d)) cls += ' predicted-day';
      cells += `<div class="${cls}">${d}</div>`;
    }

    return `
      <div class="period-calendar">
        ${dayNames.map(n => `<div class="cal-header">${n}</div>`).join('')}
        ${cells}
      </div>
      <div style="display:flex;gap:10px;font-size:0.7rem;color:var(--text-sub);justify-content:center;">
        <span>🔴 经期</span><span>🟠 预测</span>
      </div>`;
  },

  renderSettingsForm(formEl) {
    this.load();
    formEl.innerHTML = `
      <div class="settings-section">
        <h3>🌸 生理期记录</h3>
        <div class="settings-row">
          <input id="period-start" type="date" placeholder="开始日期">
          <input id="period-end" type="date" placeholder="结束日期(可选)">
        </div>
        <div style="font-size:0.82rem;color:var(--text-sub);margin-bottom:6px;">症状（可多选）：</div>
        <div class="symptom-list" id="symptom-list">
          ${this.SYMPTOMS.map(s => `<span class="symptom-chip" data-symptom="${s}">${s}</span>`).join('')}
        </div>
        <div class="settings-row" style="margin-top:8px;">
          <button id="add-period-btn">记录本次</button>
        </div>
        <div id="period-list" style="margin-top:10px;"></div>
      </div>
    `;

    // Symptom chip toggle
    const selectedSymptoms = new Set();
    formEl.querySelectorAll('.symptom-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const s = chip.dataset.symptom;
        if (selectedSymptoms.has(s)) { selectedSymptoms.delete(s); chip.classList.remove('selected'); }
        else { selectedSymptoms.add(s); chip.classList.add('selected'); }
      });
    });

    this.renderRecordList(document.getElementById('period-list'));

    document.getElementById('add-period-btn').addEventListener('click', () => {
      const startDate = document.getElementById('period-start').value;
      const endDate = document.getElementById('period-end').value;
      if (!startDate) return;
      this.addRecord(startDate, endDate, [...selectedSymptoms]);
      this.renderRecordList(document.getElementById('period-list'));
      document.getElementById('period-start').value = '';
      document.getElementById('period-end').value = '';
      selectedSymptoms.clear();
      formEl.querySelectorAll('.symptom-chip').forEach(c => c.classList.remove('selected'));
    });
  },

  renderRecordList(el) {
    this.load();
    el.innerHTML = this.records.length === 0
      ? '<div style="color:var(--text-sub);font-size:0.85rem;">还没有记录~</div>'
      : this.records.slice().reverse().map((r, i) => `
        <div style="font-size:0.85rem;padding:6px 0;border-bottom:1px solid #f0ebe0;display:flex;justify-content:space-between;align-items:center;">
          <span>📅 ${r.startDate}${r.endDate ? ' → ' + r.endDate : ''} ${r.symptoms.length > 0 ? '· ' + r.symptoms.join(',') : ''}</span>
          <button onclick="Period.removeRecord(${this.records.length - 1 - i});Period.renderRecordList(document.getElementById('period-list'))" style="background:none;border:none;color:var(--accent);cursor:pointer;font-size:0.8rem;">删除</button>
        </div>
      `).join('');
  },
};
