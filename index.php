<?php
    include_once __DIR__.'/components/navbar.php';
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BonApp!</title>
    <link href="./css/global.css" rel="stylesheet">
    <link href="./css/index.css" rel="stylesheet">
    <link href="./css/recipeCard.css" rel="stylesheet">
</head>
<body>
    <div class="main_container">
        <div class="hero">
            <img src="../assets/images/website/hero.png" alt="hero" class="hero_img">
            <div class="hero_container">
                <h1 class="hero_headline">LIBÉREZ L'EXCELLENCE CULINAIRE</h1>
                <p class="hero_description">Explorez un monde de saveurs, découvrez des recettes artisanales et laissez l'arôme de notre passion pour la cuisine envahir votre cuisine.</p>
                <button class="explorerecipes">Explorer les recettes</button>
            </div>
        </div>

        <div id="recipes_section" class="header">
            <span class="badge">RECETTES</span>
            <h1>Embarquez pour un voyage culinaire</h1>
            <p>Avec notre collection variée de recettes, nous avons de quoi satisfaire toutes les papilles.</p>
            <div class="search-bar">
                <input type="text" placeholder="RECHERCHER..." />
            </div>
            <div class="filter-buttons">
                <button class="active">ALL</button>
                <button>VÉGÉTARIEN</button>
                <button>VEGAN</button>
                <button>SANS GLUTEN</button>
                <button>SANS LACTOSE</button>
                <button>EASY</button>
                <button>MEDIUM</button>
                <button>HARD</button>
                <button>FAVORIS</button>
            </div>
        </div>

        <ul id="recipes_list"></ul>
        <script src="../js/index.js"></script>
    </div>
</body>
</html>

<!-- <?php
    include_once __DIR__.'/components/footer.php';
?> -->