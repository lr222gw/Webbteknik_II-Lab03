<?php
header("Access-Control-Allow-Origin: *");


$ret = "
<!DOCTYPE html>
<html>
<head lang='en'>
    <meta charset='UTF-8''>
    <title>Labb 3</title>
    <link rel='stylesheet' href='css/style.css'>

</head>
<body>


<div id='map-canvas''></div>

<script src='//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js'></script>
<script src='http://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyABBh9HjjKGhaYj5fh_8PmBShHKRsmvsPA&sensor=FALSE&language=se'></script>
<script src='js/app.js'></script>
</body>
</html>
";

echo $ret;