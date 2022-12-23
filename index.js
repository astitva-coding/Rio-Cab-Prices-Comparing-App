// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script
// src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      mapTypeControl: false,
      center: { lat: 28.644, lng: 77.216 },
      zoom: 13,
    });
  
    new AutocompleteDirectionsHandler(map);
    
  }
  
  class AutocompleteDirectionsHandler {
    map;
    originPlaceId;
    destinationPlaceId;
    travelMode;
    directionsService;
    directionsRenderer;
    constructor(map) {
      this.map = map;
      this.originPlaceId = "";
      this.destinationPlaceId = "";
      this.travelMode = google.maps.TravelMode.WALKING;
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(map);
  
      const originInput = document.getElementById("origin-input");
      const destinationInput = document.getElementById("destination-input");
      const modeSelector = document.getElementById("mode-selector");
      // Specify just the place data fields that you need.
      const originAutocomplete = new google.maps.places.Autocomplete(
        originInput,
        { fields: ["place_id"] }
      );
      // Specify just the place data fields that you need.
      const destinationAutocomplete = new google.maps.places.Autocomplete(
        destinationInput,
        { fields: ["place_id"] }
      );
  
      this.setupClickListener(
        "changemode-walking",
        google.maps.TravelMode.WALKING
      );
      this.setupClickListener(
        "changemode-transit",
        google.maps.TravelMode.TRANSIT
      );
      this.setupClickListener(
        "changemode-driving",
        google.maps.TravelMode.DRIVING
      );
      this.setupPlaceChangedListener(originAutocomplete, "ORIG");
      this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
        destinationInput
      );
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
     
      
    }
    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    setupClickListener(id, mode) {
      const radioButton = document.getElementById(id);
  
      radioButton.addEventListener("click", () => {
        this.travelMode = mode;
        this.route();
       
      });
    }
    setupPlaceChangedListener(autocomplete, mode) {
      autocomplete.bindTo("bounds", this.map);
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
  
        if (!place.place_id) {
          window.alert("Please select an option from the dropdown list.");
          return;
        }
  
        if (mode === "ORIG") {
          this.originPlaceId = place.place_id;
        } else {
          this.destinationPlaceId = place.place_id;
        }
  
        this.route();
        
      });
    }
    route() {
        getfare(this.originPlaceId,this.destinationPlaceId);
      if (!this.originPlaceId || !this.destinationPlaceId) {
        return;
      }
  
      const me = this;
  
      this.directionsService.route(
        {
          origin: { placeId: this.originPlaceId },
          destination: { placeId: this.destinationPlaceId },
          travelMode: this.travelMode,
        },
        (response, status) => {
          if (status === "OK") {
            me.directionsRenderer.setDirections(response);
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );
      
    }
  }
  
  window.initMap = initMap;
  async function getfare(o,d){
    // console.log(o)
    const originInput = document.getElementById("origin-input");
      const destinationInput = document.getElementById("destination-input");
        let url=`https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${o}&destination=place_id:${d}&key=AIzaSyB9PUV-vNn3hUna8KuGBzONVJOsI2SCVhc`


    const response = await fetch(url);
     var data = await response.json();
    //  console.log(data.routes[0])    
     let distance=data.routes[0].legs[0].distance.value/1000;
     let duration = data.routes[0].legs[0].duration.value/60;
     
        var today = new Date();
        let hour=today.getHours();
        let multiplier = 1.8;
        if((hour>=8&&hour<=10)||(hour>=0&&hour<=6)||(hour>=5&&hour<=7)){
            multiplier=2.8
        }
        console.log(multiplier)
    //  console.log(distance,duration,hour);
     setubergo(distance,duration,multiplier);
     setubersedan(distance,duration,multiplier);
     setolago(distance,duration,multiplier);
     setolasedan(distance,duration,multiplier);


        
  }
  function setubergo(distance,duration,multiplier){
    let basefare=30;
    let fareperkm=9.5;
    let farepermin=1.5;
    let finalfare= (basefare+(fareperkm*distance)+(farepermin*duration))*multiplier;
    // console.log("uber go"+ finalfare)
    finalfare=Math.round(finalfare * 100) / 100
    let element = document.getElementById("3");
    element.innerHTML+=finalfare;
   
  }
  function setubersedan(distance,duration,multiplier){
    let basefare=60;
    let fareperkm=10.5;
    let farepermin=1.7;
    let finalfare=  (basefare+(fareperkm*distance)+(farepermin*duration))*multiplier;
    finalfare=Math.round(finalfare * 100) / 100
// console.log("uber sedan"+finalfare)
let element = document.getElementById("4");
    element.innerHTML+=finalfare;
  }
  function setolago(distance,duration,multiplier){
    let basefare=40;
    let fareperkm=9.7;
    let farepermin=1.5;
    let finalfare= (basefare+(fareperkm*distance)+(farepermin*duration))*multiplier;
    finalfare=Math.round(finalfare * 100) / 100
// console.log("ola mini"+finalfare)
let element = document.getElementById("1");
    element.innerHTML+=finalfare;
  }
  function setolasedan(distance,duration,multiplier){
    let basefare=80;
    let fareperkm=11.7;
    let farepermin=1.7;
    let finalfare= (basefare+(fareperkm*distance)+(farepermin*duration))*multiplier;
    finalfare=Math.round(finalfare * 100) / 100
// console.log("ola sedan"+finalfare)
let element = document.getElementById("2");
    element.innerHTML+=finalfare;
  }