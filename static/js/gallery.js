const imageContainer = document.querySelector('.image-container');
const leftButton = document.querySelector('.carousel-left');
const rightButton = document.querySelector('.carousel-right');
const leftButtonSmall = document.querySelector('.carousel-left-small');
const rightButtonSmall = document.querySelector('.carousel-right-small');
const images = document.querySelectorAll('.carousel-image');
const indicatorsContainer = document.querySelector('.carousel-indicators');

let track = 0;
let counter = 1;
const totalSlides = imageContainer.childElementCount;
let autoSlideInterval;

function createIndicators() {
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('span');
        indicator.className = 'carousel-indicator';
        indicator.dataset.index = i + 1;
        if (i === 0) indicator.classList.add('active');
        indicatorsContainer.appendChild(indicator);
    }
}

function updateIndicators() {
    const indicators = document.querySelectorAll('.carousel-indicator');
    indicators.forEach(indicator => {
        indicator.classList.toggle('active', parseInt(indicator.dataset.index) === counter);
    });
}

const moveImagesLeft = function () {
    if (counter < totalSlides) counter++;
    else counter = 1; 
    track = -(counter - 1) * 100;
    imageContainer.style.marginLeft = `${track}%`;
    updateIndicators();
};

const moveImagesRight = function () {
    if (counter > 1) counter--;
    else counter = totalSlides; 
    track = -(counter - 1) * 100;
    imageContainer.style.marginLeft = `${track}%`;
    updateIndicators();
};

const goToSlide = function (index) {
    counter = index;
    track = -(index - 1) * 100;
    imageContainer.style.marginLeft = `${track}%`;
    updateIndicators();
};

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        moveImagesLeft();
    }, 3000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

[rightButton, rightButtonSmall].forEach(button => {
    button.addEventListener('click', () => {
        stopAutoSlide();
        moveImagesLeft();
        startAutoSlide();
    });
});

[leftButton, leftButtonSmall].forEach(button => {
    button.addEventListener('click', () => {
        stopAutoSlide();
        moveImagesRight();
        startAutoSlide();
    });
});

indicatorsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('carousel-indicator')) {
        stopAutoSlide();
        goToSlide(parseInt(e.target.dataset.index));
        startAutoSlide();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        stopAutoSlide();
        if (e.shiftKey) moveImagesRight();
        else moveImagesLeft();
        startAutoSlide();
    }
});

images.forEach(image => {
    image.addEventListener('mouseover', () => {
        image.classList.add('hover-scale');
    });
    image.addEventListener('mouseout', () => {
        image.classList.remove('hover-scale');
    });
});

images.forEach(image => {
    const src = image.getAttribute('data-src');
    if (src) image.src = src;
});

createIndicators();
startAutoSlide();