<?php
    $zip = $_GET["zip"];
    if (zip != null) {
        $ch = curl_init();
        curl_setopt_array(
            $ch, array(
                CURLOPT_URL => 'http://www.zillow.com/webservice/GetDemographics.htm?zws-id=X1-ZWz1b7dsa5g3yj_3pg0i&zip=' . $zip,
                CURLOPT_RETURNTRANSFER => true
        ));
        
        $output = curl_exec($ch);
        echo $output;
    }
?>