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
        const recipes = Object.values(JSON.parse(data));
        const validatedRecipes = recipes.filter(recipe => recipe.validated);
        displayRecipes(validatedRecipes);
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
                const recipes = Object.values(JSON.parse(data));
                const validatedRecipes = recipes.filter(recipe => recipe.validated);
                displayRecipes(validatedRecipes);
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

        fetchRecipesByCategory(selectedCategory);
    });
}

async function fetchUserId() {
    try {
        const sessionData = await $.ajax({
            url: "http://localhost:3000/api/userController.php",
            method: "POST",
            data: { action: "getsession" }
        });
        return parseUserId(sessionData);
    } catch (err) {
        console.error("Error fetching user ID:", err);
        return null;
    }
}

async function fetchRecipesByCategory(selectedCategory) {
    try {
        let userId = await fetchUserId();

        clearRecipes();

        if (selectedCategory === 'FAVORIS') {
            await fetchAndDisplayFavRecipes(userId);
        } else {
            const recipes = await fetchRecipesFromCategory(selectedCategory);
            displayRecipes(recipes);
        }

    } catch (err) {
        console.error("Error:", err);
    }
}

// Helper: Safe JSON parsing
function parseUserId(data) {
    try {
        return JSON.parse(data).session || null;
    } catch (e) {
        console.error("Failed to parse session:", e);
        return null;
    }
}

// Helper: Fetch recipes by category
async function fetchRecipesFromCategory(category) {
    const data = await $.ajax({
        url: "http://localhost:3000/api/recipeController.php",
        method: "GET",
        data: { action: "getbycategory", category }
    });
    const recipes = Object.values(JSON.parse(data));
    const validatedRecipes = recipes.filter(recipe => recipe.validated);
    return validatedRecipes;
}

function loadRoleRequestButtons() {
    $('#request-chef').on('click', async function () {
        const userId = await fetchUserId();
        $.ajax({
            url: "http://localhost:3000/api/userController.php",
            method: "POST",
            data: { 
                action: "request-role",
                id: userId,
                requested_role: "CHEF"
            }
        })
        .done(function (_) {
            alert("Role de chef demandé avec succès!");
        })
        .fail(function (err) {
            console.log(err);
        })
    });

    $('#request-translator').on('click', async function () {
        const userId = await fetchUserId();
        $.ajax({
            url: "http://localhost:3000/api/userController.php",
            method: "POST",
            data: { 
                action: "request-role",
                id: userId,
                requested_role: "TRANSLATOR"
            }
        })
        .done(function (_) {
            alert("Role de traducteur demandé avec succès!");
        })
        .fail(function (err) {
            console.log(err);
        })
    });
}

function displayRecipes(recipes) {
    let recipeList = $("#recipes_list");
    recipeList.empty();

    recipes.forEach(recipe => {
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

$('#recipes_list').on('click', '.recipecard_viewbutton', function() {
    let rec_id = $(this).data('rec-id');
    console.log("entered");
    let rec_id2 = $(this).data('rec-id');

    $.ajax({
        url: 'public/recipe.php',
        type: 'GET',
        data: {
            rec_id: rec_id
        },
        success: function(response) {
            var page =  'public/recipe.php';
            var param = 'rec_id=' + rec_id2;
            var url = page + '?' + param;
            window.location.href = url;
        },
        error: function(response) {
            var page =  'public/recipe.php';
            var param = 'rec_id=' + response.rec_id2;
            var url = page + '?' + param;
            alert("Could not find page: " + url)
        }
    });
});

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

            const recipes = Object.values(recipeLst);
            const validatedRecipes = recipes.filter(recipe => recipe.validated);
            displayRecipes(validatedRecipes);
        } catch (err) {
            console.log("Error:", err);
        }
    }
}
