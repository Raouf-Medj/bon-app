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
    <script src="/js/navbar.js"></script>
</head>
<body>
    <div class="navbar_container">
        <a href="/">
            <img class="navbar_logo" src="../assets/images/website/logo.png" alt="BonApp logo">
        </a>

        <ul class="navlinks">
            <a href="#home_section" class="navlink">ACCUEIL</a>
            <a href="#recipes_section" class="navlink">RECETTES</a>
            <a href="#recipes_section" class="navlink">FAVORIS</a>
        </ul>

        <div class="signbutton">
            <?php if (isset($_SESSION['userId'])) { ?>
                <button id="signoutButton">Se déconnecter</button>
            <?php } else { ?>
                <a id="signinBut" href="/public/signin.php">Se connecter</a>
            <?php } ?>
        </div>
    </div>
</body>
</html>