function insertAllControlButtons()
{
    //--------------
    //this is trash
    //createCenterButton();
    //--------------
    createMainSidebar();
}
let searchbar;
searchbar=document.createElement("div");
searchbar.innerHTML=
    "<div class=\"flex justify-center mt-2\">\n" +
    "  <div class=\"mb-3 w-auto h-auto\">\n" +
    "    <input\n" +
    "      type=\"search\" oninput=\"updateSearchbarQuery(this.value)\" \n" +
    "      class=\"relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-1.5 text-base font-normal text-white outline-none transition duration-300 ease-in-out focus:border-primary-600 focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-gray-50\"\n" +
    "      id=\"exampleSearch\"\n" +
    "      placeholder=\"Type query\" />\n" +
    "  </div>\n" +
    "</div>";
function createMainSidebar()
{
    //NOTE THAT document.innerHTML exists

    var dropdown2 = document.createElement("div");
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
                            "      id=\"flexSwitchCheckDefault\" />\n" +
                            "    <label\n" +
                            "      class=\"inline-block pl-[0.15rem] hover:cursor-pointer\"\n" +
                            "      for=\"flexSwitchCheckDefault\"\n" +
                            "      >Default switch checkbox input</label\n" +
                            "    >\n" +
                                searchbar.innerHTML+
                            "  </div>\n" +
                            "</div>"+
        "             </div>\n" +
        "           </div>\n" +
        "         </div>\n";
    map.controls[google.maps.ControlPosition.LEFT_CENTER].push(dropdown2);

}

let a,responses=[];
function initResponses()
{
    fetch("http://localhost/destinations.json")
        .then(response => response.json())
        .then(json => {
            //console.log(json);
             a = Array(json.destinations.length);
            //let responses = [];
            for (let i = 0; i < json.destinations.length; i++) {
                let e = document.createElement("div");
                e.innerHTML =
                    "<div>\n" +
                    "        <p>" + json.destinations[i].name + "</p>\n" +
                    "</div>"
                responses.push(e);
            }
        })
}

function updateSearchbarQuery(token)
{
    let root=document.getElementById("search");

    fetch("http://localhost/destinations.json")
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

}

//trash looking button
function createCenterButton()
{
    const centerControl = document.createElement("button");
    centerControl.classList.add("rounded-full","text-xl","p-3","culoare","drop-shadow-md","mt-3");
    centerControl.textContent = "Center Map";
    centerControl.title = "Click to recenter the map";

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControl);
    centerControl.addEventListener("click", () => {
        map.setCenter(start);
    });
}

initResponses();