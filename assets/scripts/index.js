document.getElementById('play-button').addEventListener('click', function(event) {
    event.preventDefault(); 
    document.getElementById('button-sound').play();
    setTimeout(function() {
        window.location.href = 'Popup.html';
    }, 500);
});

document.getElementById('button-sound').volume = 1;
document.getElementById('background-music').volume = 0.2; 