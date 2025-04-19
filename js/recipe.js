let recipeData = {};
let lang = 'fr';

async function fetchRecipe(recId) {
    $.ajax({
        url: "/api/recipeController.php",
        type: 'GET',
        data: {action: "get", id: recId},
        dataType: "json",
        success: function(response) {
            recipeData = response;
            createRecipeContent(recipeData);
        },
        error: function(response) {
            recipeError(recId);
        }
    });
}

function changeLang() {
    lang = (lang === "en") ? "fr" : "en";
    createRecipeContent(recipeData);
}


async function createRecipeContent(recipe) {
    let contentDiv = $("#content");
    contentDiv.empty();

    // TODO: make sure missing names don't fuck up the view
    let name = lang === 'fr' && recipe.nameFR ? recipe.nameFR : recipe.name;
    let ingredients = lang === 'fr' && recipe.ingredientsFR ? recipe.ingredientsFR : recipe.ingredients;
    let steps = lang === 'fr' && recipe.stepsFR ? recipe.stepsFR : recipe.steps;

    // language button
    let languageButton = $("<button>")
        .attr("id", "changeLang")
        .on("click", changeLang)
        .text(lang === 'fr' ? 'Click here to see the english version!' : 'Cliquez ici pour voir la version française');
    contentDiv.append(languageButton);

    //recipeContainer
    let recipeContainer = $("<div>")
        .addClass("recipe-container");
    contentDiv.append(recipeContainer);

    let title = $("<h1>")
        .text(name);
    recipeContainer.append(title);

    let authorPara = $("<p>")
        .addClass("author")
        .text((lang === 'fr' ? 'Auteur' : 'Author') + ": " + recipe.author || 'N/A');
    recipeContainer.append(authorPara);
    
    if (recipe.imageURL) {
        //TODO alt?
        let image = $("<img>")
            .attr("src", recipe.imageURL)
            .addClass("recipe-image");
        recipeContainer.append(image);
    }

    if (recipe.originalURL) {
        let originUrl = $("<p>");
        let originUrl_a = $("<a>")
            .attr("href", recipe.originalURL)
            .attr("target", "_blank")
            .text(lang === 'fr' ? 'Source originale' : 'Original Source');
        originUrl.append(originUrl_a);
        recipeContainer.append(originUrl);
    }

    let ingredientsSection = $("<div>")
        .addClass("ingredients-section");
    recipeContainer.append(ingredientsSection);

    let ingredientsSectionTitle = $("<h2>")
        .text(lang === 'fr' ? 'Ingrédients' : 'Ingredients');
    ingredientsSection.append(ingredientsSectionTitle);

    let ingredientList = $("<ul>");
    ingredientsSection.append(ingredientList);

    for (let item of ingredients) {
        let listItem = $("<li>")
            .text((item.quantity ? item.quantity + ' ' : '') + (item.name || (lang === 'fr' ? 'Non spécifié' : 'Not specified')));
        ingredientList.append(listItem);
    }

    let divStepsSection = $("<div>")
        .addClass("steps-section");
    recipeContainer.append(divStepsSection);

    let stepsTitle = $("<h2>")
        .text(lang === 'fr' ? 'Instructions' : 'Instructions');
    divStepsSection.append(stepsTitle);

    let stepsList = $("<ol>");
    divStepsSection.append(stepsList);
    for (let step of steps) {
        let listItem = $("<li>")
            .text(step);
        stepsList.append(listItem);
    }

    // details section
    let divDetails = $("<div>")
        .addClass("details-section");
    recipeContainer.append(divDetails);

    let detailsTitle = $("<h3>")
        .text(lang === 'fr' ? 'Détails' : 'Details');
    divDetails.append(detailsTitle);

    let parDetailDiet = $("<p>")
        .text((lang === 'fr' ? 'Régime: ' : 'Diet: ') + (recipe.diet || 'N/A'));
    divDetails.append(parDetailDiet);
    let parDetailDiff = $("<p>")
        .text((lang === 'fr' ? 'Difficulté: ' : 'Difficulty: ') + (recipe.difficulty || 'N/A'));
    divDetails.append(parDetailDiff);
    let parDetailGluten = $("<p>")
        .text((lang === 'fr' ? 'Sans gluten: ' : 'Gluten Free: ') + (recipe.is_gluten_free ? (lang === 'fr' ? 'Oui' : 'Yes') : (lang === 'fr' ? 'Non' : 'No')));
    divDetails.append(parDetailGluten);
    let parDetailDairy = $("<p>")
        .text((lang === 'fr' ? 'Sans produits laitiers: ' : 'Dairy Free: ') + (recipe.is_dairy_free ? (lang === 'fr' ? 'Oui' : 'Yes') : (lang === 'fr' ? 'Non' : 'No')));
    divDetails.append(parDetailDairy);

    // add comments section
    let divAddComment = $("<div>")
        .addClass("add-comment");
    recipeContainer.append(divAddComment);

    let addCommentTitle = $("<h3>")
        .text(lang === "fr" ? "Ajouter un commentaire" : "Add a comment!");
    divAddComment.append(addCommentTitle);

    let userId = await fetchUserId();

    if (!userId) {
        let divNotLoggedIn = $("<div>");
        divAddComment.append(divNotLoggedIn);

        let pNotloggedIn = $("<p>")
            .text("You are not logged in.");
        divNotLoggedIn.append(pNotloggedIn);
        $("<button>")
            .text("Sigin")
            .on("click", function () {
                window.location.href = "/public/signin.php";
            })
            .appendTo(divNotLoggedIn);
    } else {

        let commentTA = $("<textarea>")
            .attr("id", "commentText")
            .attr("placeholder" ,lang === 'fr' ? 'Votre commentaire...' : 'Your comment...');
        divAddComment.append(commentTA);

        let divImageUpload = $("<div>")
            .addClass("image-upload");
        divAddComment.append(divImageUpload);

        let labelImage = $("<label>")
            .attr("for", "commentImage")
            .text(lang === 'fr' ? 'Télécharger une image (facultatif): ' : 'Upload Image (optional): ');
        divImageUpload.append(labelImage);

        let imageInput = $("<input>")
            .attr("type", "file")
            .attr("id", "commentImage")
            .attr("accept", "image/*");
        divImageUpload.append(imageInput);

        let imagePreview = $("<img>")
            .attr("id", "imagePreview")
            .attr("src", "#")
            .attr("alt", lang === 'fr' ? 'Aperçu de l\'image' : 'Image Preview')
            .attr("style", "display:none; max-width:100px; height:auto;");
        divImageUpload.append(imagePreview);

        let submitButton = $("<button>")
            .on("click", function() {
                submitComment(recipe.id, userId);
            })
            .text(lang === 'fr' ? 'Envoyer le commentaire' : 'Submit Comment');
        divAddComment.append(submitButton);

        let divCommentStatus = $("<div>")
            .attr("id", "commentStatus")
            .addClass("status-message");
        divAddComment.append(divCommentStatus);
    }

    if (recipe.comments && recipe.comments.length > 0) {
        let divComments = $("<div>")
            .addClass("comments-section");
        
        recipeContainer.append(divComments);

        let commentsTitle = $("<h2>")
            .text(lang === 'fr' ? 'Commentaires' : 'Comments');
        divComments.append(commentsTitle);

        let commentsList = $("<ul>")
        divComments.append(commentsList);

        for (let comment of recipe.comments) {
            let listItem = $("<li>")
            let pUserName = $("<p>")
                .addClass("user")
                .text(comment.user_name);
            listItem.append(pUserName);

            let pText = $("<p>")
                .addClass("text")
                .text(comment.text);
            listItem.append(pText);

            if (comment.image) {
                let cImage = $("<img>")
                    .attr("src", "/assets/comments/"+comment.image)
                    .attr("alt", "Comment Image")
                    .addClass("comment-image");
                listItem.append(cImage);
            }
            commentsList.append(listItem);
        }
    }
}

function submitComment(recipeId, userId) {
    const commentText = document.getElementById('commentText').value;
    const commentImageInput = document.getElementById('commentImage');
    const commentImageFile = commentImageInput.files[0];
    const commentStatus = document.getElementById('commentStatus');

    if (!commentText.trim() && !commentImageFile) {
        commentStatus.textContent = lang === 'fr' ? 'Veuillez saisir un commentaire ou télécharger une image.' : 'Please enter a comment or upload an image.';
        commentStatus.className = 'status-message error';
        return;
    }

    const formData = new FormData();
    formData.append('action', 'addComment');
    formData.append('user_id', userId);
    formData.append('id', recipeId);
    formData.append('text', commentText);
    if (commentImageFile) {
        formData.append('image', commentImageFile);
    }

    $.ajax({
        url: "/api/recipeController.php", // Pfad zum recipeController anpassen
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            try {
                const data = JSON.parse(response);
                if (data.success) {
                    commentStatus.textContent = lang === 'fr' ? 'Commentaire ajouté avec succès!' : 'Comment added successfully!';
                    commentStatus.className = 'status-message success';
                    fetchRecipe(recipeId); // Reload, um die neuen Kommentare anzuzeigen
                } else {
                    commentStatus.textContent = lang === 'fr' ? 'Erreur lors de l\'ajout du commentaire: ' + data.error : 'Error adding comment: ' + data.error;
                    commentStatus.className = 'status-message error';
                }
            } catch (error) {
                console.error("Error parsing JSON response:", error);
                commentStatus.textContent = lang === 'fr' ? 'Erreur inattendue.' : 'Unexpected error.';
                commentStatus.className = 'status-message error';
            }
            document.getElementById('commentText').value = '';
            document.getElementById('commentImage').value = '';
            document.getElementById('imagePreview').style.display = 'none';
        },
        error: function(xhr, status, error) {
            console.error("AJAX error:", status, error);
            commentStatus.textContent = lang === 'fr' ? 'Erreur de communication avec le serveur.' : 'Communication error with the server.';
            commentStatus.className = 'status-message error';
        }
    });
}

function loadMissingIdPage() {
    let conentDiv = $("#content");
    let contentDiv = $("#content");
    contentDiv.html(`<p>${lang === 'fr' ? 'ID de recette manquant.' : 'Missing recipe ID.'}</p>`);
}

function recipeError(recId) {
    let contentDiv = $("#content");
    contentDiv.html(`<p>${lang === 'fr' ? 'Erreur lors du chargement de la recette avec l\'ID' : 'Error loading recipe with ID'} ${recId}.</p>`);
    console.error("Error loading recipe with ID: " + recId);
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

function parseUserId(data) {
    try {
        return JSON.parse(data).session || null;
    } catch (e) {
        console.error("Failed to parse session:", e);
        return null;
    }
}

//event listeners
$(document).ready(function () {
    $("#changeLang").click(function () {
        lang = (lang === "en") ? "en" : "fr";
        location.reload();
    });
});
