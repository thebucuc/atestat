let responseData=null;
let start={lat:46.684609,lng: 27.747267},
    end = {lat: 46.647368534350484, lng:27.747928991790555};
let directionsService,directionsRendererWalking,directionsRendererWalking2,directionsRendererDriving,map;

let ld=require('@googlemaps/js-api-loader');
let clone;
//let geometry=require('google.maps.GeometryLibrary');
const apiOptions = {
    apiKey: "-",
    libraries: ["geometry"],
}
const loader = new ld.Loader(apiOptions);

loader.load().then(() => {
    console.log('Maps JS API Loaded');
})
    .then(() => {
        initMap();
        //spherical=google.maps.geometry.spherical;
    });
//const {spherical} = await google.maps.importLibrary("geometry");
let dest=require('./destinations.json');
var maps;
let searchbar,search,responses=[],d;
let linie;
class station {
    constructor(name,lat,lng)
    {
        this.name=name;
        this.lat=lat;
        this.lng=lng;
    }
}
class finalRoute{
    startstation=new station();
    endstation=new station();
    constructor(start, end, routenum){
        this.start={lat:start.lat,lng:start.lng};
        this.end={lat:end.lat,lng:end.lng};
        this.routenum=routenum;
    }
    FindClosestStartStation(nrroute){
        let min=10000000;
        let minindex=0;
        for(let i=0;i<dest.stations.length;i++)
        {
            for(let j=0;j<nrroute.length;j++)
                if(dest.stations[i].routes.includes(nrroute[j])) {
                    console.log("yahhoaoaoasdasdsa");
                    let dist = google.maps.geometry.spherical.computeDistanceBetween(
                        {lat: this.start.lat, lng: this.start.lng},
                        {lat: parseFloat(dest.stations[i].lat), lng: parseFloat(dest.stations[i].lng)});
                    if (dist < min) {
                        min = dist;
                        minindex = i;
                    }
                }
        }
        this.startstation=new station(dest.stations[minindex].name,parseFloat(dest.stations[minindex].lat)
            ,parseFloat(dest.stations[minindex].lng));
        return minindex;
    }
    FindClosestEndStation(){
        let min=10000000;
        let minindex=0;
        for(let i=0;i<dest.stations.length;i++)
        {
            let dist=google.maps.geometry.spherical.computeDistanceBetween(
                {lat:this.end.lat,lng:this.end.lng},
                {lat:parseFloat(dest.stations[i].lat),lng:parseFloat(dest.stations[i].lng)});
            //console.log(dist);
            if(dist<min)
            {
                min=dist;
                minindex=i;
            }
        }
        this.endstation=new station(dest.stations[minindex].name,parseFloat(dest.stations[minindex].lat)
            ,parseFloat(dest.stations[minindex].lng));
        return minindex;
    }
    DrawRoute(){

        let y=this.FindClosestEndStation();
        let x=this.FindClosestStartStation(dest.stations[y].routes);
        if(x>y) [x,y]=[y,x];
        clone=new google.maps.DirectionsRenderer();
        console.log(x,y,this.startstation.name,this.endstation.name);
        let waypts=[];

        let request = {
            origin: this.start,
            destination: {lat:this.startstation.lat,lng:this.startstation.lng},
            travelMode: 'WALKING',
        };


        directionsService.route(request, function (result, status) {
            if (status === 'OK') {
                directionsRendererWalking.setDirections(result);
            }
        });
        for(let i=x+1;i<y;i++)
        {
            for(let j=0;j<dest.stations[i].routes.length;j++)
                if(dest.stations[i].routes.includes(dest.stations[x].routes[j])) {
                    waypts.push({
                        location:
                            {
                                lat: parseFloat(dest.stations[i].lat),
                                lng: parseFloat(dest.stations[i].lng)
                            },
                        stopover: true
                    });
                    break;
                }
        }
        let request2 = {
            origin: {lat:this.startstation.lat,lng:this.startstation.lng},
            destination: {lat:this.endstation.lat,lng:this.endstation.lng},
            waypoints: waypts,
            optimizeWaypoints: true,
            //provideRouteAlternatives: true,
            travelMode: 'WALKING',
        };
        directionsService.route(request2, function (result, status) {
            if (status === 'OK') {
                directionsRendererDriving.setDirections(result);
            }
        });
        let request3 = {
            origin: {lat:this.endstation.lat,lng:this.endstation.lng},
            destination: this.end,
            travelMode: 'WALKING',
        };
        directionsService.route(request3, function (result, status) {
            if (status === 'OK') {
                directionsRendererWalking2.setDirections(result);
                console.log("dun");
            }
        });

    }
}

function fetchData() {
    console.log('help');
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
function initMap() {

    const procoloco={ lat: 46.64268725956498, lng: 27.71892655823447 };
    map = new google.maps.Map(document.getElementById("map"), {
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
    directionsRendererDriving = new google.maps.DirectionsRenderer({
        preserveViewport:true,
        //suppressMarkers: true
    });
    directionsRendererWalking= new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
            strokeColor: 'red'
        },
        preserveViewport:true
        });
    directionsRendererWalking2= new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
            strokeColor: 'red'
        },
        preserveViewport:true
    });

    directionsRendererWalking.setMap(map);
    directionsRendererWalking2.setMap(map);
    directionsRendererDriving.setMap(map);
    addMarkers();
    insertAllControlButtons(map);

}
function addMarkers() {

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

    const markerstart = new google.maps.Marker({
        position: {lat:46.64425453090651,lng:27.736381564612703},
        draggable: false,
        map:map,
        title: "start",
    });
    const markerend = new google.maps.Marker({
        position: end,
        draggable: true,
        map:map,
        title: "end",
    });

    linie=new finalRoute(
        {lat:markerstart.getPosition().lat(),lng:markerstart.getPosition().lng()},
        {lat:markerend.getPosition().lat(),lng:markerend.getPosition().lng()},
        1);

    markerstart.addListener("dragend", () => {
        linie.start.lng=markerstart.getPosition().lng();
        linie.start.lat=markerstart.getPosition().lat();
        linie.DrawRoute();
        x.innerText="Inceputul liniei: "+linie.startstation.name+ "\nSfarsitul liniei: " +linie.endstation.name;
        map.setZoom(15);
    });
    markerend.addListener("dragend", () => {
        linie.end.lat=markerend.getPosition().lat();
        linie.end.lng=markerend.getPosition().lng();
        linie.DrawRoute();
        x.innerText="Inceputul liniei: "+linie.startstation.name+ "\nSfarsitul liniei: " +linie.endstation.name;
        map.setZoom(15);
    });

}
function calculateRoute(index, responseData) {
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
            directionsRendererWalking.setDirections(result);
        }
    });
    console.log(directionsRendererWalking);
}
function onRouteChange() {
    let e = document.getElementById("selector");
    let str = e.options[e.selectedIndex].value;
    fetchData().then((responseData) => calculateRoute(str-1, responseData));

}
function insertAllControlButtons(map) {
    //console.log("what the fuck");
    maps=map;
    createMainSidebar();
    insertRouteDetails();
    //search.addEventListener("input",updateSearchbarQuery);
    //console.log(search);

}

let dropdown2;
let x=document.createElement("p");
let a=document.createElement("div");
function insertRouteDetails()
{
    a.classList+=" fixed top-0 left-0 rounded-lg z-20 w-64 h-auto culoare text-white text-lg shadow-lg ml-4 mt-3 p-4";
    a.appendChild(x);
    x.innerText="Inceputul liniei: "+ "\nSfarsitul liniei: ";
    x.classList+=" p-2";
    maps.controls[google.maps.ControlPosition.LEFT_TOP].push(a);
}
function createMainSidebar() {
    //NOTE THAT document.innerHTML exists

    dropdown2 = document.createElement("div");
    dropdown2.innerHTML="<div class=\"flex \">\n" +
        "           <input type=\"checkbox\" id=\"drawer-toggle\" class=\"relative sr-only peer\" checked>\n" +
        "           <label for=\"drawer-toggle\" class=\"fixed top-0 left-0 inline-block p-2 transition-all duration-500 bg-blue-500 rounded-lg peer-checked:rotate-180 peer-checked:left-64 ml-4 mt-3\">\n" +
        "               <div class=\"w-1 h-1 mb-3 -rotate-45 bg-white rounded-lg\"></div>\n" +
        "               <div class=\"w-1 h-1 rotate-45 bg-white rounded-lg\"></div>\n" +
        "\n" +
        "\n" +
        "           </label>\n" +
        "           <div class=\"fixed top-0 left-0 rounded-lg z-20 w-64 h-auto transition-all duration-500 transform -translate-x-full culoare text-white shadow-lg peer-checked:translate-x-0 ml-4 mt-3\">\n" +
        "             <div class=\"px-6 py-4\">\n" +
        "               <h2 class=\"text-lg\">Discover Vaslui</h2>\n" +
        "               <p class=\"\">This is a drawer.</p>\n" +
        "<div id=\"search\" class=\"flex flex-col justify-center\">\n" +
        "  <div>\n" +
        "    <input\n" +
        "      class=\"mt-2 mr-2 h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-blue-400 checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary\"\n" +
        "      type=\"checkbox\"\n" +
        "      role=\"switch\"\n  id=\"default-checkbox\" " +
        "      id=\"flexSwitchCheckDefault\" onclick=\"insertRouteDetails()\">\n" +
        "    <label\n" +
        "      class=\"inline-block pl-[0.15rem] hover:cursor-pointer\"\n" +
        "      for=\"flexSwitchCheckDefault\"\n" +
        "      >Default switch checkbox input</label\n" +
        "    >\n" +
        //searchbar.innerHTML+
        "  </div>\n" +
        "</div>"+
        "             </div>\n" +
        "           </div>\n" +
        "         </div>\n";
    //maps.controls[google.maps.ControlPosition.LEFT_CENTER].push(dropdown2);


}
function initResponses() {
    /*
        fetch("http://localhost/destinations.json" ,{mode: 'no-cors'})
        .then(response => response.json())
        .then(data => {
            for (i = 0; i < data.destinations.length; i++) {
                let e = document.createElement("div");
                d = {lat: parseFloat(destinations[i].lat), lng: parseFloat(data.destinations[i].lng)};
                e.innerHTML =
                    "<div class=\"py-1 text-black\">\n" +
                    "        <p class=\"text-black\">" + data.destinations[i].name + "</p>\n" +
                    "<button onclick=\"centerOnDestination("+i+")\" class=\"bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-full\">\n" +
                    "  Add to Route\n" +
                    "</button>\n"+
                    "</div>\n";
                //console.log(data);
                responses.push(e);
            }
        })*/
    for (let i = 0; i < dest.length; i++) {
        let e = document.createElement("div");
        d = {lat: parseFloat(dest[i].lat), lng: parseFloat(dest[i].lng)};
        e.innerHTML =
            "<div class=\"py-1 text-black\">\n" +
            "        <p class=\"text-black\">" + dest[i].name + "</p>\n" +
            "<button onclick=\"centerOnDestination("+i+")\" class=\"bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-full\">\n" +
            "  Add to Route\n" +
            "</button>\n"+
            "</div>\n";
        //console.log(data);
        responses.push(e);
    }
}
function updateSearchbarQuery(token) {
    let root=search;
    /*
    fetch("http://localhost/destinations.json",{mode: 'no-cors'})
        .then(response => response.json())
        .then(json =>
        {
            //console.log(responses);
            for(let i=0;i<json.destinations.length;i++)
            {
                let elements = json.destinations[i].name.toLowerCase();
                if(elements.includes(token.toLowerCase()) && token!='')
                    root.append(responses[i]);
                else responses[i].remove();
                //console.log(elements);
            }
        });
        */
    token=search.value;
    console.log(token);
    for(let i=0;i<dest.length;i++)
    {
        let elements = dest[i].name.toLowerCase();
        if(elements.includes(token.toLowerCase()) && token!='')
            root.append(responses[i]);
        else responses[i].remove();
        //console.log(elements);
    }


}
function centerOnDestination(destinationData) {
    //console.log(parseFloat(destinationData.lat));
    fetch("http://localhost/destinations.json")
        .then(response => response.json())
        .then(data=> {

            maps.setCenter(new google.maps.LatLng(parseFloat(data.destinations[destinationData].lat)
                , parseFloat(data.destinations[destinationData].lng)));
        })
}

//trash looking button
searchbar=document.createElement("div");
search=document.createElement("input");
search.innerHTML=
    "    <input\n" +
    "      type=\"search\" \n" +
    "      class=\"relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-1.5 text-base font-normal text-black outline-none transition duration-300 ease-in-out focus:border-primary-600 focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-gray-50\"\n" +
    "      id=\"searche\"\n" +
    "      placeholder=\"Type query\" />\n";

searchbar.innerHTML=
    "<div class=\"flex justify-center mt-2\">\n" +
    "  <div class=\"mb-3 w-auto h-auto\">\n" +
    search.innerHTML+
    "  </div>\n" +
    "</div>";
initResponses();

//module.exports = {insertAllControlButtons,initResponses,updateSearchbarQuery};




