function openPopup() {
    if (!sessionStorage.getItem("popupShown")) {
      document.getElementById("popupModal").style.display = "block";
      sessionStorage.setItem("popupShown", "true"); 
    }
  }

  function closePopup() {
    document.getElementById("popupModal").style.display = "none";
    var audio = new Audio('pictures/fx.mp3');
    audio.play();
    audio.onended = function() {
      window.location.href = "playing.html";
    };
  }

  window.onload = openPopup;