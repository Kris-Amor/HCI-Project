let objectCount = 0;
let score = 0;
let missedItems = 0;
let creationInterval;
let currentInterval = 1800;
let mismatchCount = 0;
const mismatchCountDisplay = document.getElementById('mismatch-count');
const missCountDisplay = document.getElementById('miss-count');
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
        if (!object.parentNode) {
            clearInterval(interval);
            return;
        }

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
        
        if (top > window.innerHeight || left > window.innerWidth) {
            object.remove();
            objectCount--;
            clearInterval(interval);

            missedItems++;
            missCountDisplay.textContent = missedItems.toString();
        }


        if (object.dataset.stopMoving === 'true') {
            clearInterval(interval);
            return;
        }
        
        if (missedItems >= 3) {
            gameOver(false);
            clearInterval(interval);
            return;
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
    } else {
        mismatchCount++;

        if (mismatchCountDisplay) {
            mismatchCountDisplay.textContent = mismatchCount;
        }

        if (mismatchCount >= 3) { 
            gameOver(true);
        }
    }
}

function gameOver(isMismatch = false) {
    clearInterval(creationInterval);

    document.querySelectorAll('.random-object').forEach(obj => {
        obj.style.animation = 'none'; 
        obj.style.transition = 'none'; 
    });

    document.querySelectorAll('.random-object').forEach(obj => {
        obj.dataset.stopMoving = 'true';
    });

    const gameOverScreen = document.getElementById('game-over-screen');
    const gameOverMessage = document.getElementById('game-over-message');

    if (isMismatch) {
        gameOverMessage.textContent = "Game Over! You placed too many items in the wrong bin!";
    } else {
        gameOverMessage.textContent = "Game Over! You missed too many items!";
    }

    gameOverScreen.style.display = 'block';
}

function restartGame() {
    location.reload();
}

document.addEventListener('dragover', (event) => event.preventDefault());
document.addEventListener('drop', (event) => event.preventDefault());
document.getElementById('background-music').volume = 0.2; 

creationInterval = setInterval(createRandomObject, currentInterval);
