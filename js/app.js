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

    MarkByPosition : function(lat, lng, infoForWindow){
        var infoWindowOptions = { // Inställningar för infoWindow-objektet
            content : infoForWindow     // Innehållet i InfoWindow... (hämtas från parametern..)
        }

        var infoWindow = new google.maps.InfoWindow(infoWindowOptions); // Skapar InfoWindow med innehållet från InfoWindowOptions

        var markerOptions = { //Inställningar för markern, positionen (hämtas från parametern..)
            position : new google.maps.LatLng(lat, lng)
        }
        var marker = new google.maps.Marker(markerOptions); //Här skapas Markern med innehållet från MarkerOptions
        marker.setMap(AppSpace.map); //Vi säger at markern ska tillhöra kartan AppSpace.map
        AppSpace.allMarkers.push(marker);
        google.maps.event.addListener(marker,'click',function(){ //Funktion som anropas när en markera trycks på!
            //stänger ett tidigare öppet fönster...
            if(AppSpace.lastOpenWindow != null){
                AppSpace.lastOpenWindow.close();
            }
            infoWindow.open(AppSpace.map, marker); // funktionen öppnar infoWindow till en viss marker.
            // På något magiskt sätt så kommer markerna ihåg vilken infoWindow som hör till dem...

            AppSpace.lastOpenWindow = infoWindow; // kommer ihåg det senaste fönstret så at det kan stängas när nytt öppnas..
        });

    },

    handleJSONData : function($JsonData){
        $JsonData;
    },

    getNewestTraficInfo : function(){

        var handleServerResponse = function(){ // körs varje gång ett anrops slutförst med send()...
            if(AppSpace.xmlHttp.readyState == 4){ // Om state är 4 så är objetket klart med kommunikationen

                if(AppSpace.xmlHttp.status == 200){ // Om 200 s betyder det att kommunikationen gick bra!
                    var Response = AppSpace.xmlHttp.responseText; // Response kommer att innehålla datan från anropet i JSON-format
                    //console.log(Response);
                    //return Response;
                    //AppSpace.buildFromData();
                }

            }
        }


        if(AppSpace.xmlHttp.readyState == 4 || AppSpace.xmlHttp.readyState == 0){ // Kollar om objektet är redo för kommunikation

            AppSpace.xmlHttp.open("GET", "SRTrafic.php",true);          //Förbereder: Php-filen SRTrafic kommer att anropas...
            AppSpace.xmlHttp.onreadystatechange = handleServerResponse;// Berättar vilken funktion som ska köras när man får response tillbaka från servern.
            AppSpace.xmlHttp.send(null);                              // Slutför anropet....

        }else{
            setTimeout('AppSpace.getNewestTraficInfo()', 3000); //Berättar att vi väntar 3 sekunder tills vi anropar funktionen igen om det inte fungerade
        }

    },

    clearMap : function(){
        if(AppSpace.allMarkers != null){
            for (var i = 0; i < AppSpace.allMarkers.length; i++ ) {
                AppSpace.allMarkers[i].setMap(null);
            }
            AppSpace.allMarkers.length = 0;
        }
    },

    sorter : function(){

        AppSpace.clearMap();

        var arrOfMessages = JSON.parse(AppSpace.xmlHttp.response);
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
        for(var i = 0; i < arrOfMessages.length;i++){
            if(arrOfMessages[i].category == choice || choice == -1){
                include.push(arrOfMessages[i]);
            }
        }
        AppSpace.buildFromData(include);
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
                arrOfMessages[i].priority).place()];


        }
    }

};

//Min klass med allt som har med markern och infon att göra...
var MarkerWithInfo = function(lat, lng, exactLocation, description, title, date, category, subcategory, priority){
    this.lat = lat;
    this.lng = lng;
    this.exactLocation = exactLocation;
    this.description = description;
    this.description = description;
    this.title = title;
    this.date = date;
    this.category = category;
    this.subcategory = subcategory;
    this.priority = priority;

    this.place = function(){
        AppSpace.MarkByPosition(this.lat,this.lng,this.description);

    }
}

document.getElementById("showByButton").onclick = function(){AppSpace.sorter(); };

window.onload = function(){

    AppSpace.Init();
    AppSpace.getNewestTraficInfo();
};

