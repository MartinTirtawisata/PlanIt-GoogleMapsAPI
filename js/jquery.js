function renderUserInfo(routeDistance, routeDuration, index){
    $('.js-map-leg-info').html(`<div class="index-info-${index}"<p>Distance: ${routeDistance[index]} Duration: ${routeDuration[index]} Mode: ${this.travelMode}</p>`)
}
