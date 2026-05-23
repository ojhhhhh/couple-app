const Storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch { return false; }
  },

  getSchedule() {
    return this.get('puppy_schedule', []);
  },

  setSchedule(courses) {
    return this.set('puppy_schedule', courses);
  },

  getPeriods() {
    return this.get('puppy_periods', []);
  },

  setPeriods(records) {
    return this.set('puppy_periods', records);
  },

  getFortune() {
    return this.get('puppy_fortune', null);
  },

  setFortune(data) {
    return this.set('puppy_fortune', data);
  },

  getSettings() {
    return this.get('puppy_settings', {});
  },

  setSettings(settings) {
    return this.set('puppy_settings', settings);
  },

  getExams() {
    return this.get('puppy_exams', []);
  },

  setExams(exams) {
    return this.set('puppy_exams', exams);
  },

  getDiary() {
    return this.get('puppy_diary', []);
  },

  setDiary(entries) {
    return this.set('puppy_diary', entries);
  },

  getPhotos() {
    return this.get('puppy_photos', []);
  },

  setPhotos(photos) {
    return this.set('puppy_photos', photos);
  },

  getNotify() {
    return this.get('puppy_notify', null);
  },

  setNotify(data) {
    return this.set('puppy_notify', data);
  },

  getStorageUsed() {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('puppy_')) {
        total += (localStorage.getItem(key) || '').length;
      }
    }
    return Math.round(total / 1024);
  }
};
