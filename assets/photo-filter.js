const filters = document.querySelector('.filters');
const imageSwitcher = changeImageName();
const canvas = document.querySelector('canvas');
document.querySelector('input[type="file"]').addEventListener('change', (event) => loadImage(event.target));

filters.addEventListener('input', (event) => filtersInputHandler(event.target));

document.querySelector('.fullscreen').addEventListener('click', function () {
  this.requestFullscreen && document.body.requestFullscreen();
  document.exitFullscreen && document.exitFullscreen();
});

document.querySelector('.btn-container').addEventListener('click', (event) => {
  const button = event.target;
  switch (true) {
    case button.className.includes('reset'): resetFilters();
      break;
    case button.className.includes('next'): loadNextImage();
      break;
    case button.className.includes('save'): downloadImage();
      break;
      default: break;
  }
});

function filtersInputHandler(input) {
  const root = document.documentElement;
  input.nextElementSibling.textContent = input.value;
  root.style.setProperty(`--${input.name}`, `${input.value}${input.dataset.sizing}`);
}

function resetFilters() {
  filters.querySelectorAll('input').forEach((input) => {
    input.value = input.name === 'saturate' ? 100 : 0;
    filtersInputHandler(input);
  });
}

function loadNextImage() {
  const image = document.querySelector('img');
  const base = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/';
  const newImage = new Image();
  newImage.src = base + imageSwitcher();  
  changeImage(image, newImage);
  return;
}

function changeImage(image, newImage) {
  newImage.onload = () => {
    image.src = newImage.src; 
  };  
  return;
}

function changeImageName() {
  let imageNumber = 0;
  return function () {
    if (imageNumber < 20) imageNumber++;
    else imageNumber = 1;
    return nameDaytime(new Date().getHours()) + `/${('0' + imageNumber).slice(-2)}.jpg`;
  };
}

function nameDaytime(hour) {
  switch (true) {
    case hour < 6: return 'night';
    case hour < 12: return 'morning';
    case hour < 18: return 'day';
    default: return 'evening';
  }
}

function loadImage(input) {
  let file = input.files[0];
  const image = document.querySelector('.editor').querySelector('img');
  const reader = new FileReader();
  const newImage = new Image();
  reader.onload = () => {
    newImage.src = reader.result;
    changeImage(image, newImage);
    input.value = '';
  };
  reader.readAsDataURL(file);
  return;
}

function downloadImage() {
  const ctx = canvas.getContext('2d');
  const image = document.querySelector('.editor').querySelector('img');
  const link = document.createElement('a');
  const blurCoef = Math.max(image.naturalHeight / 433, image.naturalWidth / 830);
  let appliedFilters = getComputedStyle(image).filter.split(' ');
  let blur = parseInt(appliedFilters[0].substr(5));
  appliedFilters[0] = `blur(${blur * blurCoef}px)`;
  appliedFilters = appliedFilters.join(' ');
  image.setAttribute('crossOrigin', 'anonymous');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  ctx.filter = appliedFilters;
  ctx.drawImage(image, 0, 0);
  
  link.download = 'download.png';
  link.href = canvas.toDataURL();
  link.click();
  link.delete;
  return;
}