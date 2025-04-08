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
            <a href="#rolerequest_section" class="navlink">REJOIGNEZ-NOUS</a>
        </ul>

        <div class="nav_buttons">
            <div class="dashboard">
                <?php if (isset($_SESSION['userId']) && isset($_SESSION['userRole']) && ($_SESSION['userRole'] == 'ADMIN' || $_SESSION['userRole'] == 'CHEF' || $_SESSION['userRole'] == 'TRANSLATOR')) { ?>
                    <a href="/public/dashboard.php" id="dashboardButton">Dashboard</a>
                <?php } ?>
            </div>
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