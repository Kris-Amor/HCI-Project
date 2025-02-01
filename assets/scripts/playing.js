let objectCount = 0;
let score = 0;
let missedItems = 0;
let missedItems = 0;
let creationInterval;
let currentInterval = 1800;
let mismatchCount = 0;
let isPaused = false; // Track if the game is paused
const mismatchCountDisplay = document.getElementById('mismatch-count');
const missCountDisplay = document.getElementById('miss-count');
const scoreContainer = document.querySelector('.score-container');
const objectContainer = document.querySelector('.object-container');

// Store paused objects' data (positions and movement intervals)
let pausedObjects = [];
let objectIntervals = []; // To keep track of moving object intervals

// Create random objects
function createRandomObject() {
    if (isPaused) return; // Prevent object creation if game is paused
    
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
    if (isPaused) return; // Prevent object movement if game is paused
    
    let left = parseInt(object.style.left) || 210;  // Starting position
    let top = parseInt(object.style.top) || -65;   // Starting position
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

    // Store interval ID on the object to reference later
    object.dataset.intervalId = interval;
    objectIntervals.push(interval); // Keep track of this object's interval
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

    // Stop all ongoing object movements
    document.querySelectorAll('.random-object').forEach(obj => {
        obj.style.animation = 'none'; 
        obj.style.transition = 'none'; 
    });

    document.querySelectorAll('.random-object').forEach(obj => {
        obj.dataset.stopMoving = 'true'; // Stop the object
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

// Modify pauseGame to clear object movement intervals
function pauseGame() {
    isPaused = true;
    clearInterval(creationInterval); // Stop object creation

    // Stop all moving objects by clearing their intervals
    objectIntervals.forEach(interval => clearInterval(interval));
    objectIntervals = []; // Reset the intervals array

    // Store the state of each moving object
    document.querySelectorAll('.random-object').forEach(object => {
        const { left, top } = object.style; // Store position
        const intervalId = object.dataset.intervalId; // Store interval ID
        pausedObjects.push({
            object,
            left: parseInt(left),
            top: parseInt(top),
            intervalId // This keeps track of the movement interval
        });
        object.dataset.paused = 'true'; // Mark object as paused
    });
}

// Resume game by restoring intervals for moving objects
function resumeGame() {
    if (isPaused) {
        creationInterval = setInterval(createRandomObject, currentInterval); // Resume object creation
        isPaused = false;

        // Resume each paused object's movement
        pausedObjects.forEach(item => {
            const { object, left, top, intervalId } = item;
            
            // Set position to where it was paused
            object.style.left = left + 'px';
            object.style.top = top + 'px';

            // Restart the object's movement
            moveObject(object);

            // Remove the interval ID from the pausedObjects (as it's restarted)
            object.removeAttribute('data-interval-id'); 

            // Mark the object as no longer paused
            object.dataset.paused = 'false'; 
        });

        pausedObjects = []; // Clear the paused objects list after resuming
    }
}


// Event listeners for drag-and-drop
document.addEventListener('dragover', (event) => event.preventDefault());
document.addEventListener('drop', (event) => event.preventDefault());
document.getElementById('background-music').volume = 0.2; 

// Create the initial interval for spawning objects
creationInterval = setInterval(createRandomObject, currentInterval);

// Pause and resume the game via hint button
document.querySelector('.hint-btn').addEventListener('click', () => {
    pauseGame(); // Pause game when hint is clicked
    document.getElementById('hint-container').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
});

// Handle close hint button
document.getElementById('close-hint-btn').addEventListener('click', () => {
    document.getElementById('hint-container').style.display = 'none';
    document.body.style.overflow = 'auto'; // Allow scrolling again
    resumeGame(); // Resume game when hint is closed
});
