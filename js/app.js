/**
 * Created by Lowe on 2014-12-10.
 */
"use strict";



var AppSpace = {
    map : "",
    xmlHttp : "",
    arrOfMarkerWithInfoObj : [],
    lastOpenWindow: null,
    allMarkers : [],
    Init : function(){

        AppSpace.xmlHttp = new XMLHttpRequest();

        var mapOptions = {
            zoom: 3,
            center: new google.maps.LatLng(62.907650053064756, 19.05371625649899),
            mapTypeId : google.maps.MapTypeId.ROADMAP //Vilken typ av karta, satelite, väg, etc... ||TERRAIN, SATTELITE
        };


        AppSpace.map = new google.maps.Map(
            document.getElementById('map-canvas'),
            mapOptions);


    },

    categoryToWord : function(category){
        switch (category){
            case 0:
                return "Vägtrafik";
                break;
            case 1:
                return "Kollektivtrafik"
                break;
            case 2:
                return "Planerad Störning";
                break;
            case 3:
                return "Övrigt";
                break;
            default :
                return null;
                break;
        }
        return null;
    },

    MarkByPosition : function(lat, lng, infoForWindow,id, obj){
        var infoWindowOptions = { // Inställningar för infoWindow-objektet
            content : "<h2>"+obj.title+"</h2><h3>"+AppSpace.categoryToWord(obj.category)+"</h3><p>"+new Date(parseInt(obj.date.slice(6,obj.date.length -2)))+"</p>"+infoForWindow,     // Innehållet i InfoWindow... (hämtas från parametern..)
            disableAutoPan : true
        }

        var infoWindow = new google.maps.InfoWindow(infoWindowOptions); // Skapar InfoWindow med innehållet från InfoWindowOptions

        var markerOptions = { //Inställningar för markern, positionen (hämtas från parametern..)
            position : new google.maps.LatLng(lat, lng)
        }
        var marker = new google.maps.Marker(markerOptions); //Här skapas Markern med innehållet från MarkerOptions
        marker.id = id;
        marker.setMap(AppSpace.map); //Vi säger at markern ska tillhöra kartan AppSpace.map
        AppSpace.allMarkers.push(marker);

        //Kontrollerar om en markers infoWindow var öppen, om den var det så ska den öppnas igen.
        //Om den vad öppen, men inte finns på nuvarande karta så ska den stängas.
        if(AppSpace.lastOpenWindow != null){
            if(AppSpace.findIfActive()){
                //AppSpace.lastOpenWindow.gm_bindings_.disableAutoPan =  {disableAutoPan : true}; <-Duze Nuts Wurkz... :(
                AppSpace.lastOpenWindow.open(AppSpace.map,AppSpace.lastUsedMarker); //Öppna rutan om den finns på kartan och var öppen innan uppdatering...
            }else{
                AppSpace.lastOpenWindow.close(); //Stänger ner rutan om den inte finns på kartan
            }
        }


        var listButton = AppSpace.PlaceInList(obj);

        var doWhenPressed = function(){ //Funktion som anropas när en markera trycks på!
            //stänger ett tidigare öppet fönster...
            if(AppSpace.lastOpenWindow != null){
                AppSpace.lastOpenWindow.close();
            }
            infoWindow.open(AppSpace.map, marker); // funktionen öppnar infoWindow till en viss marker.
            // På något magiskt sätt så kommer markerna ihåg vilken infoWindow som hör till dem...

            AppSpace.lastUsedMarker = marker;
            AppSpace.lastOpenWindow = infoWindow; // kommer ihåg det senaste fönstret så at det kan stängas när nytt öppnas..
        }

        listButton.onclick = function(){doWhenPressed();};
        google.maps.event.addListener(marker,'click', doWhenPressed);



    },

    getNewestTraficInfo : function(){
        /*var nut = false;
        if(localStorage["jsonDataTimeStamp"] == undefined){
            nut = true;
        }*/

        //if(parseInt(localStorage["jsonDataTimeStamp"]) <= new Date().getTime() || nut){ //cachening mot LocalStorage

            var handleServerResponse = function(){ // körs varje gång ett anrops slutförst med send()...
                if(AppSpace.xmlHttp.readyState == 4){ // Om state är 4 så är objetket klart med kommunikationen

                    if(AppSpace.xmlHttp.status == 200){ // Om 200 s betyder det att kommunikationen gick bra!
                        //var Response = AppSpace.xmlHttp.responseText; // Response kommer att innehålla datan från anropet i JSON-format
                        //AppSpace.xmlHttp.responseText = Response;
                        //localStorage["jsonData"] = AppSpace.xmlHttp;//JSON.stringify(AppSpace.xmlHttp);
                        //localStorage["jsonDataTimeStamp"] = new Date().getTime() + (4000 );//* 25);
                        //console.log(Response);
                        //return Response;
                        //AppSpace.buildFromData();
                        AppSpace.sorter(); //efter datan hämtas, kör ett anrop.
                        setTimeout(AppSpace.getNewestTraficInfo, 3000); //Berättar att vi väntar 3 sekunder tills vi anropar funktionen igen om det inte fungerade
                    }//OBS^ ska inte skrivas med strängar. Och inte ()... (annars drar den igång en ny instans av javascript)
                }
            }

            //if(AppSpace.xmlHttp.readyState == 4 || AppSpace.xmlHttp.readyState == 0){ // Kollar om objektet är redo för kommunikation

                AppSpace.xmlHttp.open("GET", "SRTrafic.php",true);          //Förbereder: Php-filen SRTrafic kommer att anropas...
                AppSpace.xmlHttp.onreadystatechange = handleServerResponse;// Berättar vilken funktion som ska köras när man får response tillbaka från servern.
                AppSpace.xmlHttp.send(null);                              // Slutför anropet....

            //}
        /*}else{
            AppSpace.xmlHttp = JSON.parse(localStorage["jsonData"]);
        }*/

    },

    clearMap : function(){
        if(AppSpace.allMarkers != null){
            for (var i = 0; i < AppSpace.allMarkers.length; i++ ) {
                AppSpace.allMarkers[i].setMap(null);
            }
            AppSpace.allMarkers.length = 0;
        }
        document.getElementById("traficInfoList").innerText = "";
    },

    findIfActive : function(){
        if(AppSpace.allMarkers != null){
            for (var i = 0; i < AppSpace.allMarkers.length; i++ ) {
                if(AppSpace.allMarkers[i].id == AppSpace.lastUsedMarker.id){
                    return true;
                }
            }
        }
        return false;
    },

    sorter : function(){
        //När knappen för uppdatering tryck hämtas datan från cache, här sorteras datan och tar bara fram vad användaren valt att se
        AppSpace.clearMap();

        //AppSpace.getNewestTraficInfo();

        var arrOfMessages = JSON.parse(AppSpace.xmlHttp.response); //AppSpace.xmlHttp.response;
        var include = [];
        var choice = null;
        switch (document.getElementById("showBy").value){
            case "Alla":
                choice = -1;
                break;
            case "Vagtrafik":
                choice = 0;
                break;
            case "Kollektivtrafik":
                choice = 1;
                break;
            case "PlaneradStorning":
                choice = 2;
                break;
            case "Ovrigt":
                choice = 3;
                break;
            default :
                choice = -1;
                break;
        }

        var idExist = false;
        for(var i = 0; i < arrOfMessages.length;i++){
            if(arrOfMessages[i].category == choice || choice == -1){
                idExist = false;
                //en extra forloop för att kontrollera att samma Id inte används fler gånger = meddelandet visas fler gånger..
                for(var j = 0; j < include.length; j++){


                    if(include[j].id == arrOfMessages[i].id){
                        idExist = true;

                    }
                }
                if(idExist == false){
                    include.push(arrOfMessages[i]);
                }
            }
        }
        AppSpace.buildFromData(include.reverse());
    },

    buildFromData : function(arrOfMessages){


        for(var i = 0; i < arrOfMessages.length;i++){
           AppSpace.arrOfMarkerWithInfoObj = [new MarkerWithInfo(
                arrOfMessages[i].latitude,
                arrOfMessages[i].longitude,
                arrOfMessages[i].exactlocation,
                arrOfMessages[i].description,
                arrOfMessages[i].title,
                arrOfMessages[i].createddate,
                arrOfMessages[i].category,
                arrOfMessages[i].subcategory,
                arrOfMessages[i].priority,
                arrOfMessages[i].id).place()];


        }
    },
    PlaceInList : function(markerWithInfoObj){
        var listcontainer = document.getElementById("traficInfoList");

        var div = document.createElement("div");
        var title = document.createElement("h4");
        var place = document.createElement("p");
        var date = document.createElement("p");

        div.className="listclass";
        title.innerText = markerWithInfoObj.title;
        place.innerText = markerWithInfoObj.exactLocation;
        date.innerText =  new Date(parseInt((markerWithInfoObj.date.slice(6,markerWithInfoObj.date.length -2)))); // (?) finns det bättre lösning?

        div.appendChild(title);
        div.appendChild(place);
        div.appendChild(date);
        listcontainer.appendChild(div);

        return div;


    }

};

//Min klass med allt som har med markern och infon att göra...
var MarkerWithInfo = function(lat, lng, exactLocation, description, title, date, category, subcategory, priority, id){
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.exactLocation = exactLocation;
    this.description = description;
    this.title = title;
    this.date = date;
    this.category = category;
    this.subcategory = subcategory;
    this.priority = priority;

    this.place = function(){
        AppSpace.MarkByPosition(this.lat,this.lng,this.description, this.id, this);
    }
}

document.getElementById("showByButton").onclick = function(){AppSpace.sorter(); };

window.onload = function(){

    AppSpace.Init();
    AppSpace.getNewestTraficInfo();
};

