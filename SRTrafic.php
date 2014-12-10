<?php
/**
 * Created by PhpStorm.
 * User: Lowe
 * Date: 2014-12-10
 * Time: 20:26
 */

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
//$arr = json_decode($arr);


echo json_encode($out);

