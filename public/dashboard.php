<?php
    include_once __DIR__.'/../components/dashboardNavbar.php';
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BonApp!</title>
    <link href="../css/global.css" rel="stylesheet">
    <link href="../css/dashboard.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="/js/dashboard.js"></script>
</head>
<body>
    <?php if (isset($_SESSION['userRole']) && $_SESSION['userRole'] == "CHEF") { ?>
        <ul class="navlinks">
            <a href="#home_section" class="navlink">GÉRER MES RECETTES</a>
        </ul>
    <?php } else if (isset($_SESSION['userRole']) && $_SESSION['userRole'] == "TRANSLATOR") { ?>
        <ul class="navlinks">
            <a href="#home_section" class="navlink">TRADUIRE DES RECETTES</a>
        </ul>
    <?php } else if (isset($_SESSION['userRole']) && $_SESSION['userRole'] == "ADMIN") { ?>
        <div id="user-dashboard" class="user-dashboard">
        <div class="header">
            <h2>Gestion des utilisateurs</h2>
        </div>

        <ul id="userList" class="user-list"></ul>
    </div>
    <?php } ?>

    <div id="recipe-dashboard" class="user-dashboard">
        <div class="header">
            <h2>Gestion des recettes</h2>
        </div>

        <ul id="recipeList" class="recipe-list"></ul>
    </div>

    <!-- Popup modal -->
    <div class="modal" id="popupModal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <div id="modalBody"></div>
        </div>
    </div>
</body>
</html>

<?php
    include_once __DIR__.'/../components/footer.php';
?>