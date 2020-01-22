<?php
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');
    }
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");         

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }

    define('DB_HOST', 'localhost');
    define('DB_USER', 'bolya_eu_5');
    define('DB_PASS', 'password');
    define('DB_NAME', 'bolya_eu_db_5');

    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS,DB_NAME);
    if ($conn->connect_error) {
        http_response_code(404);
        die("Connection failed: " . $conn->connect_error);
    }

    $conn->set_charset("utf8");

    if ($_GET['action']=='save_datas'){
        $sql='insert into properties (id,vibe,hunger,thirst,tired) values("",'.$_GET['act_vibe'].','.$_GET['act_hunger'].','.$_GET['act_thirst'].','.$_GET['act_tired'].')';
        $conn->query($sql);
    }
    else if ($_GET['action']=='get_datas'){
        $sql='select * from properties';
        $result = $conn->query($sql);

        if($result->num_rows > 0)
        {
            $values = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($values);
        }
    }
    else if ($_GET['action']=='delete_datas'){
        $sql='delete from properties';
        $conn->query($sql);
    }
    else if ($_GET['action']=='send_mail'){
        $to ="bolya.richard@gmail.com";
        $subject = "Joe";

        $message = '
        <html>
            <head>
                <title>Játék menete</title>
            </head>
            <body>
                <h1>Eredmények</h1>
                <b>Eltelt idő:</b> '.strip_tags($_GET["time"]).' perc
                <br>
                <b>Elköltött pénz:</b> '.strip_tags($_GET["money"]).'$
            </body>
        </html>
        ';
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

        $headers .= 'From: <bolya.richard@gmail.com>' . "\r\n";

        mail($to,$subject,$message,$headers);
    }
?>