<?php
    include_once __DIR__.'/session.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/dashboardNavbar.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="/js/dashboardNavbar.js"></script>
</head>
<body>
    <div class="navbar_container">
        <a href="/">
            <img class="navbar_logo" src="../assets/images/website/logo_white.png" alt="BonApp logo">
        </a>
        <?php if (isset($_SESSION['userRole']) && $_SESSION['userRole'] == "CHEF") { ?>
            <ul class="navlinks">
                <a href="#home_section" class="navlink">GÉRER MES RECETTES</a>
            </ul>
        <?php } else if (isset($_SESSION['userRole']) && $_SESSION['userRole'] == "TRANSLATOR") { ?>
            <ul class="navlinks">
                <a href="#home_section" class="navlink">TRADUIRE DES RECETTES</a>
            </ul>
        <?php } else if (isset($_SESSION['userRole']) && $_SESSION['userRole'] == "ADMIN") { ?>
            <ul class="navlinks">
                <a href="#user-dashboard" class="navlink">UTILISATEURS</a>
                <a href="#recipe-dashboard" class="navlink">RECETTES</a>
            </ul>
        <?php } ?>

        <div class="nav_buttons">
            <div class="signbutton">
                <?php if (isset($_SESSION['userId'])) { ?>
                    <button id="signoutButton"><i style="font-size: large" class="uil uil-signout"></i></button>
                <?php } else { ?>
                    <a id="signinBut" href="/public/signin.php"><i style="font-size: large" class="uil uil-signin"></i></a>
                <?php } ?>
            </div>
        </div>
    </div>
</body>
</html>