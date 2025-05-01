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
    let contentDiv = $("#content")
        .attr("class", "content");
    contentDiv.empty();

    // TODO: make sure missing names don't fuck up the view
    let name = lang === 'fr' && recipe.nameFR ? recipe.nameFR : recipe.name;
    let ingredients = lang === 'fr' && recipe.ingredientsFR ? recipe.ingredientsFR : recipe.ingredients;
    let steps = lang === 'fr' && recipe.stepsFR ? recipe.stepsFR : recipe.steps;

    // language button
    let buttonDiv = $("<div>")
        .attr("class", "button-div")
        .appendTo(contentDiv);

    let languageButton = $("<button>")
        .attr("id", "changeLang")
        .attr("class", "lang-button")
        .on("click", changeLang)
        .text(lang === 'fr' ? 'Click here to see the english version!' : 'Cliquez ici pour voir la version française');
    buttonDiv.append(languageButton);

    //recipeContainer
    let recipeContainer = $("<div>")
        .addClass("recipe-container");
    contentDiv.append(recipeContainer);

    let recipeLabelDiv = $("<div>")
        .attr("class", "recipe-label")
        .appendTo(recipeContainer);

    $("<p>")
        .text(lang === "fr" ? "RECETTE" : "RECIPE")
        .appendTo(recipeLabelDiv);

    let title = $("<h1>")
        .text(name);
    recipeContainer.append(title);

    let authorPara = $("<p>")
        .addClass("author")
        .text((lang === 'fr' ? 'Auteur' : 'Author') + ": " + recipe.author || 'N/A');
    recipeContainer.append(authorPara);

    let detailsDiv = $("<div>")
        .attr("class", "details")
        .appendTo(recipeContainer);

    let totalTime = recipe.timers.reduce((sum, time) => sum + time, 0);
    let hours = Math.floor(totalTime / 60);
    let minutes = totalTime % 60;
    let formattedTime = `${hours > 0 ? hours + "h " : ""}${minutes}min`;
    let detailsSection = `
        <div class="detailsItem"><span>${formattedTime}</span></div>
        <div class="sep">•</div>
        <div class="detailsItem"><span>${recipe.difficulty}</span></div>
        <div class="sep">•</div>
        <div class="detailsItem"><span>${recipe.diet}</span></div>
        <div class="sep">•</div>
        <div class="detailsItem"><span>${recipe.is_dairy_free ? (lang === 'fr' ? 'Sans produits laitiers' : 'No dairy') : (lang === 'fr' ? 'Contient produits laitiers' : 'Contains dairy')}</span></div>
        <div class="sep">•</div>
        <div class="detailsItem"><span>${recipe.is_gluten_free ? (lang === 'fr' ? 'Sans gluten' : 'Gluten free') : (lang === 'fr' ? 'Contient du gluten' : 'Contains gluten')}</span></div>
    `;

    detailsDiv.append(detailsSection)
    
    if (recipe.imageURL) {
        //TODO alt?
        let image = $("<img>")
            .attr("src", recipe.imageURL)
            .addClass("recipe-image");
        recipeContainer.append(image);
    }

    if (recipe.originalURL) {
        let originUrl = $("<p>")
            .attr("class", "originUrl");
        let originUrl_a = $("<a>")
            .attr("href", recipe.originalURL)
            .attr("target", "_blank")
            .text(lang === 'fr' ? 'Source originale' : 'Original Source');
        originUrl.append(originUrl_a);
        recipeContainer.append(originUrl);
    }

    // ingeredients section
    let ingredientsSection = $("<div>")
        .addClass("ingredients-section");
    recipeContainer.append(ingredientsSection);

    let ingredientsSectionTitle = $("<p>")
        .text(lang === 'fr' ? 'Ingrédients' : 'Ingredients');
    ingredientsSection.append(ingredientsSectionTitle);

    let ingredientList = $("<ul>");
    ingredientsSection.append(ingredientList);

    for (let item of ingredients) {
        let listItem = $("<li>")
            .text((item.quantity ? item.quantity + ' ' : '') + (item.name || (lang === 'fr' ? 'Non spécifié' : 'Not specified')));
        ingredientList.append(listItem);
    }

    // instructions section
    let divStepsSection = $("<div>")
        .addClass("steps-section");
    recipeContainer.append(divStepsSection);

    let stepsTitle = $("<h2>")
        .text(lang === 'fr' ? 'Instructions' : 'Instructions');
    divStepsSection.append(stepsTitle);

    let stepsList = $("<ol>");
    divStepsSection.append(stepsList);
    steps.forEach((step, index) => {
        let listItem = $("<li>").text(`${step} (${recipe.timers[index]} min)`);
        stepsList.append(listItem);
    });

    //commentsection
    let commentSectionDiv = $("<div>")
        .attr("class", "comments")
        .appendTo(contentDiv);

    let commentsLabelDiv = $("<div>")
        .attr("class", "recipe-label")
        .appendTo(commentSectionDiv);

    $("<p>")
        .text(lang === "fr" ? "COMMENTAIRES" : "COMMENTS")
        .appendTo(commentsLabelDiv);

    // add comments section
    let divAddComment = $("<div>")
        .addClass("add-comment");
    commentSectionDiv.append(divAddComment);

    let userId = await fetchUserId();

    if (!userId) {
        let divNotLoggedIn = $("<div>");
        divAddComment.append(divNotLoggedIn);

        let pNotloggedIn = $("<p>")
            .attr("class", "not-logged-in")
            .text(lang === "fr" ? "Vous n'êtes pas connecté." : "You are not logged in.");
        divNotLoggedIn.append(pNotloggedIn);
        $("<button>")
            .text(lang === "fr" ? "Se connecter" : "Sign-in")
            .attr("class", "sign-in-button")
            .on("click", function () {
                window.location.href = "/public/signin.php";
            })
            .appendTo(divNotLoggedIn);
    } else {

        let userName = await fetchUserName(userId);
        $("<p>")
            .attr("class", "add-comment-username")
            .text(userName)
            .appendTo(divAddComment);

        let commentTA = $("<textarea>")
            .attr("id", "commentText")
            .attr("class", "textarea")
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
            .attr("class", "image-input")
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
                submitComment(recipe.id, userId, userName);
            })
            .attr("class", "submit-button")
            .text(lang === 'fr' ? 'Envoyer le commentaire' : 'Submit Comment');
        divAddComment.append(submitButton);

        let divCommentStatus = $("<div>")
            .attr("id", "commentStatus")
            .addClass("status-message");
        divAddComment.append(divCommentStatus);
    }

    if (recipe.comments && recipe.comments.length > 0) {

        for (let comment of recipe.comments.reverse()) {
            let commentElement = `
            <div class="single-comment">
            <p class="comment-username">${comment.user_name}</p>
            <p class="comment-text">${comment.text}</p>
            `;
            if (comment.image) {
                let cImage = `
                <img src="/assets/images/comments/${comment.image}.png" class="comment-image">
                `;
                commentElement += cImage;
            }
            commentElement += "</div>";
            commentSectionDiv.append(commentElement);
        }
    } else {
        $("<p>")
            .attr("class", "no-comments")
            .text(lang === "fr" ? "Pas de commentaires" : "No comments yet")
            .appendTo(commentSectionDiv);
    }
}

function submitComment(recipeId, userId, userName) {
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
    formData.append('user_name', userName);
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

async function fetchUserName(id) {
    try {
        const sessionData = await $.ajax({
            url: "http://localhost:3000/api/userController.php",
            method: "GET",
            data: { action: "get",
                    id: id
            }
        });
        return parseUserName(sessionData);
    } catch (err) {
        console.error("Error fetching user name:", err);
        return null;
    }
}

function parseUserName(data) {
    try {
        return JSON.parse(data).username;
    } catch (e) {
        console.error("Failed to parse user: ", e);
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
