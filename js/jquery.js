function renderUserInfo(routeInfo, index){
    $('.js-map-leg-info').append(`<div class="route-info"><p><span class="start-left"><strong>Start:</strong> ${routeInfo[index].start_name}</span><span class="start-right"><strong>End: </strong> ${routeInfo[index].end_name}</span>
    </p><p><strong>Duration:</strong> <span class="info-duration">${routeInfo[index].routeDuration}</span> <strong>Distance: </strong><span class="info-distance"> ${routeInfo[index].routeDistance}</span>   <span class="icon"><i class="fas fa-car"></i></span>`) 
}
