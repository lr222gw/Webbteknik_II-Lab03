/**
 * Created by Lowe on 2014-12-10.
 */
"use strict";



var AppSpace = {

    Init : function(){
        var map;

        var mapOptions = {
            zoom: 8,
            center: new google.maps.LatLng(0, 0)
        };



        map = new google.maps.Map(
            document.getElementById('map-canvas'),
            mapOptions);

    }



};


window.onload = function(){

    AppSpace.Init();
};

