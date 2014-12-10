/**
 * Created by Lowe on 2014-12-10.
 */
"use strict";



var AppSpace = {
    map : "",
    xmlHttp : "",
    Init : function(){

        AppSpace.xmlHttp = new XMLHttpRequest();

        var mapOptions = {
            zoom: 8,
            center: new google.maps.LatLng(0, 0),
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

        google.maps.event.addListener(marker,'click',function(){ //Funktion som anropas när en markera trycks på!
           infoWindow.open(AppSpace.map, marker); // funktionen öppnar infoWindow till en viss marker.
            // På något magiskt sätt så kommer markerna ihåg vilken infoWindow som hör till dem...
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
                    console.log(Response);
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

    }

};


window.onload = function(){

    AppSpace.Init();
    AppSpace.getNewestTraficInfo();
};

