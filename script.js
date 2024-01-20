// my notes to remind me on my learning

// fetch does not care about errors
// fetch only rejects the promise if there is a network error i.e. there is no connectivity.

// To truly handle errors, fetch won't do it for us. We have to manually step in a do this. This is important.

// Basically we want to look at the response object to see if it worked i.e. make sure we got a decent return

// Action - need to look at how to stop the API key being visible.

// Fetch response objective provides a property called ok.

// solar potential, max array panel count number, mac sunshine hours per year. carbon offset per year,
// calculation (panel count of 8, each panel entry killowatt enregy value, pull that for panel and get total. The api gives number of panels associated with a house and gives each value of KW enregy each panel obtains) solar potnetila = number of panels. 

let longitudeDetails;
let latitudeDetails;
let ukPostCode = ``;

const geo_URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${ukPostCode}&key=AIzaSyBSz3w7EQnyHPXu2qDA4hz71uCVntYBug8`

const SolarQueryURL = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${latitudeDetails}&location.longitude=${longitudeDetails}&requiredQuality=HIGH&key=AIzaSyBSz3w7EQnyHPXu2qDA4hz71uCVntYBug8`

let googleMapsURL = `https://maps.googleapis.com/maps/api/js?AIzaSyBSz3w7EQnyHPXu2qDA4hz71uCVntYBug8&libraries=geometry&callback=initMap`


// This is a map which we could place on pageload once the user enters their location. But its not fully ready yet, but an idea to have if you want to include it. Could also help with solar mapping aspect. This seems long winded to incorporate so unless we need it I'll remove it. 

// const mainMap = () => {
//   const map = new google.maps.Map(document.getElementById('map'), {

//   });


// } 


// Function for creating elements to make my life easier for when I have to make multiple elements
const createElements = (element, text, color,) => {
  let newElement = document.createElement(element)
  newElement.textContent = text
  newElement.style.color = color
  document.body.append(newElement)
}


// user input field for postcode

  let userPostcode = document.querySelector(`.user-postcode`)

 
   

  //function involving postcode errors
  const postcodeError = () => {
    userPostcode.value = "Not A Valid Postcode";
    userPostcode.style.backgroundColor = "#ffcccc";
  }

// function to reset styles
const resetStyles = () => {
  userPostcode.value = '';
  userPostcode.style.border = '1px solid black';
  userPostcode.style.backgroundColor = 'initial'; 
};
// Event 

const button = document.querySelector(`.submit-btn`)
button.addEventListener(`click`, (e) => {

  e.preventDefault();

  ukPostCode = e.target.previousElementSibling.value

  const specialCharacters= /[!@#$%^&*()/,.?":{}|<>]/;

  if (typeof ukPostCode !== "string" || !isNaN(ukPostCode) || ukPostCode === "" || specialCharacters.test(ukPostCode)) {
    postcodeError()
  } else {
    // Reset styles for valid postcode
    resetStyles();

    // Fetch location and solar info
    fetchLocation(ukPostCode);
  }

 


})

// Fetch User location function

const fetchLocation = (ukPostCode) => {
  fetch(`https:maps.googleapis.com/maps/api/geocode/json?address=${ukPostCode}&key=AIzaSyBSz3w7EQnyHPXu2qDA4hz71uCVntYBug8`)
    .then(response => {

    // Error handling
    

      return response.json()})
    .then(data => {

      if (data.status === "ZERO_RESULTS" || data.status === "INVALID_REQUEST"){
            postcodeError()
        } else {
          resetStyles();
        }
      
      console.log(data);
      const latitudeDetails = data.results[0].geometry.location.lat;
      const longitudeDetails = data.results[0].geometry.location.lng;
      // console.log(latitudeDetails, longitudeDetails);


      // this calls the solar info function using the user's lat and lon parameters.
      fetchSolarInfo(latitudeDetails, longitudeDetails)

      return [latitudeDetails, longitudeDetails]

      //Returns an array containing multiple variables so that we can use in another fucntion.
    })
    .catch(error => error) // Without this line of code the lat and lon variables will return uncaught errors and stop the rest of the code. 

}


const fetchSolarInfo = (lat, lon) => {
  fetch(`https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lon}&requiredQuality=MEDIUM&key=AIzaSyBSz3w7EQnyHPXu2qDA4hz71uCVntYBug8`)
    .then(response => response.json())
    .then(data => { 
      try {
      if (data.error.status === "NOT_FOUND") {
        openModal()
      } else {
        resetStyles()
      }
    }
    catch(error){console.log(`loading Successful`);}
      
      
      console.log(data)

      let maxSunshineHoursPerYear = data.solarPotential.maxSunshineHoursPerYear

      let carbonOffsetFactorKgPerMwh = data.solarPotential.carbonOffsetFactorKgPerMwh

      let panelNumber = data.solarPotential.solarPanelConfigs[0].panelsCount

      let yearlyEnergyDcKwh = data.solarPotential.solarPanelConfigs[0].yearlyEnergyDcKwh

      console.log(maxSunshineHoursPerYear, carbonOffsetFactorKgPerMwh, panelNumber, yearlyEnergyDcKwh);
      
    })



// This is a test modal, I just added it to see how we can alert the user of the situation without using a basic alert window.

// Function to open the modal with a specific message
function openModal() {
  document.getElementById('errorMessage').innerText = "We're sorry, but our product doesn't currently cover your living area. We're in beta testing and plan to expand our coverage in the future.";
  document.getElementById('errorModal').style.display = 'block';
}

// Function to close the modal
function closeModal() {
  document.getElementById('errorModal').style.display = 'none';
}

const modalCloseBtn = document.querySelector(`.close`);

modalCloseBtn.addEventListener(`click`, () => {
  closeModal()
})


}






// const getGeoLoc = async () => {
//   try {
//     const response = await fetch(geo_URL);
//     // throw own error manually and then catch error below
//     if (!response.ok) {
//       throw new Error(`http error! Status: ${response.status}`);
//     }
//     const data = await response.json();
//     //console.log(data);
//     //console.log(data.results[0].geometry.location.lat);
//     //console.log(data.results[0].geometry.location.lng);
//     longitudeDetails = data.results[0].geometry.location.lng;
//     latitudeDetails = data.results[0].geometry.location.lat;
//     console.log(`Lat details: ${latitudeDetails}`);
//     console.log(`Long details: ${longitudeDetails}`);
//   } catch (error) {
//     console.log("something is wrong");
//     console.log(`Error: ${error}`);
//   }
// };




