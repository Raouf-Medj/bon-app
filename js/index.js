$(document).ready(function () {
    loadRecipes();    
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
                        <button class="recipecard_viewbutton" data-rec-id=${recipe.id}>
                            Voir la recette
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
