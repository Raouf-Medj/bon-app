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
    <script src="https://kit.fontawesome.com/14554ba1ac.js" crossorigin="anonymous"></script>
</head>
<body>
    <div class="main_container">
        <div class="hero">
            <img src="../assets/images/website/hero.png" alt="hero" class="hero_img">
            <div class="hero_container">
                <h1 class="hero_headline">LIBÉREZ L'EXCELLENCE CULINAIRE</h1>
                <p class="hero_description">Explorez un monde de saveurs, découvrez des recettes artisanales et laissez l'arôme de notre passion pour la cuisine envahir votre cuisine.</p>
                <a href="#recipes_section" class="explorerecipes">Explorer les recettes</a>
            </div>
        </div>

        <div id="recipes_section" class="header">
            <span class="badge">RECETTES</span>
            <h1>Embarquez pour un voyage culinaire</h1>
            <p>Avec notre collection variée de recettes, nous avons de quoi satisfaire toutes les papilles.</p>
            <div class="search-bar">
                <input type="text" id="search_bar" placeholder="RECHERCHER..." />
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

        <div id="rolerequest_section" class="rr_container">
            <div class="rr_card">
            <h1>NE MANQUEZ PAS LE PLAISIR!<br>DEVENEZ CHEF OU TRADUCTEUR!</h1>
            <p>
                Demandez le rôle de chef pour ajouter de nouvelles recettes, ou celui de traducteur pour traduire des recettes.
            </p>
            <div class="rr_buttons">
                <button id="request-chef">DEVENIR CHEF</button>
                <button id="request-translator">DEVENIR TRADUCTEUR</button>
            </div>
            </div>
        </div>
    </div>
</body>
</html>

<?php
    include_once __DIR__.'/components/footer.php';
?>