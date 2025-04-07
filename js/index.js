$(document).ready(function () {
    loadRecipes();

    $(".filter-buttons button").click(function () {
        $(".filter-buttons button").removeClass("active");
        $(this).addClass("active");

        const selectedCategory = $(this).text().trim();
        
        clearRecipes();
        if (selectedCategory == 'FAVORIS') {
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
    });
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