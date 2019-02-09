class Render {
  constructor(app) {
    this.app = app;
  }

  init() {
    this.constructor.addElement('input', 'body', '', ['id', 'search'], ['placeholder', 'Search']);
    this.constructor.addElement('div', 'body', '', ['id', 'videoListWrapper']);
    this.constructor.addElement('div', 'body', '', ['id', 'paginationWrapper']);
  }

  addPagination() {
    let select = '';
    for (let i = this.app.allPages - 3; i < this.app.allPages; i += 1) {
      if (i === 0) {
        select = 'select';
      } else {
        select = '';
      }

      this.constructor.addElement('div', '#paginationWrapper', i + 1, ['id', `pageBubble#${i + 1}`], ['class', `pageBubble ${select}`])
        .addEventListener('click', this.app.pagination.bind(this.app));
    }
  }

  static reload() {
    document.querySelector('#videoListWrapper').innerHTML = '';
    document.querySelector('#paginationWrapper').innerHTML = '';
  }

  static addElement(name, parent = 'body', innerHTML = '', ...attributes) {
    const element = document.createElement(name);
    element.innerHTML = innerHTML;
    [...attributes].forEach(item => element.setAttribute(item[0], item[1]));
    if (parent) {
      document.querySelector(parent).appendChild(element);
    }
    return element;
  }

  renderNewVideos(videos) {
    if (videos.message) {
      document.querySelector('#error').innerHTML = videos.message;
    } else {
      document.querySelector('#error').innerHTML = '';
      this.constructor.addElement('div', '#videoListWrapper', '', ['class', 'videoList']);
      videos.forEach((element) => {
        const videoContainer = this.constructor.addElement('div', '#videoListWrapper .videoList:last-child', '', ['class', 'video']);
        videoContainer.onclick = () => {
          window.open(`https://www.youtube.com/watch?v=${element.items[0].id}`, "_blank");
        }
        videoContainer.appendChild(this.constructor.addElement('li', '', element.items[0].snippet.localized.title, ['class', 'title']));
        videoContainer.appendChild(this.constructor.addElement('img', '', '', ['src', element.items[0].snippet.thumbnails.high.url]));
        videoContainer.appendChild(this.constructor.addElement('i', '', '', ['class', 'fa fa-thumbs-o-up']));
        videoContainer.appendChild(this.constructor.addElement('span', 'i', element.items[0].statistics.likeCount));
        videoContainer.appendChild(this.constructor.addElement('i', '', '', ['class', 'fa fa-thumbs-o-down']));
        videoContainer.appendChild(this.constructor.addElement('span', 'i', element.items[0].statistics.dislikeCount));
        videoContainer.appendChild(this.constructor.addElement('i', '', '', ['class', 'fa fa-eye']));
        videoContainer.appendChild(this.constructor.addElement('span', 'i', element.items[0].statistics.viewCount));
      });
      return true;
    }
  }

}

export default Render;