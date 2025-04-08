$(document).ready(function () {
    // Load users on page load
    loadUsers();
    loadRecipes();

    // Open modal with content
    function openModal(content) {
        $('#modalBody').html(content);
        $('#popupModal').fadeIn();
    }
  
    // Close modal
    $('.close').click(function () {
        $('#popupModal').fadeOut();
    });
  
    // Edit user
    $(document).on('click', '.editUser', function () {
        let userItem = $(this).closest('.user-item');
        let currentName = userItem.find('.username').text();
        let currentRole = userItem.find('.userrole').text();
        
        openModal(`
            <h3>Modifier l'utilisateur</h3>
            <label for="editName">Nom d'utilisateur:</label><br>
            <input type="text" id="editName" value="${currentName}" style="width: 350px; padding: 8px;"><br>
            <div style="margin-bottom: 15px;">
                <label for="editRole">Rôle:</label><br>
                <select id="editRole" style="width: 350px; padding: 8px;">
                    <option value="COOK" ${currentRole === 'COOK' ? 'selected' : ''}>Cuisinier</option>
                    <option value="CHEF" ${currentRole === 'CHEF' ? 'selected' : ''}>Chef</option>
                    <option value="TRANSLATOR" ${currentRole === 'TRANSLATOR' ? 'selected' : ''}>Traducteur</option>
                    <option value="ADMIN" ${currentRole === 'ADMIN' ? 'selected' : ''}>Administrateur</option>
                    <option value="requestTRANSLATOR" ${currentRole === 'requestTRANSLATOR' ? 'selected' : ''}>Demandeur traducteur</option>
                    <option value="requestCHEF" ${currentRole === 'requestCHEF' ? 'selected' : ''}>Demandeur chef</option>
                </select>
            </div>
            <button id="confirmEdit" style="background:#0891B2;color:white;">Enregistrer</button>
        `);
    
        $(document).off('click', '#confirmEdit').on('click', '#confirmEdit', async function () {
            let newName = $('#editName').val().trim();
            let newRole = $('#editRole').val().trim();
            if (newName) {
                await editUser(userItem.attr('id'), newName, newRole);
                userItem.find('.username').text(newName);
                userItem.find('.userrole').text(newRole);
                $('#popupModal').fadeOut();
            }
        });
    });
  
    // Delete user
    $(document).on('click', '.deleteUser', function () {
        let userItem = $(this).closest('.user-item');
        openModal(`
            <h3>Supprimer cet utilisateur ?</h3>
            <p>Cette action est irréversible.</p>
            <button id="confirmDelete" style="background:#f44336;color:white;">Supprimer</button>
        `);
    
        $(document).off('click', '#confirmDelete').on('click', '#confirmDelete', async function () {
            await deleteUser(userItem.attr('id'));
            userItem.remove();
            $('#popupModal').fadeOut();
        });
    });

    // Edit recipe
    $(document).on('click', '.editRecipe', function () {
        let userItem = $(this).closest('.recipe-item');
        let currentName = userItem.find('.nameFR').text();
        
        openModal(`
            <h3>Modifier l'utilisateur</h3>
            <label for="editName">Nom d'utilisateur:</label><br>
            <input type="text" id="editName" value="${currentName}" style="width: 350px; padding: 8px;"><br>
            <div style="margin-bottom: 15px;">

            </div>
            <button id="confirmEditRecipe" style="background:#0891B2;color:white;">Enregistrer</button>
        `);
    
        $(document).off('click', '#confirmEditRecipe').on('click', '#confirmEditRecipe', async function () {
            let newName = $('#editName').val().trim();
            let newRole = $('#editRole').val().trim();
            if (newName) {
                await editUser(userItem.attr('id'), newName, newRole);
                userItem.find('.username').text(newName);
                userItem.find('.userrole').text(newRole);
                $('#popupModal').fadeOut();
            }
        });
    });
  
    // Delete recipe
    $(document).on('click', '.deleteRecipe', function () {
        let recipeItem = $(this).closest('.recipe-item');
        openModal(`
            <h3>Supprimer cette recette ?</h3>
            <p>Cette action est irréversible.</p>
            <button id="confirmDeleteRecipe" style="background:#f44336;color:white;">Supprimer</button>
        `);
    
        $(document).off('click', '#confirmDeleteRecipe').on('click', '#confirmDeleteRecipe', async function () {
            await deleteRecipe(recipeItem.attr('id'));
            recipeItem.remove();
            $('#popupModal').fadeOut();
        });
    });

    // Validate recipe
    $(document).on('click', '.validateRecipe', function () {
        let recipeItem = $(this).closest('.unvalidated-recipe-item');
        let recipeId = recipeItem.attr('id');

        openModal(`
            <h3>Valider cette recette ?</h3>
            <button id="confirmValidateRecipe" style="background:#88e058;color:white;">Valider</button>
        `);
    
        $(document).off('click', '#confirmValidateRecipe').on('click', '#confirmValidateRecipe', async function () {
            try {
                await validateRecipe(recipeItem.attr('id'));

                recipeItem.removeClass('unvalidated-recipe-item').addClass('recipe-item');
                recipeItem.find('.validateRecipe').remove();
                recipeItem.find('span:contains("EN ATTENTE")').remove();

                $('#popupModal').fadeOut();
            } catch (error) {
                console.error("Validation failed:", error);
                $('#popupModal').html('<p>Échec de la validation. Veuillez réessayer.</p>');
            }
        });
    });
});

function loadUsers() {
    $.ajax({
        url: "http://localhost:3000/api/userController.php",
        method: "GET",
        data: { 
            action: "getall"
        }
    })
    .done(function (data) {
        displayUsers(JSON.parse(data));
    })
    .fail(function (err) {
        console.log(err);
    })
}

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

function displayUsers(users) {
    let userList = $("#userList");
    userList.empty();

    Object.values(users).forEach(user => {
        let listItem = `
            <li id="${user.id}" class="user-item">
                <div>
                    <span class="username">${user.username}</span>
                    <span class="userrole">( ${user.role} )</span>
                </div>
                <div class="actions">
                    <button class="editUser">Modifier</button>
                    <button class="deleteUser">Supprimer</button>
                </div>
            </li>
        `;
        userList.append(listItem);
    });
}

function displayRecipes(recipes) {
    let recipeList = $("#recipeList");
    recipeList.empty();

    Object.values(recipes).forEach(recipe => {
        const validationText = recipe.validated ? "" : " (EN ATTENTE DE VALIDATION)";
        const liClass = recipe.validated ? "recipe-item" : "unvalidated-recipe-item";
        const validationButton = recipe.validated ? "" : `<button class="validateRecipe">Valider</button>`;

        let listItem = `
            <li id="${recipe.id}" class="${liClass}">
                <div>
                    <span class="recipename">${recipe.nameFR}</span><span>${validationText}</span>
                </div>
                <div class="actions">
                    ${validationButton}
                    <button class="editRecipe">Modifier</button>
                    <button class="deleteRecipe">Supprimer</button>
                </div>
            </li>
        `;
        recipeList.append(listItem);
    });
}

async function deleteUser(id) {
    try {
        let response = await $.ajax({
            url: "http://localhost:3000/api/userController.php",
            method: "POST",
            data: { 
                action: "delete",
                id: id
            }
        });
        return response;
    } catch (error) {
        console.error("Error deleting user:", error);
    }
}

async function editUser(id, newName, newRole) {
    try {
        let response = await $.ajax({
            url: "http://localhost:3000/api/userController.php",
            method: "POST",
            data: { 
                action: "put",
                id: id,
                username: newName,
                role: newRole
            }
        });
        return response;
    } catch (error) {
        console.error("Error editing user:", error);
    }
}

async function deleteRecipe(id) {
    try {
        let response = await $.ajax({
            url: "http://localhost:3000/api/recipeController.php",
            method: "POST",
            data: { 
                action: "delete",
                id: id
            }
        });
        return response;
    } catch (error) {
        console.error("Error deleting recipe:", error);
    }
}

async function editRecipe(id, newName, newNameFR, newAuthor, newIsGlutenFree, newIsDairyFree, newDiet, newDifficulty, newIngredients, newSteps, newTimers, newImageURL, newOriginalURL) {
    try {
        let response = await $.ajax({
            url: "http://localhost:3000/api/recipeController.php",
            method: "POST",
            data: { 
                action: "put",
                id: id,
                name: newName,
                nameFR: newNameFR,
                author: newAuthor,
                is_gluten_free: newIsGlutenFree,
                is_dairy_free: newIsDairyFree,
                diet: newDiet,
                difficulty: newDifficulty,
                ingredients: newIngredients,
                steps: newSteps,
                timers: newTimers,
                imageURL: newImageURL,
                originalURL: newOriginalURL
            }
        });
        return response;
    } catch (error) {
        console.error("Error editing recipe:", error);
    }
}

async function validateRecipe(id) {
    try {
        let response = await $.ajax({
            url: "http://localhost:3000/api/recipeController.php",
            method: "POST",
            data: { 
                action: "put",
                id: id,
                validated: true
            }
        });
        return response;
    } catch (error) {
        console.error("Error validating recipe:", error);
    }
}