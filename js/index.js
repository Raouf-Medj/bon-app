$(document).ready(async function () {
    const userId = await fetchUserId();
    fetchFavoriteRecipes(userId);
    loadRecipes(userId);
    showRecipes(userId);
    loadButtons();
});

function loadRecipes(userId) {
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
        displayRecipes(validatedRecipes, userId);
    })
    .fail(function (err) {
        console.log(err);
    })
}

function showRecipes(userId) {
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
                displayRecipes(validatedRecipes, userId);
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
            method: "GET",
            data: { action: "getsession" }
        });
        return parseUserId(sessionData);
    } catch (err) {
        console.error("Error fetching user ID:", err);
        return null;
    }
}

// Helper: Safe JSON parsing
function parseUserId(data) {
    try {
        return JSON.parse(data).userId || null;
    } catch (e) {
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
            displayRecipes(recipes, userId);
        }

    } catch (err) {
        console.error("Error:", err);
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

function loadButtons() {
    $('#request-chef').on('click', async function () {
        const userId = await fetchUserId();
        if (userId == null) {
            alert("Veuillez vous connecter pour voir vos favoris.");
            return;
        }
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
        if (userId == null) {
            alert("Veuillez vous connecter pour voir vos favoris.");
            return;
        }
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

    $(document).on("click", ".like-button", async function () {
        const button = $(this);
        const recipeId = button.data("rec-id");
        let liked = button.data("liked");

        // Toggle like status
        liked = !liked;

        // Update the data attribute and icon
        button.data("liked", liked);
        button.toggleClass("liked");
        button.find("i").attr("class", liked ? "fa-solid fa-heart" : "fa-regular fa-heart");

        // Update localStorage and JSON database
        let likedRecipes = getLikedRecipes();
        const userId = await fetchUserId();
        if (liked) {
            if (!likedRecipes.includes(recipeId)) {
                try {
                    addFavRecipe(userId, recipeId);
                    likedRecipes.push(recipeId);
                }
                catch (err) {
                    console.error("Error adding favorite recipe:", err);
                }
            }
        } else {
            try {
                removeFavRecipe(userId, recipeId);
                likedRecipes = likedRecipes.filter(id => id !== recipeId);
            }
            catch (err) {
                console.error("Error removing favorite recipe:", err);
            }
        }
        saveLikedRecipes(likedRecipes);
    });
    
}

function getLikedRecipes() {
    return JSON.parse(localStorage.getItem("likedRecipes") || "[]");
}

function saveLikedRecipes(likedArray) {
    localStorage.setItem("likedRecipes", JSON.stringify(likedArray));
}

function displayRecipes(recipes, userId = null) {
    let recipeList = $("#recipes_list");
    recipeList.empty();
    const likedRecipes = getLikedRecipes();

    recipes.forEach(recipe => {
        let totalTime = recipe.timers.reduce((sum, time) => sum + time, 0);
        let hours = Math.floor(totalTime / 60);
        let minutes = totalTime % 60;
        let formattedTime = `${hours > 0 ? hours + "h " : ""}${minutes}min`;
        const showLikeButton = userId !== null;

        const isLiked = likedRecipes.includes(recipe.id);
        const heartClass = isLiked ? 'fa-solid' : 'fa-regular';

        let listItem = `
            <li class="recipecard_container">
                <div class="recipecard_image">
                    <img class="image" src="${recipe?.localImage?.split('bon-app\\')[1].replace(/\\/g, '/').replace('api/../', '') || recipe.imageURL}" alt="${recipe.nameFR}" width="200">
                </div>
                <div class="recipecard_content">
                    <h3 class="recipecard_title">${recipe.nameFR}</h3>
                    <div class="recipecard_foot">
                        <div class="recipecard_glance">
                            ${formattedTime} • ${recipe.difficulty} • ${recipe.diet}
                        </div>
                        <button class="${showLikeButton ? '' : 'hidden'} like-button ${isLiked ? 'liked' : ''}" data-liked="${isLiked}" data-rec-id="${recipe.id}">
                            <i class="${heartClass} fa-heart"></i>
                        </button>
                        <button class="recipecard_viewbutton" data-rec-id=${recipe.id}>
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
    console.log(rec_id);
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
            const recipeIds = getLikedRecipes();
            const recipeLst = await Promise.all(
                recipeIds.map(id => 
                    $.ajax({
                        url: "http://localhost:3000/api/recipeController.php",
                        method: "GET",
                        data: { action: "get", id: id }
                    }).then(data => JSON.parse(data))
                )
            );

            displayRecipes(recipeLst.filter(recipe => recipe.validated), userId);
        } catch (err) {
            console.log("Error:", err);
        }
    }
}

async function fetchFavoriteRecipes(userId) {
    if (userId == null) {
        return;
    }
    const favorites = await $.ajax({
        url: "http://localhost:3000/api/favoriteController.php",
        method: "GET",
        data: { action: "get", id: userId }
    });
    const recipeIds = JSON.parse(favorites);
    saveLikedRecipes(recipeIds);
}

async function addFavRecipe(userId, recipeId) {
    await $.ajax({
        url: "http://localhost:3000/api/favoriteController.php",
        method: "POST",
        data: { action: "add", id_usr: userId, id_rec: recipeId }
    });
}

async function removeFavRecipe(userId, recipeId) {
    await $.ajax({
        url: "http://localhost:3000/api/favoriteController.php",
        method: "POST",
        data: { action: "delete", id_usr: userId, id_rec: recipeId }
    });
}