const Notify = {
  _timer1: null,
  _timer2: null,

  /** Pick a random minute between [minHour, maxHour) */
  _randomMinute(minHour, maxHour) {
    const h = minHour + Math.floor(Math.random() * (maxHour - minHour));
    const m = Math.floor(Math.random() * 60);
    return { h, m };
  },

  /** Build notification message from all app data */
  _buildMessage() {
    const parts = [];

    // Weather
    const weatherCache = Weather.cache;
    if (weatherCache) {
      const code = parseInt(weatherCache.icon);
      if (code >= 300 && code < 500) parts.push('今天有雨🌧，记得带伞');
      else if (code === 100) parts.push('天气晴好☀️');
      if (weatherCache.temp < 10) parts.push('外面冷，多穿点🧣');
      else if (weatherCache.temp > 30) parts.push('天热记得多喝水💧');
    }

    // Schedule
    const todayCourses = Schedule.getToday();
    if (todayCourses.length >= 4) parts.push(`今天${todayCourses.length}节课，加油📚`);
    else if (todayCourses.length > 0) parts.push(`今天${todayCourses.length}节课，还算轻松~`);
    else parts.push('今天没课，好好享受🌿');

    // Period
    Period.load();
    const status = Period.getStatus();
    if (status.phase === 'during') parts.push('生理期注意保暖🌸');
    else if (status.phase === 'upcoming') parts.push('生理期快到了，提前准备~');

    // Exams
    Exam.load();
    if (Exam.exams.length > 0) {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const nearest = Exam.exams[0];
      const d = Math.ceil((new Date(nearest.examDate) - today) / 86400000);
      if (d <= 7 && d >= 0) parts.push(`离「${nearest.subject}」考试还有${d}天！`);
      else if (d > 0 && d <= 30) parts.push(`「${nearest.subject}」考试还有${d}天`);
    }

    // Diary mood
    const diary = Storage.getDiary();
    if (diary.length > 0) {
      const lastMood = diary[0].mood;
      if (lastMood === 'sad') parts.push('心情不好的话，摸摸小狗吧~🐾');
    }

    if (parts.length === 0) parts.push('今天也要元气满满哦~ 汪！');
    return parts.join(' · ');
  },

  /** Show a DOM toast + try browser notification */
  _show(message) {
    const toast = document.getElementById('notify-toast');
    if (!toast) return;
    toast.textContent = '🔔 ' + message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 8000);

    // Browser Notification API
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('线条小狗提醒', { body: message, icon: 'icon-192.png' });
    }
  },

  /** Schedule today's two notifications */
  schedule() {
    const today = new Date().toDateString();
    const stored = Storage.getNotify();

    // Already notified today
    if (stored && stored.date === today && stored.count >= 2) return;

    const count = (stored && stored.date === today) ? stored.count : 0;

    // Request notification permission once
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();

    if (count === 0) {
      // First notification: morning 8:00-12:00
      const { h, m } = this._randomMinute(8, 12);
      const targetMin = h * 60 + m;
      let delay = (targetMin - nowMin) * 60000;
      if (delay < 0) delay = 0; // fire immediately if past the window

      this._timer1 = setTimeout(() => {
        this._show(this._buildMessage());
        Storage.setNotify({ date: today, count: 1 });
        // Schedule second
        this._scheduleSecond(today);
      }, delay);
    }

    if (count < 2) {
      this._scheduleSecond(today);
    }
  },

  _scheduleSecond(today) {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const { h, m } = this._randomMinute(14, 21);
    const targetMin = h * 60 + m;
    let delay = (targetMin - nowMin) * 60000;
    if (delay < 300000) delay = 300000; // at least 5 min from now

    this._timer2 = setTimeout(() => {
      this._show(this._buildMessage());
      const stored = Storage.getNotify();
      Storage.setNotify({ date: today, count: (stored ? stored.count : 0) + 1 });
    }, delay);
  },

  checkAndShow() {
    const today = new Date().toDateString();
    const stored = Storage.getNotify();
    if (!stored || stored.date !== today) {
      Storage.setNotify({ date: today, count: 0 });
    }
    this.schedule();
  },
};
