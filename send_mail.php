
<?php

########### CONFIG ###############

      $recipient = 'your@email.com';
      
########### CONFIG END ###########


switch ($_SERVER['REQUEST_METHOD']) {
    case ("OPTIONS"): // Allow preflighting to take place.
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;
    case ("POST"): // Send the email;
        header("Access-Control-Allow-Origin: *");

        // Get the email from the form input
        $email = $_POST['email'];
        

        $message = "Hello,\n
        \nClick on the following Link to reset your password for your " . $email . " account:\n
        \nhttp://walter-doni.developerakademie.net/Join/html/reset-your-password.html?email=" . $email . "\n
        \nThanks,\n
        \nYour Join team\n";

        $recipient = $email;
        $subject = "JOIN password reset";
        $headers = "From: http://walter-doni.developerakademie.net/Join/index.html";

        $result = mail($recipient, $subject, $message, $headers);
        print($result);

        break;
    default: // Reject any non POST or OPTIONS requests.
        header("Allow: POST", true, 405);
        exit;
}
?>

