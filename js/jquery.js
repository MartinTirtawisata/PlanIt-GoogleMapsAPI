function renderUserInfo(routeInfo, index){
    $('.js-route-index').append(`<div class="route-info route-${index}"><button class="inline delete-button"><i class="fa fa-times" aria-hidden="true"></i></button><p class="inline"><span class="start-left"><strong>Start:</strong> ${routeInfo[index].start_name}</span><span class="start-right"><strong>End: </strong> ${routeInfo[index].end_name}</span>
    </p><p><strong>Duration:</strong> <span class="info-duration">${routeInfo[index].routeDuration}</span> <strong>Distance: </strong><span class="info-distance"> ${routeInfo[index].routeDistance}</span>    <span class="icon">${routeInfo[index].icon}</span><hr>`) 
}

function displayTotal(distance, duration){
    $('.js-route-total').html(`<div class="route-info"><p>Total Distance: <span class="info-distance">${distance} mi</span></p><p>Total Duration: <span class="info-duration">${duration} mins</span></div>`)
}

// $('.input-container').hover('#place-input', function(){
//     $('.desc').css('display','block')
// });

$('.input-container').hover(
    function(){
    $('.desc').css('display','block');
}, function(){
    $('.desc').css('display','none');
})

function disableInput(){
    $('input[name=type]').prop("disabled", true);
}

function deleteRouteIndex(index){
    $(`.route-${index}`).on('click','.delete-button', function(event){
        event.delegateTarget($(`.route-${index}`).remove())
    });
}


