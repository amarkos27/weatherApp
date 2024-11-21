import 'normalize.css';
import './style.css';

const content = document.querySelector('.content');
document.getElementById('ten-day').addEventListener('click', movePage);
document.getElementById('return').addEventListener('click', movePage);

function movePage() {
  content.classList.toggle('pageTwo');
}
