const Greeting = {
  getPeriod() {
    const h = new Date().getHours();
    if (h >= 6 && h < 9) return 'morning';
    if (h >= 9 && h < 17) return 'day';
    if (h >= 17 && h < 21) return 'evening';
    if (h >= 21 || h < 6) return 'night';
  },

  getGreeting() {
    const p = this.getPeriod();
    const pools = {
      morning: [
        '早安呀，今天也要元气满满！🐾',
        '太阳晒屁股啦，快起床~',
        '新的一天，新的小确幸✨',
        '早上好！你今天的笑容已上线~',
      ],
      day: [
        '下午也加油，累了就摸摸小狗~',
        '喝口水吧，你超棒的！',
        '午后的阳光和你一样温柔☀️',
        '学累了就休息一下，陪我玩会儿~',
      ],
      evening: [
        '辛苦啦！今天你真了不起🌙',
        '晚饭吃饱了吗？别饿着自己~',
        '晚霞很温柔，你也是呀',
        '一天又过去了，离梦想更近了一步~',
      ],
      night: [
        '晚安，做个草莓味的梦🍓',
        '该睡啦！不许偷偷熬夜！',
        '星星和月亮都陪你入眠✨',
        '明天又是闪闪发光的一天，先睡吧~',
      ]
    };
    const msgs = pools[p] || pools.day;
    return msgs[Math.floor(Math.random() * msgs.length)];
  },

  isLate() {
    const h = new Date().getHours();
    return h >= 23 || h < 6;
  },

  getHeroClass() {
    const p = this.getPeriod();
    const map = {
      morning: 'hero-morning',
      day: 'hero-day',
      evening: 'hero-evening',
      night: this.isLate() ? 'hero-late' : 'hero-night'
    };
    return map[p];
  },

  update(el, heroEl) {
    el.textContent = this.getGreeting();
    heroEl.className = `card ${this.getHeroClass()}`;
  }
};
