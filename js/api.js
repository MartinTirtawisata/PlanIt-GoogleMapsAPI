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
    this.waypointPlaceId_0 = null;
    this.waypointPlaceId_1 = null;
    this.waypointPlaceId_2 = null;
    this.waypointPlaceId_3 = null;
    this.waypointPlaceId_4 = null;
    this.waypointPlaceId_5 = null;
    this.travelMode = 'DRIVING';

    //Get the value of the waypoint inputs
    let initialInput = document.getElementById('initial-input');
    let destinationInput = document.getElementById('destination-input');
    let waypointInput_0 = document.getElementById(`waypoint-input-0`);
    let waypointInput_1 = document.getElementById('waypoint-input-1');
    let waypointInput_2 = document.getElementById('waypoint-input-2');
    let waypointInput_3 = document.getElementById('waypoint-input-3');
    let waypointInput_4 = document.getElementById('waypoint-input-4');
    let waypointInput_5 = document.getElementById('waypoint-input-5');

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
    let waypointAutocomplete_0 = new google.maps.places.Autocomplete(waypointInput_0, {placeIdOnly: true});
    let waypointAutocomplete_1 = new google.maps.places.Autocomplete(waypointInput_1, {placeIdOnly: true});
    let waypointAutocomplete_2 = new google.maps.places.Autocomplete(waypointInput_2, {placeIdOnly: true});
    let waypointAutocomplete_3 = new google.maps.places.Autocomplete(waypointInput_3, {placeIdOnly: true});
    let waypointAutocomplete_4 = new google.maps.places.Autocomplete(waypointInput_4, {placeIdOnly: true});
    let waypointAutocomplete_5 = new google.maps.places.Autocomplete(waypointInput_5, {placeIdOnly: true});

    this.setupModeChange('changemode-walking', 'WALKING');
    this.setupModeChange('changemode-transit', 'TRANSIT');
    this.setupModeChange('changemode-driving', 'DRIVING');

    this.setupPlaceChangedListener(initialAutocomplete, "INIT");
    this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
    this.setupPlaceChangedListener(waypointAutocomplete_0, "WYPT_0");
    this.setupPlaceChangedListener(waypointAutocomplete_1, "WYPT_1");
    this.setupPlaceChangedListener(waypointAutocomplete_2, "WYPT_2")
    this.setupPlaceChangedListener(waypointAutocomplete_3, "WYPT_3")
    this.setupPlaceChangedListener(waypointAutocomplete_4, "WYPT_4")
    this.setupPlaceChangedListener(waypointAutocomplete_5, "WYPT_5")

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
        } else if(mode === "DEST"){
            me.destinationPlaceId = newPlace.place_id;
        } else if(mode === "WYPT_0"){
            me.waypointPlaceId_0 = newPlace.place_id;
        } else if(mode === "WYPT_1"){
            me.waypointPlaceId_1 = newPlace.place_id;
        } else if(mode === "WYPT_2"){
            me.waypointPlaceId_2 = newPlace.place_id;
        } else if(mode === "WYPT_3"){
            me.waypointPlaceId_3 = newPlace.place_id;
        } else if(mode === "WYPT_4"){
            me.waypointPlaceId_4 = newPlace.place_id;
        } else if(mode === "WYPT_5"){
            me.waypointPlaceId_5 = newPlace.place_id;
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
        
        if (this.waypointPlaceId_5){
            this.destinationPlaceId = this.waypointPlaceId_5
        } else if (this.waypointPlaceId_4){
            this.destinationPlaceId = this.waypointPlaceId_4
        } else if (this.waypointPlaceId_3){
            this.destinationPlaceId = this.waypointPlaceId_3
        } else if (this.waypointPlaceId_2){
            this.destinationPlaceId = this.waypointPlaceId_2
        } else if (this.waypointPlaceId_1){
            this.destinationPlaceId = this.waypointPlaceId_1
        } else if (this.waypointPlaceId_0){
            this.destinationPlaceId = this.waypointPlaceId_0;    
        }
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


