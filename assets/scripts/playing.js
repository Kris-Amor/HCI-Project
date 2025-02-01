let objectCount = 0;
let score = 0;
let creationInterval;
let currentInterval = 1800;
const scoreContainer = document.querySelector('.score-container');
const objectContainer = document.querySelector('.object-container');

// Create random objects
function createRandomObject() {
    const object = document.createElement('div');
    object.className = 'random-object';
    object.style.left = '200px';
    object.style.top = '-65px';
    const type = getRandomType();
    const imageName = getRandomImage(type);
    object.style.backgroundImage = `url('pictures/${type}/${imageName}')`;
    object.style.backgroundSize = 'cover';
    object.setAttribute('draggable', true);
    object.dataset.type = type;

    object.addEventListener('dragstart', dragStart);
    object.addEventListener('dragend', dragEnd);
    objectContainer.appendChild(object);
    moveObject(object);
    objectCount++;
}


function moveObject(object) {
    let left = 210;
    let top = -65;
    const interval = setInterval(() => {
        if (score > 30) {
            left += 7;
            updateCreationInterval(1250);
        } else if (score > 15) {
            left += 5;
            updateCreationInterval(1500);
        } else {
            left += 3;
        }
        object.style.left = left + 'px';
        object.style.top = top + 'px';


        if (top > window.innerHeight) {
            object.remove();
            objectCount--;
            clearInterval(interval);
        }
    }, 20);
}

function updateCreationInterval(newInterval) {
    if (newInterval !== currentInterval) {
        currentInterval = newInterval;
        if (creationInterval) {
            clearInterval(creationInterval);
        }
        creationInterval = setInterval(createRandomObject, newInterval);
    }
}


function getRandomType() {
    const types = ['BIO', 'HAZ', 'NON-BIO'];
    return types[Math.floor(Math.random() * types.length)];
}


function getRandomImage(type) {
    const images = {
        'BIO': ['Dried Leaves.png', 'Eggshells.png', 'Fish bone.png', 'Fruits.png', 'Leftovers.png', 'Meat Bones.png', 'Paper.png', 'Spoiled Food.png', 'Vegetable Cuttings.png', 'Wood.png'],
        'HAZ': ['Aerosol Spray.png', 'Car Battery.png', 'Cleaning Chemicals.png', 'Cosmetics.png', 'Fluorescent Light Bulb.png', 'Medical Waste.png', 'Motor Oil.png', 'Paint Cans.png', 'Pesticide.png', 'Thermometer.png'],
        'NON-BIO': ['Aluminum Cans.png', 'Aluminun Foil.png', 'Buble Wrap.png', 'Egg Carton.png', 'Glass Bottles BottleBottles.png', 'Metal Container.png', 'Old Tire.png', 'Plastic Bag.png', 'Plastic Bottles.png', 'Styrofoam.png']
    };
    const typeImages = images[type];
    return typeImages[Math.floor(Math.random() * typeImages.length)];
}


function dragStart(event) {
    event.dataTransfer.setData('text', event.target.dataset.type);
    event.target.classList.add('dragging');

    setTimeout(() => {
        event.target.style.visibility = 'hidden';
    }, 0);
}

function dragEnd(event) {
    event.target.style.visibility = 'visible';
    event.target.classList.remove('dragging');
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const objectType = event.dataTransfer.getData('text');
    const containerType = event.target.dataset.type;

    if (objectType === containerType) {
        const object = document.querySelector('.dragging');
        if (object) {
            object.remove();
            score++;
            scoreContainer.textContent = `Score: ${score}`;
            objectCount--;

            const audio = new Audio('pictures/fx.mp3');
            audio.play();
        }
    }
}

document.addEventListener('dragover', (event) => event.preventDefault());
document.addEventListener('drop', (event) => event.preventDefault());
document.getElementById('background-music').volume = 0.2; 

creationInterval = setInterval(createRandomObject, currentInterval);
