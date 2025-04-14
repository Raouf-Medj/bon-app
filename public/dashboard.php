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
            <button id="addRecipeBtn" class="main-action">+ Ajouter une recette</button>
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

    <!-- Recipe Modal -->
    <div id="recipeModal" class="modal">
        <div class="recipe-modal-content">
            <span class="close">&times;</span>
            <h2>Ajouter ou modifier une recette</h2>
            <form id="recipeForm">
                <div class="row">
                    <div class="column">
                    <label>Nom (FR):</label>
                    <input type="text" name="nameFR" placeholder="Roti à la cocotte" required>
                    </div>
                    <div class="column">
                    <label>Name (EN):</label>
                    <input type="text" name="name" placeholder="Crock Pot Roast" required>
                    </div>
                </div>

                <label>Auteur:</label>
                <input type="text" name="author" placeholder="Jessica Lovebird"><br>

                <div class="row">
                    <div class="column">
                    <label>Régime :</label>
                    <select name="diet">
                        <option>Omnivore</option>
                        <option>Vegan</option>
                        <option>Vegetarien</option>
                    </select>
                    </div>
                    <div class="column">
                    <label>Difficulté :</label>
                    <select name="difficulty">
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>
                    </div>
                </div>

                <div class="checkbox-row">
                    <label for="gluten">Sans gluten</label>
                    <input style="width: 30px;" type="checkbox" id="gluten" name="is_gluten_free">
                </div>

                <div class="checkbox-row">
                    <label for="lactose">Sans lactose</label>
                    <input style="width: 30px;" type="checkbox" id="lactose" name="is_dairy_free">
                </div><br>

                <h3>Ingrédients</h3>
                <div id="ingredientsContainer"></div>
                <button type="button" id="addIngredient">+ Ajouter un ingrédient</button><br><br>

                <h3>Étapes (Steps)</h3>
                <div id="steps-list"></div>
                <button type="button" id="add-step">+ Ajouter une étape</button>

                <h3>Liens</h3>
                <input type="text" name="imageURL" placeholder="Lien d'image"><br>
                <input type="text" name="originalURL" placeholder="Lien d’origine"><br><br>

                <button type="submit">Enregistrer</button>
            </form>
        </div>
    </div>
</body>
</html>

<?php
    include_once __DIR__.'/../components/footer.php';
?>