//fisierul json cu rutele
let responseData=null;
let start={lat:46.64333225279801,lng: 27.719046965119666};
//46.64268725956498, 27.71892655823447
let end = {lat: 46.647368534350484, lng:27.747928991790555};
let directionsService;
let directionsRenderer;
let map;


function fetchData() {
    return fetch('http://localhost/routes.json')
        .then(response => response.json())
        .then(data => {
            // assign data to global variable
            responseData = data;

            // return data to continue Promise chain
            return data;
        })
        .catch(error => console.error(error));
}

fetchData()
    .then(data => {
        // use responseData variable here, after fetchData() has completed
        console.log(responseData);
    })
    .then(

    )
    .catch(error => console.error(error));

function initMap() {

    const procoloco={ lat: 46.64268725956498, lng: 27.71892655823447 };
    map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: procoloco, // proco loco.
        disableDefaultUI: true,
        styles: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]}
            ,{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]}
            ,{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},
            {"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry",
            "stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}]
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    map.addListener("resize", () => { map.getViewPort().resize();});
    addMarkers();

}
function addMarkers()
{

    const contentString =
        '<div id="content">' +
        '<div id="siteNotice">' +
        "</div>" +
        '<h1 id="firstHeading" class="firstHeading">Proco Loco</h1>' +
        '<div id="bodyContent">' +
        "<p><b>Liceul Stefan Procopiu</b>, cunoscut ca si <b>la vale la ventilatoare</b>, este habitatul " +
        "natural al oamenilor care tin tara in picioare </p>" +
        "<p>sursa: trust me bro </p>" +
        "</div>" +
        "</div>";
    const infowindow = new google.maps.InfoWindow({
        content: contentString,
        ariaLabel: "Uluru",
    });
    const marker = new google.maps.Marker({
        position: start,
        map,
        title: "procoloco",
    });

    marker.addListener("click", () => {
        infowindow.open({
            anchor: marker,
            map,
        });
    });

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
function calculateRoute(index, responseData)
{
    const waypts=[];
    for(let i=0;i<responseData.routes[index].waypoints.length;i++)
        waypts.push(
            {
                location:
                    {
                        lat:parseFloat(responseData.routes[index].waypoints[i].lat),
                        lng:parseFloat(responseData.routes[index].waypoints[i].lng
                        )},
                stopover: false
            });
    const start = new google.maps.LatLng(parseFloat(responseData.routes[index].startlat),
        parseFloat(responseData.routes[index].startlng));
    const end = new google.maps.LatLng(parseFloat(responseData.routes[index].endlat),
        parseFloat(responseData.routes[index].endlng));
    let request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING',
        optimizeWaypoints: true,
        waypoints: waypts
    };
    directionsService.route(request, function (result, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
        }
    });
    console.log(directionsRenderer);
}

function onRouteChange()
{

    let e = document.getElementById("selector");
    let str = e.options[e.selectedIndex].value;
    fetchData().then((responseData) => calculateRoute(str-1, responseData));

}

window.initMap = initMap;





