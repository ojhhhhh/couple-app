const App = {
  async init() {
    Schedule.load();
    Period.load();
    Exam.load();

    this.updateGreeting();
    await this.updateWeather();
    this.updateMessage();
    this.updateSchedule();
    this.updatePeriod();
    this.updateFortune();
    this.updateExam();
    this.updateDiary();
    this.updatePhotos();
    this.updateSOS();

    Puppy.init();

    // Smart notifications (after all data is loaded)
    Notify.checkAndShow();

    this.bindSettingsModal();

    this.startTimers();
  },

  async updateGreeting() {
    const el = document.getElementById('greeting-text');
    const hero = document.getElementById('hero');
    Greeting.update(el, hero);

    if (Greeting.isLate()) {
      const msgEl = document.getElementById('warm-message');
      msgEl.textContent = '🌙 夜深了，该睡觉啦！明天还要美美的呢~';
    }
  },

  async updateWeather() {
    const el = document.getElementById('weather-card');
    const data = await Weather.fetch();
    if (data) {
      const icon = Weather.getWeatherIcon(data.icon);
      const tip = Weather.getTip(data);
      el.innerHTML = `
        <span>📍 芜湖湾沚</span>
        <span>${icon} ${data.text} ${data.temp}°C</span>
        <span>💧 ${data.humidity}%</span>
        <span>💨 ${data.windScale}级</span>
        ${tip ? `<div class="weather-tip">${tip}</div>` : ''}
      `;
    } else {
      el.innerHTML = '<span>🌈 天气加载中...</span>';
    }
  },

  updateMessage() {
    const el = document.getElementById('warm-message');
    const todayCourses = Schedule.getToday().length;
    Weather.fetch().then(data => {
      Messages.update(el, data, todayCourses);
    }).catch(() => {
      Messages.update(el, null, todayCourses);
    });

    document.getElementById('refresh-message').onclick = () => {
      this.updateMessage();
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = 'fadeIn 0.4s ease';
    };
  },

  updateSchedule() {
    const el = document.getElementById('today-schedule');
    const countdownEl = document.getElementById('next-class-countdown');
    Schedule.render(el, countdownEl);
  },

  updatePeriod() {
    const el = document.getElementById('period-status');
    Period.render(el);
  },

  updateFortune() {
    const el = document.getElementById('fortune-display');
    Fortune.render(el);
  },

  updateExam() {
    const el = document.getElementById('exam-display');
    Exam.render(el);
  },

  updateDiary() {
    const el = document.getElementById('diary-display');
    Diary.render(el);
  },

  updatePhotos() {
    const el = document.getElementById('photo-display');
    Photos.render(el);
  },

  updateSOS() {
    SOS.render();
  },

  bindSettingsModal() {
    const modal = document.getElementById('settings-modal');
    const formEl = document.getElementById('settings-form');

    document.getElementById('open-settings').addEventListener('click', () => {
      modal.classList.remove('hidden');
      this.renderSettings(formEl);
    });

    document.getElementById('close-settings').addEventListener('click', () => {
      modal.classList.add('hidden');
      this.refreshAll();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        this.refreshAll();
      }
    });
  },

  refreshAll() {
    this.updateSchedule();
    this.updatePeriod();
    this.updateExam();
    this.updateDiary();
    this.updatePhotos();
    this.updateSOS();
  },

  renderSettings(formEl) {
    const tabs = document.getElementById('settings-tabs');
    const tabDefs = [
      { id: 'tab-course', label: '📚 课程', render: () => this._renderCourseSettings(formEl) },
      { id: 'tab-period', label: '🌸 生理', render: () => this._renderPeriodSettings(formEl) },
      { id: 'tab-exam', label: '📝 考试', render: () => this._renderExamSettings(formEl) },
      { id: 'tab-diary', label: '📔 日记', render: () => this._renderDiarySettings(formEl) },
      { id: 'tab-sos', label: '🆘 SOS', render: () => this._renderSOSSettings(formEl) },
    ];

    tabs.innerHTML = tabDefs.map((t, i) =>
      `<button class="settings-tab${i === 0 ? ' active' : ''}" data-tab="${t.id}">${t.label}</button>`
    ).join('');

    // Default: show course tab
    this._renderCourseSettings(formEl);

    tabs.querySelectorAll('.settings-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const def = tabDefs.find(d => d.id === tab.dataset.tab);
        if (def) def.render();
      });
    });
  },

  _renderCourseSettings(formEl) {
    formEl.innerHTML = '';
    const periodDiv = document.createElement('div');
    const scheduleDiv = document.createElement('div');
    formEl.appendChild(scheduleDiv);
    Schedule.renderSettingsForm(scheduleDiv);
  },

  _renderPeriodSettings(formEl) {
    formEl.innerHTML = '';
    Period.renderSettingsForm(formEl);
  },

  _renderExamSettings(formEl) {
    formEl.innerHTML = '';
    Exam.renderSettingsForm(formEl);
  },

  _renderDiarySettings(formEl) {
    formEl.innerHTML = '';
    formEl.innerHTML = `
      <div class="settings-section">
        <h3>📔 心情日记</h3>
        <p style="font-size:0.85rem;color:var(--text-sub);">日记在主页面直接编写，这里可以查看所有历史日记。</p>
        <div id="all-diary-list"></div>
      </div>
    `;
    const listEl = document.getElementById('all-diary-list');
    Diary.load();
    if (Diary.entries.length === 0) {
      listEl.innerHTML = '<div style="color:var(--text-sub);font-size:0.85rem;">还没有日记~</div>';
    } else {
      listEl.innerHTML = Diary.entries.map((e, i) => {
        const d = new Date(e.createTime);
        return `
          <div style="padding:8px 0;border-bottom:1px solid #f0ebe0;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:0.85rem;">${Diary._moodEmoji(e.mood)} ${e.content.slice(0, 30)}...</span>
            <span style="font-size:0.75rem;color:var(--text-sub);">${d.getMonth()+1}/${d.getDate()}</span>
            <button onclick="Diary.removeEntry(${e.id});App._renderDiarySettings(document.getElementById('settings-form'))" style="background:none;border:none;color:var(--accent);cursor:pointer;font-size:0.8rem;">删除</button>
          </div>`;
      }).join('');
    }
  },

  _renderSOSSettings(formEl) {
    formEl.innerHTML = '';
    SOS.renderSettingsForm(formEl);
  },

  startTimers() {
    setInterval(() => {
      this.updateGreeting();
      this.updateSchedule();
    }, 60000);

    setInterval(() => {
      this.updateWeather();
    }, 30 * 60 * 1000);

    const now = new Date();
    const msToMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    setTimeout(() => {
      this.updateFortune();
      this.updateGreeting();
      setInterval(() => {
        this.updateFortune();
        this.updateGreeting();
      }, 24 * 60 * 60 * 1000);
    }, msToMidnight + 1000);
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
