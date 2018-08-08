let waypointIndex = 0
let waypointIndexArray = [
    `<input id="waypoint-input-0" class="waypoint-input-0" type="text">`,
    `<input id="waypoint-input-1" class="waypoint-input-1" type="text">`,
    `<input id="waypoint-input-2" class="waypoint-input-2" type="text">`,
    `<input id="waypoint-input-3" class="waypoint-input-3" type="text">`,
    `<input id="waypoint-input-4" class="waypoint-input-4" type="text">`,
    `<input id="waypoint-input-5" class="waypoint-input-5" type="text">`,
]

function increaseWaypointIndex(){
    // console.log(waypointIndex);
    waypointIndex++;
    // console.log(waypointIndex);
}

// function generateSearchBox(){
//     return `<input id="waypoint-input-${waypointIndex}" class="waypoint-input-${waypointIndex}" type="text">`;
// }

function renderSearchBox(){
    console.log("rendering search box")
    // waypointIndexArray.push(generateSearchBox());
    // console.log(waypointIndexArray);
    // console.log(waypointIndexArray[waypointIndex])
    $('.js-add-input').append(waypointIndexArray);
}

function handleNewWaypoint(){
    $(`.add-waypoint`).on('click', function(){
        console.log('adding new waypoint');
        console.log(waypointIndex)
        $(`.waypoint-input-${waypointIndex}`).css('display','block');
        increaseWaypointIndex();
    })
}

function renderUserInfo(routeDistance, routeDuration, index){
    $('.js-map-leg-info').html(`<div class="index-info-${index}"<p>Distance: ${routeDistance[index]} Duration: ${routeDuration[index]} Mode: ${this.travelMode}</p>`)
}

$(renderSearchBox);
$(handleNewWaypoint);

