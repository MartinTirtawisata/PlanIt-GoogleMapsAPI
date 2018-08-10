function initMap() {
    let map = new google.maps.Map(document.getElementById('map'), {
        mapTypeControl: false,
        center: {lat: 34.1478, lng: -118.1445},
        zoom: 15
    });
    new AutocompleteDirectionHandler(map);
}
function AutocompleteDirectionHandler(map){
    this.map = map;
    this.placeId = null;
    this.placeIdArray = [];
    this.wyptIndex = 0;
    this.waypointsArray = [];
    this.travelMode = 'DRIVING';
    this.routeInformation = [];
    this.routeIndex = 0;
    this.placeNameArray = [];
    this.placeIndex = 0;
    this.icon = null;

    //Get the value of the waypoint inputs
    let placeInput = document.getElementById('place-input');

    //service that computes directions between two or more places. 
    this.directionsService = new google.maps.DirectionsService;

    //Direction Renderer renders the directions obtained from the DirectionService. 
    this.directionsRender = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
    });
    this.placeService = new google.maps.places.PlacesService(map);
    //Creating new objects from Google Map API
    let placeAutocomplete = new google.maps.places.Autocomplete(placeInput);
    this.marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0,0)
    });
   
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
    let me = this;
    autocompleteSettings.bindTo('bounds', this.map);
    autocompleteSettings.setFields(['geometry','name','place_id' ])
    autocompleteSettings.addListener('place_changed', function(){
        let getPlace = autocompleteSettings.getPlace();
        if (!getPlace.place_id) {
            window.alert("Incorrect input");
            return;
        }

        if (mode === "ORIG"){
            me.placeId = getPlace.place_id;
            $('#place-input').val("");

            if ($('.start-title').html('A Start')){
                $('.start-title').html('An End')
            }
        }
        
        me.getPlaceDetail();
        me.setLocationArray();
        me.setMarker(getPlace);
        me.setIconType();
        me.displayRoute();
    }); 
};

//This retrieves the name of the place 
AutocompleteDirectionHandler.prototype.getPlaceDetail = function(){
    let me = this;
    if (this.placeId){
        this.placeService.getDetails({
            placeId: this.placeId
        }, function(place, status){
            if (status == google.maps.places.PlacesServiceStatus.OK){
                me.placeNameArray.push(place.name)
            }
        });
    }
}

//This function puts the waypoints retrieved into an array
AutocompleteDirectionHandler.prototype.setLocationArray = function(){
    if (this.placeId){
        this.placeIdArray.push({
            placeId: this.placeId
        });        
    }
    if (this.placeIdArray.length >= 3 && this.travelMode != "TRANSIT"){
        let wypts = this.placeIdArray.slice(1,-1)
        this.waypointsArray.push({
            location: wypts[this.wyptIndex],
            stopover: true
        });
        this.wyptIndex++;
    } 
    if (this.placeIdArray.length == 2){
        if(this.travelMode == 'TRANSIT') {
            alert("Transit mode can only have 2 destinations max!")
        }    
    }
}

AutocompleteDirectionHandler.prototype.setMarker = function(place){
    if (this.placeIdArray.length == 1){
        this.marker.setVisible(false);
        if (place.geometry.viewport){
            this.map.fitBounds(place.geometry.viewport)
        } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(14);
        }
        this.marker.setPosition(place.geometry.location);
        this.marker.setVisible(true);
    }
}

AutocompleteDirectionHandler.prototype.setIconType = function(){
    if (this.travelMode == 'WALKING'){
        this.icon =`<i class="fas fa-walking"></i>`;
    } else if(this.travelMode == 'DRIVING'){
        this.icon =`<i class="fas fa-car"></i>`;
    } else if(this.travelMode == 'TRANSIT'){
        this.icon =`<i class="fas fa-train"></i>`;
    }
}



AutocompleteDirectionHandler.prototype.displayRoute = function(){
    if (!this.placeId){
        return;
    }

    let me = this;
    directionRequest = {
        origin: this.placeIdArray[0],
        destination: this.placeIdArray[this.placeIdArray.length-1],
        travelMode: this.travelMode,
        waypoints: this.waypointsArray
    }

    if (this.placeIdArray.length >= 2){
        $(disableInput());
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
    let me = this;
    this.directionsRender.addListener('directions_changed', function(){
        me.computeTotalDistance(me.directionsRender.getDirections());
    });
};

AutocompleteDirectionHandler.prototype.computeTotalDistance = function(result){
    this.marker.setVisible(false);
    let totalDuration = 0
    let totalDistance = 0
    let myRoute = result.routes[0];
    if (this.placeNameArray[1]){
        this.routeInformation.push({
            start_address: myRoute.legs[this.routeIndex].start_address,
            start_name: this.placeNameArray[this.placeIndex],
            end_address: myRoute.legs[this.routeIndex].end_address,
            end_name: this.placeNameArray[this.placeIndex + 1],
            routeDistance: myRoute.legs[this.routeIndex].distance.text,
            routeDuration: myRoute.legs[this.routeIndex].duration.text,
            travelMode: this.travelMode,
            icon: this.icon
        });
    }

    for (i=0; i<myRoute.legs.length; i++){
        totalDuration += myRoute.legs[i].duration.value
        totalDistance += myRoute.legs[i].distance.value
    }

    totalDistance = ((totalDistance/60)/60);
    totalDuration = (totalDuration/60);
    distance = totalDistance.toFixed(2);
    duration = totalDuration.toFixed(2);
    renderUserInfo(this.routeInformation, this.routeIndex);
    displayTotal(distance, duration)
    deleteRouteIndex(this.routeIndex);
    this.routeIndex++;
    this.placeIndex++;
}



