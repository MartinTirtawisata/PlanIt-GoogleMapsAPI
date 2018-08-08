function renderUserInfo(routeInfo, index){
    
    $('.js-map-leg-info').append(`<div class="route-info"<p>From: ${routeInfo[index].start_address} to ${routeInfo[index].end_address} Distance: ${routeInfo[index].routeDistance} Duration: ${routeInfo[index].routeDuration} Mode: ${routeInfo[index].travelMode}</p>`)
    
}
