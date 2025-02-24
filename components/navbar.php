<?php
    include_once __DIR__.'/session.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/navbar.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="js/navbar.js"></script>
</head>
<body>
    <div class="navbar_container">
        <a href="/">
            <img class="navbar_logo" src="../assets/images/website/logo.png" alt="BonApp logo">
        </a>

        <ul class="navlinks">
            <li class="navlink">Accueil</li>
            <li class="navlink">Recettes</li>
            <li class="navlink">Favoris</li>
        </ul>

        <div class="signbutton">
            <?php if (isset($_SESSION['userId'])) { ?>
                <button id="signoutButton">Signout</button>
            <?php } else { ?>
                <a id="signinBut" href="/public/signin.php">Signin</a>
            <?php } ?>
        </div>
    </div>
</body>
</html>