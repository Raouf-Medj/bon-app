$(document).ready(function () {
    loadRecipes();
    showRecipes();
    loadRoleRequestButtons();
});

function loadRecipes() {
    $.ajax({
        url: "http://localhost:3000/api/recipeController.php",
        method: "GET",
        data: { 
            action: "getall"
        }
    })
    .done(function (data) {
        displayRecipes(JSON.parse(data));
    })
    .fail(function (err) {
        console.log(err);
    })
}

function showRecipes() {
    // Gestion de la barre de recherche
    let debounceTimer;

    $("#search_bar").on("input", function () {
        clearTimeout(debounceTimer);
        const query = $(this).val().trim();

        debounceTimer = setTimeout(function () {
            clearRecipes();

            $.ajax({
                url: "http://localhost:3000/api/recipeController.php",
                method: "GET",
                data: {
                    action: "getbyquery",
                    query: query
                }
            })
            .done(function (data) {
                console.log(data);
                displayRecipes(JSON.parse(data));
            })
            .fail(function (err) {
                console.log(err);
            });
        }, 300);
    });

    // Filtrage des recettes
    $(".filter-buttons button").click(function () {
        $(".filter-buttons button").removeClass("active");
        $(this).addClass("active");

        const selectedCategory = $(this).text().trim();

        $.ajax({
            url: "http://localhost:3000/api/userController.php",
            method: "POST",
            data: { 
                action: "getsession"
            }
        })
        .done(function (data) {
            let userId = null;
            try {
                userId = JSON.parse(data).session;
            } catch (e) {
                userId = null;
                console.log(e);
            }
            
            clearRecipes();
        
            if (selectedCategory == 'FAVORIS') {
                fetchAndDisplayFavRecipes(userId);
            }
            else {
                $.ajax({
                    url: "http://localhost:3000/api/recipeController.php",
                    method: "GET",
                    data: { 
                        action: "getbycategory",
                        category: selectedCategory
                    }
                })
                .done(function (data) {
                    displayRecipes(JSON.parse(data));
                })
                .fail(function (err) {
                    console.log(err);
                });
            }
        })
        .fail(function (err) {
            console.log(err);
        });
    });
}

function loadRoleRequestButtons() {
    $('#request-chef').on('click', function () {
        alert("Chef role requested!");
        // Add AJAX call here if needed
    });

    $('#request-translator').on('click', function () {
        alert("Translator role requested!");
        // Add AJAX call here if needed
    });
}

function displayRecipes(recipes) {
    let recipeList = $("#recipes_list");
    recipeList.empty();

    Object.values(recipes).forEach(recipe => {
        let totalTime = recipe.timers.reduce((sum, time) => sum + time, 0);
        let hours = Math.floor(totalTime / 60);
        let minutes = totalTime % 60;
        let formattedTime = `${hours > 0 ? hours + "h " : ""}${minutes}min`;

        let listItem = `
            <li class="recipecard_container">
                <div class="recipecard_image">
                    <img class="image" src="${recipe.imageURL}" alt="${recipe.name}" width="200">
                </div>
                <div class="recipecard_content">
                    <h3 class="recipecard_title">${recipe.name}</h3>
                    <div class="recipecard_foot">
                        <div class="recipecard_glance">
                            ${formattedTime} - ${recipe.difficulty} - ${recipe.diet}
                        </div>
                        <button class="recipecard_viewbutton">
                            VOIR LA RECETTE
                        </button>
                    </div>
                </div>
            </li>
        `;
        recipeList.append(listItem);
    });
}

function clearRecipes() {
    $("#recipes_list").empty();
}

async function fetchAndDisplayFavRecipes(userId) {
    if (userId == null) {
        alert("Veuillez vous connecter pour voir vos favoris.");
        return;
    }
    else {
        try {
            const favorites = await $.ajax({
                url: "http://localhost:3000/api/favoriteController.php",
                method: "GET",
                data: { action: "getFavorites", id: userId }
            });
            const recipeIds = JSON.parse(favorites);
    
            const recipeLst = await Promise.all(
                recipeIds.map(id => 
                    $.ajax({
                        url: "http://localhost:3000/api/recipeController.php",
                        method: "GET",
                        data: { action: "get", id: id }
                    }).then(data => JSON.parse(data))
                )
            );
    
            displayRecipes(recipeLst);
        } catch (err) {
            console.log("Error:", err);
        }
    }
}