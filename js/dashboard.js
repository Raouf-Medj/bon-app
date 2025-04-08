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

    // Approve role request
    $(document).on('click', '.validateRole', function () {
        let userItem = $(this).closest('.req-user-item');

        openModal(`
            <h3>Approuver cette demande de rôle ?</h3>
            <button id="confirmValidateRole" style="background:#88e058;color:white;">Approuver</button>
        `);
    
        $(document).off('click', '#confirmValidateRole').on('click', '#confirmValidateRole', async function () {
            try {
                await validateRole(userItem.attr('id'));

                userItem.removeClass('req-user-item').addClass('user-item');
                userItem.find('.validateRole').remove();
                userItem.find('.userrole').text(userItem.find('.userrole').text().replace("request", ""));

                $('#popupModal').fadeOut();
            } catch (error) {
                console.error("Validation failed:", error);
                $('#popupModal').html('<p>Échec de la validation. Veuillez réessayer.</p>');
            }
        });
    });


    // Add recipe modal
    const recipeModal = $('#recipeModal');
    $('#addRecipeBtn').click(() => recipeModal.show());
    $('.close').click(() => recipeModal.hide());

    $('#addIngredient').click(function () {
        $('#ingredientsContainer').append(`
            <div class="ingredient-row">
                <input type="text" name="quantity[]" placeholder="Quantité" required>
                <input type="text" name="ingredientNameFR[]" placeholder="Nom (FR)" required>
                <input type="text" name="ingredientName[]" placeholder="Name (EN)" required>
                <input type="text" name="ingredientType[]" placeholder="Type">
            </div>
        `);
    });

    $('#recipeForm').submit(async function (e) {
        e.preventDefault();

        const formData = $(this).serializeArray();
        const recipe = {
            id: Math.random().toString(16).slice(2),
            validated: false
        };

        const ingredients = [], ingredientsFR = [], steps = [], stepsFR = [];

        formData.forEach(field => {
            if (field.name === "quantity[]") {
                ingredients.push({ quantity: field.value });
                ingredientsFR.push({ quantity: field.value });
            } else if (field.name === "ingredientName[]") {
                ingredients[ingredients.length - 1].name = field.value;
            } else if (field.name === "ingredientNameFR[]") {
                ingredientsFR[ingredientsFR.length - 1].name = field.value;
            } else if (field.name === "ingredientType[]") {
                ingredients[ingredients.length - 1].type = field.value;
                ingredientsFR[ingredientsFR.length - 1].type = field.value;
            } else if (field.name === "steps") {
                steps.push(...field.value.split('\n').filter(Boolean));
            } else if (field.name === "stepsFR") {
                stepsFR.push(...field.value.split('\n').filter(Boolean));
            } else if (field.name === "is_gluten_free" || field.name === "is_dairy_free") {
                recipe[field.name] = true;
            } else {
                recipe[field.name] = field.value;
            }
        });

        recipe.ingredients = ingredients;
        recipe.ingredientsFR = ingredientsFR;
        recipe.steps = steps;
        recipe.stepsFR = stepsFR;
        recipe.timers = steps.map(() => 1); // default
        recipe.imageURL = recipe.imageURL || "";
        recipe.originalURL = recipe.originalURL || "";

        console.log("New Recipe:", recipe);
        const recipeId = await addRecipe(recipe);
        console.log("Recipe added with ID:", recipeId);
        $("#recipeList").append(`
            <li id="${recipeId}" class="unvalidated-recipe-item">
                <div>
                    <span class="recipename">${recipe.nameFR}</span><span> (EN ATTENTE DE VALIDATION)</span>
                </div>
                <div class="actions">
                    <button class="validateRecipe">Valider</button>
                    <button class="editRecipe">Modifier</button>
                    <button class="deleteRecipe">Supprimer</button>
                </div>
            </li>
        `)
        recipeModal.hide();
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
        const requested = user.role == "requestCHEF" || user.role == "requestTRANSLATOR";
        const liClass = requested ? "req-user-item" : "user-item";
        const validationButton = !requested ? "" : `<button class="validateRole">Approuver</button>`;

        let listItem = `
            <li id="${user.id}" class="${liClass}">
                <div>
                    <span class="username">${user.username}</span>
                    <span class="userrole">( ${user.role} )</span>
                </div>
                <div class="actions">
                    ${validationButton}
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

async function validateRole(id) {
    try {
        let response = await $.ajax({
            url: "http://localhost:3000/api/userController.php",
            method: "POST",
            data: { 
                action: "validate-role",
                id: id
            }
        });
        return response;
    } catch (error) {
        console.error("Error validating role:", error);
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

async function editRecipe(recipe) {
    try {
        let response = await $.ajax({
            url: "http://localhost:3000/api/recipeController.php",
            method: "POST",
            data: { 
                action: "put",
                id: recipe.id,
                name: recipe.name,
                nameFR: recipe.nameFR,
                author: recipe.author,
                is_gluten_free: recipe.is_gluten_free,
                is_dairy_free: recipe.is_dairy_free,
                diet: recipe.diet,
                difficulty: recipe.difficulty,
                ingredients: JSON.stringify(recipe.ingredients),
                ingredientsFR: JSON.stringify(recipe.ingredientsFR),
                steps: JSON.stringify(recipe.steps),
                stepsFR: JSON.stringify(recipe.stepsFR),
                timers: JSON.stringify(recipe.timers),
                imageURL: recipe.imageURL,
                originalURL: recipe.originalURL
            }
        });
        return response;
    } catch (error) {
        console.error("Error editing recipe:", error);
    }
}

async function addRecipe(recipe) {
    try {
        let response = await $.ajax({
            url: "http://localhost:3000/api/recipeController.php",
            method: "POST",
            data: {
                action: "add",
                name: recipe.name,
                nameFR: recipe.nameFR,
                author: recipe.author,
                is_gluten_free: recipe.is_gluten_free,
                is_dairy_free: recipe.is_dairy_free,
                diet: recipe.diet,
                difficulty: recipe.difficulty,
                ingredients: JSON.stringify(recipe.ingredients),
                ingredientsFR: JSON.stringify(recipe.ingredientsFR),
                steps: JSON.stringify(recipe.steps),
                stepsFR: JSON.stringify(recipe.stepsFR),
                timers: JSON.stringify(recipe.timers),
                imageURL: recipe.imageURL,
                originalURL: recipe.originalURL
            }
        });
        return response;
    } catch (error) {
        console.error("Error adding recipe:", error);
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