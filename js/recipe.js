let recipeData = {};

function fetchRecipe(recId) {
    $.ajax({
        url: "/api/recipeController.php",
        type: 'GET',
        data: {action: "get", id: recId},
        success: function(response) {
            console.log(response);
            recipeData = response;
        },
        error: function(response) {
            console.log(response);
            recipeError(recId);
        }
    });
}

function recipeError(recId) {
    console.log("error" + recId);
}
