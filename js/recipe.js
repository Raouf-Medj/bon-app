let recipeData = {};
let lang = 'fr';

function fetchRecipe(recId) {
    $.ajax({
        url: "/api/recipeController.php",
        type: 'GET',
        data: {action: "get", id: recId},
        dataType: "json",
        success: function(response) {
            console.log(response);
            recipeData = response;
            createRecipeContent(recipeData);
        },
        error: function(response) {
            console.log(response);
            recipeError(recId);
        }
    });
}

function changeLang() {
    lang = (lang === "en") ? "fr" : "en";
    createRecipeContent(recipeData);
}


function createRecipeContent(recipe) {
    let contentDiv = $("#content");
    contentDiv.empty();

    // TODO: make sure missing names don't fuck up the view
    let name = lang === 'fr' && recipe.nameFR ? recipe.nameFR : recipe.name;
    let ingredients = lang === 'fr' && recipe.ingredientsFR ? recipe.ingredientsFR : recipe.ingredients;
    let steps = lang === 'fr' && recipe.stepsFR ? recipe.stepsFR : recipe.steps;

    let html = `
        <button id="changeLang" onclick="changeLang()" >${lang === 'fr' ? 'Click here to see the english version!' : 'Cliquez ici pour voir la version française'}</button>
        <div class="recipe-container">
            <h1>${name}</h1>
            <p class="author">${lang === 'fr' ? 'Auteur' : 'Author'}: ${recipe.author || 'N/A'}</p>
            ${recipe.imageURL ? `<img src="${recipe.imageURL}" alt="${name}" class="recipe-image">` : ''}
            ${recipe.originalURL ? `<p><a href="${recipe.originalURL}" target="_blank">${lang === 'fr' ? 'Source originale' : 'Original Source'}</a></p>` : ''}

            <div class="ingredients-section">
                <h2>${lang === 'fr' ? 'Ingrédients' : 'Ingredients'}</h2>
                <ul>
                    ${ingredients.map(item => `<li>${item.quantity ? item.quantity + ' ' : ''}${item.name || (lang === 'fr' ? 'Non spécifié' : 'Not specified')}</li>`).join('')}
                </ul>
            </div>

            <div class="steps-section">
                <h2>${lang === 'fr' ? 'Instructions' : 'Instructions'}</h2>
                <ol>
                    ${steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>

            <div class="details-section">
                <h3>${lang === 'fr' ? 'Détails' : 'Details'}</h3>
                <p>${lang === 'fr' ? 'Régime' : 'Diet'}: ${recipe.diet || 'N/A'}</p>
                <p>${lang === 'fr' ? 'Difficulté' : 'Difficulty'}: ${recipe.difficulty || 'N/A'}</p>
                <p>${lang === 'fr' ? 'Sans gluten' : 'Gluten Free'}: ${recipe.is_gluten_free ? (lang === 'fr' ? 'Oui' : 'Yes') : (lang === 'fr' ? 'Non' : 'No')}</p>
                <p>${lang === 'fr' ? 'Sans produits laitiers' : 'Dairy Free'}: ${recipe.is_dairy_free ? (lang === 'fr' ? 'Oui' : 'Yes') : (lang === 'fr' ? 'Non' : 'No')}</p>
            </div>

            <div class="add-comment">
                <h3>${lang === 'fr' ? 'Ajouter un commentaire' : 'Add a Comment'}</h3>
                <textarea id="commentText" placeholder="${lang === 'fr' ? 'Votre commentaire...' : 'Your comment...'}"></textarea>
                <div class="image-upload">
                    <label for="commentImage">${lang === 'fr' ? 'Télécharger une image (facultatif)' : 'Upload Image (optional)'}:</label>
                    <input type="file" id="commentImage" accept="image/*">
                    <img id="imagePreview" src="#" alt="${lang === 'fr' ? 'Aperçu de l\'image' : 'Image Preview'}" style="display:none; max-width:100px; height:auto;">
                </div>
                <button onclick="submitComment('${recipe.id}')">${lang === 'fr' ? 'Envoyer le commentaire' : 'Submit Comment'}</button>
                <div id="commentStatus" class="status-message"></div>
            </div>

            ${recipe.comments && recipe.comments.length > 0 ? `
                <div class="comments-section">
                
                    <h2>${lang === 'fr' ? 'Commentaires' : 'Comments'}</h2>
                    <ul>
                        ${recipe.comments.map(comment => `
                            <li class="comment">
                                <p class="user">${comment.user_id}</p>
                                <p class="text">${comment.text}</p>
                                ${comment.image ? `<img src="/assets/comments/${comment.image}" alt="Comment Image" class="comment-image">` : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;

    contentDiv.append(html);
}

function submitComment(recipeId) {
    const userId = "medj364";
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
            console.log(response);
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
