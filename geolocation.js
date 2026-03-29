function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Function to handle the position object returned by the Geolocation API
function showPosition(position) {
  console.log("Latitude: " + position.coords.latitude + 
  "\nLongitude: " + position.coords.longitude);
}

// Function to handle any potential errors
function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      console.error("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.error("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      console.error("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      console.error("An unknown error occurred.");
      break;
  }
}

// Call getLocation() when the document is loaded or refreshed
document.addEventListener("DOMContentLoaded", getLocation);
