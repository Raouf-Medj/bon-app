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

        <ul id="recipes_list"></ul>
        <script src="../js/index.js"></script>
    </div>
</body>
</html>

<!-- <?php
    include_once __DIR__.'/components/footer.php';
?> -->