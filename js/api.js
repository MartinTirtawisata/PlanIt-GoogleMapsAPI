function initMap() {
    let map = new google.maps.Map(document.getElementById('map'), {
        mapTypeControl: false,
        center: {lat: 34.1478, lng: -118.1445},
        zoom: 13
    });

    new AutocompleteDirectionHandler(map);
}

function AutocompleteDirectionHandler(map){
    this.map = map;
    this.initialPlaceId = null;
    this.destinationPlaceId = null;
    this.waypointArray = [];

    this.travelMode = 'DRIVING';

    //Get the value of the waypoint inputs
    let initialInput = document.getElementById('initial-input');
    let destinationInput = document.getElementById('destination-input');

    //service that computes directions between two or more places. 
    this.directionsService = new google.maps.DirectionsService;
    //Direction Renderer = renders the directions obtained from the DirectionService. 
    this.directionsRender = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
    });

    //Creating new objects from Google Map API
    let initialAutocomplete = new google.maps.places.Autocomplete(initialInput, {placeIdOnly: true});
    let destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput, {placeIdOnly: true});

    this.setupModeChange('changemode-walking', 'WALKING');
    this.setupModeChange('changemode-transit', 'TRANSIT');
    this.setupModeChange('changemode-driving', 'DRIVING');

    this.setupPlaceChangedListener(initialAutocomplete, "INIT");
    this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
   
    this.setupDirectionsChangeListener();
}

AutocompleteDirectionHandler.prototype.setupModeChange = function(radio, modeSelect){
    let me = this;
    let radioButton = document.getElementById(radio);
    radioButton.addEventListener('click', function(){
        me.travelMode = modeSelect
        me.displayRoute();
    });
};

AutocompleteDirectionHandler.prototype.setupPlaceChangedListener = function(autocompleteSettings, mode){
    let me = this;
    autocompleteSettings.bindTo('bounds', this.map);
    autocompleteSettings.addListener('place_changed', function(){
        let newPlace = autocompleteSettings.getPlace();
        if (!newPlace.place_id) {
            window.alert("Incorrect input");
            return;
        }

        if (mode === "INIT"){
            me.initialPlaceId = newPlace.place_id;
        } else {
            me.destinationPlaceId = newPlace.place_id;
        }
        me.displayRoute();
    }); 
};

AutocompleteDirectionHandler.prototype.displayRoute = function(){
    if (!this.initialPlaceId || !this.destinationPlaceId){
        return;
    }

    if (this.waypointPlaceId_0){
        this.waypointArray.push({
            location: {placeId: this.destinationPlaceId},
            stopover: true
        });

    };

    let me = this;
    console.log("rendering displayRoute");

    directionRequest = {
        origin: {'placeId': this.initialPlaceId},
        destination: {'placeId': this.destinationPlaceId},
        travelMode: this.travelMode,
        waypoints: this.waypointArray
    }

    this.directionsService.route(directionRequest, function(response, status){
        if(status === 'OK'){
            me.directionsRender.setDirections(response);
        } else {
            window.alert('Direction request failed')
        }
    });
};

AutocompleteDirectionHandler.prototype.setupDirectionsChangeListener = function(){
    let me = this;
    this.directionsRender.addListener('directions_changed', function(){
        me.computeTotalDistance(me.directionsRender.getDirections());

    })
}

AutocompleteDirectionHandler.prototype.computeTotalDistance = function(result){
    console.log("calculating route distance")
    let total = 0
    let myRoute = result.routes[0];
    console.log(myRoute);
    let routeDistance = [];
    let routeDuration = [];
    let i = 0;

    routeDistance.push(myRoute.legs[i].distance.text);
    routeDuration.push(myRoute.legs[i].duration.text);
    console.log(routeDistance, routeDuration, i);
    console.log(this.travelMode);
    renderUserInfo(routeDistance, routeDuration, i);
}


