const DEFAULT_COURSES = [
  { day: 1, name: '企业财务诊断模拟实训', period: '1-4节', time: '08:30-12:00', room: '' },
  { day: 1, name: '财务分析', period: '5-6节', time: '14:30-15:35', room: '' },
  { day: 2, name: '企业财务诊断模拟实训', period: '1-4节', time: '08:30-12:00', room: '' },
  { day: 2, name: 'Office高级应用', period: '5-6节', time: '14:30-15:35', room: '' },
  { day: 2, name: '习近平新时代中国特色社会主义思想概论', period: '7-8节', time: '15:55-17:30', room: '' },
  { day: 3, name: '高级财务管理', period: '1-2节', time: '08:30-10:05', room: '' },
  { day: 3, name: '财务分析', period: '3-4节', time: '10:25-12:00', room: '' },
  { day: 4, name: '金融学', period: '5-6节', time: '14:30-15:35', room: '' },
  { day: 4, name: '证券投资学', period: '7-8节', time: '15:55-17:30', room: '' },
  { day: 4, name: '电影中的科技史', period: '9-10节', time: '19:00-20:40', room: '' },
  { day: 5, name: '高级财务管理', period: '1-2节', time: '08:30-10:05', room: '' },
];

const PERIOD_TIME_MAP = {
  '1-2节':  '08:30-10:05',
  '3-4节':  '10:25-12:00',
  '1-4节':  '08:30-12:00',
  '5-6节':  '14:30-15:35',
  '7-8节':  '15:55-17:30',
  '9-10节': '19:00-20:40',
};

const Schedule = {
  courses: [],

  DAY_NAMES: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],

  // --- helpers ---

  // Parse a time string like "08:30-12:00" into start-minutes since midnight.
  _parseStartTime(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return null;
    const dashIdx = timeStr.indexOf('-');
    if (dashIdx === -1) return null;
    const start = timeStr.slice(0, dashIdx);
    const parts = start.split(':');
    if (parts.length !== 2) return null;
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  },

  // --- persistence ---

  load() {
    const stored = Storage.getSchedule();
    if (stored && stored.length > 0) {
      this.courses = stored;
    } else {
      // First load: seed with default courses (each gets a unique id).
      this.courses = DEFAULT_COURSES.map((c, i) => ({
        ...c,
        id: Date.now() + i,
      }));
      this.save();
    }
  },

  save() {
    Storage.setSchedule(this.courses);
  },

  // --- day / time helpers ---

  // Map JS getDay() (0=Sun, 1-6=Mon-Sat) to user day (1=Mon...7=Sun).
  _jsDayToUserDay(jsDay) {
    return jsDay === 0 ? 7 : jsDay;
  },

  // Return today's courses sorted by start time.
  getToday() {
    const userDay = this._jsDayToUserDay(new Date().getDay());
    return this.courses
      .filter(c => c.day === userDay)
      .sort((a, b) => {
        const aStart = this._parseStartTime(a.time) || Infinity;
        const bStart = this._parseStartTime(b.time) || Infinity;
        return aStart - bStart;
      });
  },

  // Return the next class that hasn't started yet, or null.
  getNextClass() {
    const today = this.getToday();
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    for (const c of today) {
      const startMinutes = this._parseStartTime(c.time);
      if (startMinutes !== null && nowMinutes < startMinutes) return c;
    }
    return null;
  },

  // --- CRUD ---

  addCourse(course) {
    this.courses.push({
      id: Date.now(),
      name: course.name || '',
      day: parseInt(course.day, 10) || 1,
      period: course.period || '',
      time: course.time || '',
      room: course.room || '',
    });
    this.save();
  },

  removeCourse(id) {
    this.courses = this.courses.filter(c => c.id !== id);
    this.save();
  },

  // --- rendering ---

  render(el, countdownEl) {
    const today = this.getToday();

    if (today.length === 0) {
      el.innerHTML = '<div class="no-course">今天没有课哦，好好休息~ 🐾</div>';
      if (countdownEl) countdownEl.innerHTML = '';
      return;
    }

    const nextClass = this.getNextClass();
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    el.innerHTML = today.map(c => {
      const active = c === nextClass;
      return `
        <div class="course-item${active ? ' active' : ''}">
          <div>
            <div class="course-name">${c.name}</div>
            <div class="course-info">${c.room || ''} · ${c.period}</div>
          </div>
          <div class="course-time">${c.time}</div>
        </div>
      `;
    }).join('');

    if (countdownEl) {
      if (nextClass) {
        const startMinutes = this._parseStartTime(nextClass.time);
        const remain = startMinutes - nowMinutes;
        if (remain > 0 && remain <= 60) {
          countdownEl.innerHTML = `<div style="text-align:center;color:var(--accent);font-size:0.85rem;">⏰ 下一节「${nextClass.name}」还有 ${remain} 分钟</div>`;
        } else if (remain > 60) {
          const h = Math.floor(remain / 60);
          const m = remain % 60;
          countdownEl.innerHTML = `<div style="text-align:center;color:var(--text-sub);font-size:0.85rem;">下一节「${nextClass.name}」${h}小时${m}分钟后</div>`;
        } else {
          countdownEl.innerHTML = `<div style="text-align:center;color:var(--accent);font-size:0.85rem;">🔔 「${nextClass.name}」马上开始啦！</div>`;
        }
      } else {
        countdownEl.innerHTML = '<div style="text-align:center;color:var(--text-sub);font-size:0.85rem;">今天的课都上完啦，真棒~ 🎉</div>';
      }
    }
  },

  renderSettingsForm(formEl) {
    formEl.innerHTML = `
      <div class="settings-section">
        <h3>📚 课程管理</h3>
        <div class="settings-row">
          <input id="course-name" placeholder="课程名称" style="flex:2">
          <input id="course-room" placeholder="教室" style="flex:1">
        </div>
        <div class="settings-row">
          <select id="course-day">
            <option value="1">周一</option><option value="2">周二</option>
            <option value="3">周三</option><option value="4">周四</option>
            <option value="5">周五</option><option value="6">周六</option>
            <option value="7">周日</option>
          </select>
          <select id="course-period">
            <option value="1-2节">1-2节 08:30-10:05</option>
            <option value="3-4节">3-4节 10:25-12:00</option>
            <option value="1-4节">1-4节 08:30-12:00</option>
            <option value="5-6节">5-6节 14:30-15:35</option>
            <option value="7-8节">7-8节 15:55-17:30</option>
            <option value="9-10节">9-10节 19:00-20:40</option>
          </select>
          <button id="add-course-btn">+ 添加</button>
        </div>
        <div id="course-list" style="margin-top:10px;"></div>
      </div>
    `;

    this.renderCourseList(document.getElementById('course-list'));

    document.getElementById('add-course-btn').addEventListener('click', () => {
      const name = document.getElementById('course-name').value.trim();
      const room = document.getElementById('course-room').value.trim();
      const day = document.getElementById('course-day').value;
      const period = document.getElementById('course-period').value;
      if (!name) return;
      const time = PERIOD_TIME_MAP[period] || '';
      this.addCourse({ name, room, day, period, time });
      this.renderCourseList(document.getElementById('course-list'));
      document.getElementById('course-name').value = '';
      document.getElementById('course-room').value = '';
    });
  },

  renderCourseList(el) {
    this.load();
    el.innerHTML = this.courses.length === 0
      ? '<div style="color:var(--text-sub);font-size:0.85rem;">还没有添加课程~</div>'
      : this.courses.map(c => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:0.85rem;border-bottom:1px solid #f0ebe0;">
          <span>${this.DAY_NAMES[c.day]} ${c.period} ${c.name} ${c.room}</span>
          <button onclick="Schedule.removeCourse(${c.id});Schedule.renderCourseList(document.getElementById('course-list'))" style="background:none;border:none;color:var(--accent);cursor:pointer;">删除</button>
        </div>
      `).join('');
  }
};
