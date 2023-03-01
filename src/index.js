let start={lat:46.64333225279801,lng: 27.719046965119666};
//46.64268725956498, 27.71892655823447
let end = {lat: 46.647368534350484, lng:27.747928991790555};
let directionsService;
let directionsRenderer;
let map;
function initMap() {
    const procoloco={ lat: 46.64268725956498, lng: 27.71892655823447 };
    map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: procoloco, // proco loco.
    });
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    calcRoute1();
}
/*
-----------------------------------------------
-------MAY BE USEFUL IN THE FUTURE------------
----------------------------------------------
function computeTotalDistance(result) {
    let total = 0;
    const myroute = result.routes[0];

    if (!myroute) {
        return;
    }

    for (let i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
    }

    total = total / 1000;
    document.getElementById("total").innerHTML = total + " km";
}

 */
function calcRoute1() {
    let start={lat:46.64333225279801,lng: 27.719046965119666};
    let end = {lat: 46.647368534350484, lng:27.747928991790555};
    const waypts=[];
    waypts.push({location:{lat:46.63687946991397, lng:27.725226774689794}, stopover: true})
    waypts.push({location:{lat:46.630101745765636, lng:27.73462523507763}, stopover: false})
    waypts.push({location: {lat:46.63767505989159, lng:27.73874510812407},
                stopover:true});
    let request = {
        origin: start,
        destination:end,
        travelMode: 'DRIVING',
        optimizeWaypoints: true,
        provideRouteAlternatives:true,
        waypoints: waypts
    };
    directionsService.route(request, function(result, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
        }
    });
}
function routeChangeTest()
{
    let e = document.getElementById("selector");
    let str = e.options[e.selectedIndex].value;
    if(str===1)
        calcRoute1();
    else {
        let start = {lat: 46.674914738520656, lng: 27.741164460646697};
        let end = {lat: 46.634043243350995, lng: 27.733819231258618};
        const waypts = [];
        waypts.push({location: {lat: 46.647931969882755, lng: 27.737316831814788}, stopover: true})
        waypts.push({location: {lat: 46.64884892008684, lng: 27.727274641262685}, stopover: false})

        let request = {
            origin: start,
            destination: end,
            travelMode: 'DRIVING',
            optimizeWaypoints: true,
            provideRouteAlternatives: true,
            waypoints: waypts
        };
        directionsService.route(request, function (result, status) {
            if (status === 'OK') {
                directionsRenderer.setDirections(result);
            }
        });
    }
}
window.initMap = initMap;


