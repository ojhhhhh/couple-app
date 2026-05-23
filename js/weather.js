const Weather = {
  API_HOST: 'https://nu5rk7gkwm.re.qweatherapi.com',
  API_KEY: '4604d93926f34361838e63bc41aff03e',
  LOCATION_ID: '101220307',  // 芜湖

  cache: null,
  cacheTime: 0,
  CACHE_DURATION: 30 * 60 * 1000,

  async fetch() {
    const now = Date.now();
    if (this.cache && (now - this.cacheTime) < this.CACHE_DURATION) {
      return this.cache;
    }

    try {
      const resp = await fetch(
        `${this.API_HOST}/v7/weather/now?location=${this.LOCATION_ID}&key=${this.API_KEY}`
      );
      const data = await resp.json();

      if (data.code !== '200') throw new Error(data.code);

      this.cache = {
        temp: data.now.temp,
        feelsLike: data.now.feelsLike,
        text: data.now.text,
        windDir: data.now.windDir,
        windScale: data.now.windScale,
        humidity: data.now.humidity,
        icon: data.now.icon,
        updated: new Date()
      };
      this.cacheTime = now;
      return this.cache;
    } catch (e) {
      console.warn('天气获取失败:', e);
      return this.cache || null;
    }
  },

  getWeatherIcon(code) {
    const map = {
      '100': '☀️', '101': '🌤', '102': '⛅', '103': '☁️',
      '104': '☁️',
      '300': '🌦', '301': '🌦', '302': '🌧', '303': '⛈',
      '304': '⛈', '305': '🌧', '306': '🌧', '307': '🌧',
      '308': '🌧', '309': '🌧', '310': '🌧', '311': '🌧',
      '312': '🌧', '313': '🌧', '314': '🌧', '315': '🌧',
      '316': '🌧', '317': '🌧',
      '400': '🌨', '401': '🌨', '402': '🌨', '403': '🌨',
      '404': '🌧', '405': '🌧', '406': '🌧', '407': '🌧',
      '500': '🌫', '501': '🌫', '502': '🌫',
      '503': '🌪', '504': '🌪',
      '507': '🌪', '508': '🌪'
    };
    return map[code] || '🌈';
  },

  getTip(weather) {
    if (!weather) return '';
    const code = parseInt(weather.icon);
    const temp = parseInt(weather.temp);

    const tips = [];
    if (code >= 300 && code < 400) tips.push('今天有雨哦，记得带伞~');
    if (code >= 400 && code < 500) tips.push('外面下雨啦，出门小心路滑~');
    if (temp < 10) tips.push('好冷呀，多穿点别感冒了！');
    if (temp < 5) tips.push('好冷好冷，围巾手套都带上！');
    if (temp > 30) tips.push('太阳好大，记得涂防晒霜~');
    if (temp > 35) tips.push('超级热！多喝水，小心中暑~');
    if (parseInt(weather.windScale) >= 5) tips.push('风好大，穿裙子要小心哦~');
    if (parseInt(weather.humidity) > 85) tips.push('湿度有点高，头发会炸毛哦~');

    if (tips.length === 0) {
      if (code === 100) tips.push('天气晴好，心情也要棒棒的~');
      else if (code <= 103) tips.push('还不错的天气呢，出去走走吧~');
      else tips.push('无论什么天气，你都是最可爱的~');
    }

    return tips[Math.floor(Math.random() * tips.length)];
  }
};
