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
    this.placeId = null;
    this.placeIdArray = [];
    this.wyptIndex = 0;
    this.waypointsArray = [];
    this.travelMode = 'DRIVING'
    this.routeInformation = [];
    this.routeIndex = 0;
    this.placeNameArray = [];
    this.placeIndex = 0;

    //Get the value of the waypoint inputs
    let placeInput = document.getElementById('place-input');
    //service that computes directions between two or more places. 
    this.directionsService = new google.maps.DirectionsService;
    //Direction Renderer = renders the directions obtained from the DirectionService. 
    this.directionsRender = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
    });

    this.placeService = new google.maps.places.PlacesService(map);

    //Creating new objects from Google Map API
    let placeAutocomplete = new google.maps.places.Autocomplete(placeInput, {placeIdOnly: true});
   
    this.setupModeChange('changemode-walking', 'WALKING');
    this.setupModeChange('changemode-transit', 'TRANSIT');
    this.setupModeChange('changemode-driving', 'DRIVING');

    this.setupPlaceChangedListener(placeAutocomplete, "ORIG");   
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
    console.log('1')
    let me = this;
    autocompleteSettings.bindTo('bounds', this.map);
    autocompleteSettings.addListener('place_changed', function(){
        let newPlace = autocompleteSettings.getPlace();
        // console.log(newPlace);
        if (!newPlace.place_id) {
            window.alert("Incorrect input");
            return;
        }

        if (mode === "ORIG"){
            me.placeId = newPlace.place_id;
            $('#place-input').val("");
        }
        me.getPlaceDetail();
        me.displayRoute(); 
    }); 
};

AutocompleteDirectionHandler.prototype.displayRoute = function(){
    console.log('4')
    if (!this.placeId){
        return;
    }

    if (this.placeId){
        this.placeIdArray.push({
            placeId: this.placeId
        });
    
        // console.log(this.placeIdArray[0]);
        // console.log(this.placeIdArray[this.placeIdArray.length-1]);
        // console.log(this.placeIdArray);
    }

    if (this.placeIdArray.length >= 3){

        let wypts = this.placeIdArray.slice(1,-1)
        // console.log(wypts);
        this.waypointsArray.push({
            location: wypts[this.wyptIndex],
            stopover: true
        });
        this.wyptIndex++;
    
        // console.log(this.waypointsArray);
    }

    let me = this;
    console.log("rendering displayRoute");
    console.log('5')
    directionRequest = {
        origin: this.placeIdArray[0],
        destination: this.placeIdArray[this.placeIdArray.length-1],
        travelMode: this.travelMode,
        waypoints: this.waypointsArray
    }

    if (this.placeIdArray.length >= 2){
        this.directionsService.route(directionRequest, function(response, status){
            if(status === 'OK'){
                me.directionsRender.setDirections(response);
            } else {
                window.alert('Direction request failed')
            }
        });
    };
};

AutocompleteDirectionHandler.prototype.setupDirectionsChangeListener = function(){
    console.log('2')
    let me = this;
    this.directionsRender.addListener('directions_changed', function(){
        me.computeTotalDistance(me.directionsRender.getDirections());
    });
};

AutocompleteDirectionHandler.prototype.computeTotalDistance = function(result){
    console.log('6')
    console.log("calculating route distance")
    let total = 0
    let myRoute = result.routes[0];
    // console.log(myRoute);

    if (this.placeNameArray[1]){
        this.routeInformation.push({
            start_address: myRoute.legs[this.routeIndex].start_address,
            start_name: this.placeNameArray[this.placeIndex],
            end_address: myRoute.legs[this.routeIndex].end_address,
            end_name: this.placeNameArray[this.placeIndex + 1],
            routeDistance: myRoute.legs[this.routeIndex].distance.text,
            routeDuration: myRoute.legs[this.routeIndex].duration.text,
            travelMode: this.travelMode
        });
    }

  

    console.log(this.routeInformation);
    renderUserInfo(this.routeInformation, this.routeIndex);
    this.routeIndex++;
    this.placeIndex++;
}

AutocompleteDirectionHandler.prototype.getPlaceDetail = function(){
    console.log('3')
    let me = this;
    if (this.placeId){
        this.placeService.getDetails({
            placeId: this.placeId
        }, function(place, status){
            if (status == google.maps.places.PlacesServiceStatus.OK){
                me.placeNameArray.push(place.name)
            }
            console.log(me.placeNameArray);
        });
    }
}


