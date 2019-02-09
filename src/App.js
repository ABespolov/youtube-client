import Client from './Client';
import Render from './Render';

const VIDEOS_PER_PAGE = 4;
const START_PAGE = 1;
const PRELOAD_PAGES = 2;
const SLIDER_SWIPE = 1280;

class App {
  constructor(apiKey) {

    this.client = new Client(apiKey);
    this.render = new Render(this);
    this.finishRender = true;
    this.currentPage = START_PAGE;
    this.currentPosition = 0;
    this.allPages = VIDEOS_PER_PAGE - 1;
    this.videosCount = VIDEOS_PER_PAGE;
  }

  start() {
    this.render.init();
    this.button = document.querySelector('#load');
    this.searchInput = document.querySelector('#search');
    this.addListeners();
  }

  reload() {
    this.client.nextPage = '';
    Render.reload();
    this.currentPage = START_PAGE;
    this.currentPosition = 0;
    this.allPages = VIDEOS_PER_PAGE - 1;
    this.videosCount = VIDEOS_PER_PAGE;

    const wrapper = document.querySelector('#videoListWrapper');
    wrapper.style.transform = 'translate(0px)';
  }

  loadVideos(searchText) {
    this.finishRender = false;
    this.client.getVideosData(searchText, this.videosCount)
      .then((result) => {
        this.render.renderNewVideos(result);
        return this.client.getVideosData(searchText, this.videosCount);
      }).then((result) => {
        this.render.renderNewVideos(result);
        return this.client.getVideosData(searchText, this.videosCount);
      }).then((result) => {
        this.render.renderNewVideos(result);
        this.finishRender = true;
      });
  }

  search() {
    this.reload();
    if (this.finishRender) {
      this.loadVideos(this.searchInput.value);
    }
    this.render.addPagination();
  }

  addListeners() {
    this.searchInput.addEventListener('keypress', this.search.bind(this));
  }

  pagination(e) {
    const wrapper = document.querySelector('#videoListWrapper');
    const page = e.target.id.match(/\d+/)[0];
    const position = (this.currentPage - page) * SLIDER_SWIPE;
    const newPosition = this.currentPosition + position;
    const pageBubbles = document.querySelectorAll('.pageBubble');

    pageBubbles.forEach(element => element.classList.remove('select'));
    e.target.classList.add('select');

    this.currentPosition = newPosition;
    wrapper.style.transform = `translate(${newPosition}px)`;
    this.currentPage = page;
    if (this.allPages - this.currentPage < PRELOAD_PAGES) {
      this.loadVideos();
      this.allPages += VIDEOS_PER_PAGE - 1;
      this.render.addPagination();      
    }
  }
}

const apiKey = 'AIzaSyClGey1KJwPPSpTLAnVlsEuDjLp4t4uAKM';
const app = new App(apiKey);
app.start();
