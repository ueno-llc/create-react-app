import axios from 'axios';
import config from 'config';

export default class Planets {
  apiUrl = config.PLANETS_API_URL;

  cache = new Map();

  fetch(url) {
    if (this.cache.has(url)) {
      return Promise.resolve(this.cache.get(url));
    }

    return axios.get(url).then(res => {
      const { data } = res;
      this.cache.set(url, data);
      return data;
    });
  }

  fetchAll({ page = 1 } = {}) {
    return this.fetch(`${this.apiUrl}/?page=${page}`);
  }

  fetchById(id) {
    return this.fetch(`${this.apiUrl}/${id}/`);
  }
}
