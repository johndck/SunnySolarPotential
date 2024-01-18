// my notes to remind me on my learning

// fetch does not care about errors
// fetch only rejects the promise if there is a network error i.e. there is no connectivity.

// To truly handle errors, fetch won't do it for us. We have to manually step in a do this. This is important.

// Basically we want to look at the response object to see if it worked i.e. make sure we got a decent return

// Action - need to look at how to stop the API key being visible.

// Fetch response objective provides a property called ok.

let longitudeDetails;
let latitudeDetails;
const ukPostCode = "SW128HA";
const magickeys = "xxxxx";
const geo_URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${ukPostCode}&key=${magickeys}`;

const getGeoLoc = async () => {
  try {
    const response = await fetch(geo_URL);
    // throw own error manually and then catch error below
    if (!response.ok) {
      throw new Error(`http error! Status: ${response.status}`);
    }
    const data = await response.json();
    //console.log(data);
    //console.log(data.results[0].geometry.location.lat);
    //console.log(data.results[0].geometry.location.lng);
    longitudeDetails = data.results[0].geometry.location.lng;
    latitudeDetails = data.results[0].geometry.location.lat;
    console.log(`Lat details: ${latitudeDetails}`);
    console.log(`Long details: ${longitudeDetails}`);
  } catch (error) {
    console.log("something is wrong");
    console.log(`Error: ${error}`);
  }
};

getGeoLoc();
