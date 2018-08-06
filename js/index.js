function initMap() {
    let map = new google.maps.Map(document.getElementById('map'), {
        //mapTypeControl = Map/Satellite control
        mapTypeControl: false,
        center: {lat: 34.1478, lng: -118.1445},
        zoom: 13
    });

    console.log(map);
    //creates a new object called (Autocomplete...Handler) 
    new AutocompleteDirectionHandler(map);
}

function AutocompleteDirectionHandler(map){
    this.map = map;
    this.initialPlaceId = null;
    this.destinationPlaceId = null;
    this.waypointPlaceId = null;
    this.travelMode = 'WALKING';

    let initialInput = document.getElementById('initial-input');
    console.log(initialInput);
    let destinationInput = document.getElementById('destination-input');
    console.log(destinationInput);
    let waypointInput = document.getElementById('waypoint-input')
    
    let modeSelector = document.getElementById('mode-selector');
    //service that computes directions between two or more places. 
    this.directionsService = new google.maps.DirectionsService;
    //Direction Renderer = renders the directions obtained from the DirectionService. 
    this.directionsRender = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
    });
    // this.directionsRender.setMap(map);

    let initialAutocomplete = new google.maps.places.Autocomplete(initialInput, {placeIdOnly: true});
    let destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput, {placeIdOnly: true});
    let waypointAutocomplete = new google.maps.places.Autocomplete(waypointInput, {placeIdOnly: true});


    this.setupModeChange('changemode-walking', 'WALKING');
    this.setupModeChange('changemode-transit', 'TRANSIT');
    this.setupModeChange('changemode-driving', 'DRIVING');

    this.setupPlaceChangedListener(initialAutocomplete, "INIT");
    this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
    this.setupWaypointsListener(waypointAutocomplete, "WYPT")

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
            console.log(me.initialPlaceId);
        } else {
            me.destinationPlaceId = newPlace.place_id;
            console.log(me.destinationPlaceId);
        } 
        me.displayRoute();
    }); 
};

AutocompleteDirectionHandler.prototype.displayRoute = function(){
    if (!this.initialPlaceId || !this.destinationPlaceId){
        return;
    }

    // let waypointArray = [{
    //     location: {'placeId': this.waypointPlaceId},
    //     stopover: false
    // }];

    let me = this;
    console.log("rendering displayRoute");

    directionRequest = {
        origin: {'placeId': this.initialPlaceId},
        destination: {'placeId': this.destinationPlaceId},
        travelMode: this.travelMode,
        // waypoints: waypointArray
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
    let routeDistance = myRoute.legs[0].distance.text;
    let routeDuration = myRoute.legs[0].duration.text;
    console.log(routeDistance, routeDuration);
    console.log(this.travelMode);

    $('.js-map-leg-info').html(`<p>Distance: ${routeDistance} Duration: ${routeDuration} Mode: ${this.travelMode}</p>`);

    $('#waypoint-input').css('display','block')
}

AutocompleteDirectionHandler.prototype.setupWaypointsListener = function(autocomplete, mode){
    let me = this;
    autocomplete.bindTo('bounds', this.map);
    autocomplete.addListener('place_changed', function(){
        let newWaypoint = autocomplete.getPlace();
        if (!newWaypoint.place_id){
            window.alert("Incorrect Input");
            return;
        }

        if(mode === "WYPT"){
            me.waypointPlaceId = newWaypoint.place_id;
            console.log(me.waypointPlaceId);
        }
        me.displayRoute();
    });
}



