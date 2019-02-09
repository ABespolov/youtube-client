class Client {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.nextPage = '';
    this.searchText = '';
  }

  static request(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          const error = new Error(xhr.statusText);
          error.code = xhr.status;
          reject(error);
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network Error'));
      };

      xhr.send();
    });
  }

  getVideosData(searchText, count = 2) {
    const that = this;
    this.searchText = searchText || this.searchText;
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?pageToken=${that.nextPage}&key=${that.apiKey}&type=video&part=snippet&maxResults=${count}&q=${that.searchText}`;
    return this.constructor.request(searchUrl).then((result) => {
      const response = JSON.parse(result);
      this.nextPage = response.nextPageToken;
      return response.items;
    }).then((result) => {
      const promiseArr = [];
      for (let i = 0; i < result.length; i += 1) {
        const videoDataUrl = `https://www.googleapis.com/youtube/v3/videos?key=AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y&id=${result[i].id.videoId}&part=snippet,statistics`;
        promiseArr.push(this.constructor.request(videoDataUrl));
      }
      return Promise.all(promiseArr)
        .then(values => values.map(element => JSON.parse(element)));
    }).catch((err) => {
      return new Error('Ничего не найдено...');
    });
  }
}

export default Client;