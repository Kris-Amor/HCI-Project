let objectCount = 0;
let score = 0;
const scoreContainer = document.querySelector('.score-container');

// Create random objects
function createRandomObject() {
    if (objectCount >= 5) return;

    const object = document.createElement('div');
    object.className = 'random-object';
    object.style.left = '100px';
    object.style.top = '-65px';
    const type = getRandomType();
    object.style.backgroundImage = `url('pictures/${type}/${getRandomImage(type)}')`;
    object.style.backgroundSize = 'cover';
    object.setAttribute('draggable', true);
    object.dataset.type = type;

    object.addEventListener('dragstart', dragStart);
    object.addEventListener('dragend', dragEnd);

    document.querySelector('.object-container').appendChild(object);
    moveObject(object);
    objectCount++;
}

// Move objects across the screen
function moveObject(object) {
    let left = 100;
    let top = -65;
    const interval = setInterval(() => {
        left += 2;
        if (left > window.innerWidth / 1.09) {
            top += 2;
        }
        object.style.left = left + 'px';
        object.style.top = top + 'px';
    }, 20);
}

// Get random type (BIO, HAZ, NON-BIO)
function getRandomType() {
    const types = ['BIO', 'HAZ', 'NON-BIO'];
    return types[Math.floor(Math.random() * types.length)];
}

// Get random image for the type
function getRandomImage(type) {
    const images = {
        'BIO': ['Dried Leaves.png', 'Eggshells.png', 'Fish bone.png', 'Fruits.png', 'Leftovers.png', 'Meat Bones.png', 'Paper.png', 'Spoiled Food.png', 'Vegetables Cuttings.png', 'Wood.png'],
        'HAZ': ['Aerosol Spray.png', 'Car Battery.png', 'Cleaning Chemicals.png', 'Cosmetics.png', 'Fluorescent Light Bulb.png', 'Medical Waste.png', 'Motor Oil.png', 'Paint Cans.png', 'Pesticide.png', 'Thermometer.png'],
        'NON-BIO': ['Aluminum Cans.png', 'Aluminum Foil.png', 'Buble Wrap.png', 'Egg Carton.png', 'Glass Bottles.png', 'Metal Container.png', 'Old Tire.png', 'Plastic Bag.png', 'Plastic Bottles.png', 'Styrofoam.png']
    };
    const typeImages = images[type];
    return typeImages[Math.floor(Math.random() * typeImages.length)];
}

// Drag and drop functions
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
        }
    }
}

// Create objects every 3 seconds
const creationInterval = setInterval(createRandomObject, 3000);