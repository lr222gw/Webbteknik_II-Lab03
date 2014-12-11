<?php
/**
 * Created by PhpStorm.
 * User: Lowe
 * Date: 2014-12-10
 * Time: 20:26
 */


if(getJsonTimeStamp() < time()){ //Nya cachening
    $url = "http://api.sr.se/api/v2/traffic/messages?format=json";
    $arr = [];
    do{
        $contentFromSR = file_get_contents($url);
        //$contentFromSR = json_encode($contentFromSR);
        $contentFromSRDecoded = json_decode($contentFromSR);

        if(count($arr) >= 100){ // om vi redan har 100 poster eller mer så ska vi avbryta..
            break;
        }

        for($i=0; $i < count($contentFromSRDecoded->messages); $i++){
            array_push($arr, $contentFromSRDecoded->messages[$i]);  // Lägger in datan i en array så att vi har all data samlad där
        }

        $url = $contentFromSRDecoded->pagination->nextpage; //Kollar om det finns en till sida att hämta data från

    }while($url != null);


    $out = array_values($arr);
    $toReturn = json_encode($out);
    JsonToFile($toReturn);

    /*    $_SESSION["cachedDataTimer"] = time() + (60 * 25); //Cachat i 25 minuter
        $_SESSION["cachedData"] = $out;*/
//$arr = json_decode($arr);
    /*}else{
        $out = $_SESSION["cachedData"];
    }*/

}

echo GetJsonFileData();

function JsonToFile($jsonData){
    $timeToCache = time() + (60 * 25); //cachar i 25 minuter
    $fp = fopen("timeStamp.txt", "w");
    fwrite($fp, $timeToCache);
    fclose($fp);

    $tester = "yolo";
    $fp = fopen("newstamp.txt", "w");
    fwrite($fp, $tester);
    fclose($fp);

    $fp = fopen("cachedJson.json", "w");
    fwrite($fp, $jsonData);
    fclose($fp);
}
function getJsonTimeStamp(){
    $timestamp = file_get_contents("timeStamp.txt");
    return (int)$timestamp;
}
function GetJsonFileData(){
    $json = file_get_contents("cachedJson.json");
    return $json;
}