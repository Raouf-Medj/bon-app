$(document).ready(async function () {
    // Load users on page load
    const session = await fetchSession();
    loadUsers(session.userRole);
    loadRecipes(session.userRole, session.userId);

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
        if (currentName == "") {
            userItem = $(this).closest('.req-user-item');
            currentName = userItem.find('.username').text();
        }
        let currentRole = userItem.find('.userrole').text();
        
        openModal(`
            <h3>Modifier l'utilisateur</h3>
            <label for="editName">Nom d'utilisateur:</label><br>
            <input type="text" id="editName" value="${currentName}" style="width: 350px; padding: 8px;"><br>
            <div style="margin-bottom: 15px;">
                <label for="editRole">Rôle:</label><br>
                <select id="editRole" style="width: 350px; padding: 8px;">
                    <option value="COOK" ${currentRole === '( COOK )' ? 'selected' : ''}>Cuisinier</option>
                    <option value="CHEF" ${currentRole === '( CHEF )' ? 'selected' : ''}>Chef</option>
                    <option value="TRANSLATOR" ${currentRole === '( TRANSLATOR )' ? 'selected' : ''}>Traducteur</option>
                    <option value="ADMIN" ${currentRole === '( ADMIN )' ? 'selected' : ''}>Administrateur</option>
                    <option value="requestTRANSLATOR" ${currentRole === '( requestTRANSLATOR )' ? 'selected' : ''}>Demandeur traducteur</option>
                    <option value="requestCHEF" ${currentRole === '( requestCHEF )' ? 'selected' : ''}>Demandeur chef</option>
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
                userItem.find('.userrole').text(`( ${newRole} )`);
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
    $(document).on('click', '.editRecipe', async function () {
        let recipeId = $(this).closest('.recipe-item').attr('id');
        if (recipeId == undefined) {
            recipeId = $(this).closest('.unvalidated-recipe-item').attr('id');
        }
        const recipe = await getRecipe(recipeId);
        
        $('#recipeForm')[0].reset(); // clear any previous values
        $('#recipeForm').data('edit-mode', true);     // mark we're editing
        $('#recipeForm').data('edit-id', recipeId);  

        $('#recipeForm input[name="name"]').val(recipe.name || '');
        $('#recipeForm input[name="nameFR"]').val(recipe.nameFR || '');
        $('#recipeForm input[name="author"]').val(recipe.author || '');
        $('#recipeForm input[name="imageURL"]').val(recipe.imageURL || '');
        $('#recipeForm input[name="originalURL"]').val(recipe.originalURL || '');

        $('#recipeForm select[name="diet"]').val(recipe.diet || 'Omnivore');
        $('#recipeForm select[name="difficulty"]').val(recipe.difficulty || 'Easy');

        $('#recipeForm input[name="is_gluten_free"]').prop('checked', !!recipe.is_gluten_free);
        $('#recipeForm input[name="is_dairy_free"]').prop('checked', !!recipe.is_dairy_free);

        // Clear and add ingredients
        $('#ingredientsContainer').empty();
        const ingLen = recipe.ingredients.length || recipe.ingredientsFR.length || 0;
        for (let i = 0; i < ingLen; i++) {
            const ing = recipe.ingredients?.[i] ?? {};
            const ingFR = recipe.ingredientsFR?.[i] ?? {};
            addIngredientRow(session.userRole, ing.quantity || '', ing.name || '', ingFR.name || '', ing.type || '');
        }

        // Clear and add steps
        $('#steps-list').empty();
        const stepLen = recipe.steps.length || recipe.stepsFR.length || 0;
        for (let i = 0; i < stepLen; i++) {
            addStepRow(session.userRole, recipe.steps?.[i] || '', recipe.stepsFR?.[i] || '', recipe.timers?.[i] || 0);
        }

        $('#recipeModal').show();
    });
  
    // Delete recipe
    $(document).on('click', '.deleteRecipe', function () {
        let recipeItem = $(this).closest('.recipe-item');
        let recipeId = recipeItem.attr('id');
        if (recipeId == undefined) {
            recipeItem = $(this).closest('.unvalidated-recipe-item');
            recipeId = recipeItem.attr('id');
        }
        openModal(`
            <h3>Supprimer cette recette ?</h3>
            <p>Cette action est irréversible.</p>
            <button id="confirmDeleteRecipe" style="background:#f44336;color:white;">Supprimer</button>
        `);
    
        $(document).off('click', '#confirmDeleteRecipe').on('click', '#confirmDeleteRecipe', async function () {
            await deleteRecipe(recipeId);
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
    $('#addRecipeBtn').click(async () => { 
        $('#recipeForm')[0].reset();
        $('#recipeForm').data('edit-mode', false);     // mark we're NOT editing
        $('#ingredientsContainer').empty();
        $('#steps-list').empty();

        const session = await fetchSession();
        if (session.userRole == 'CHEF') {
            const user = await fetchUser(session.userId);
            $('#recipeForm input[name="author"]').val(user.username || '');
        }
        recipeModal.show(); 
    });

    $('.close').click(() => recipeModal.hide());

    $('#addIngredient').click(function () {
        addIngredientRow(session.userRole);
    });

    $('#ingredientsContainer').on('click', '.remove-ingredient', function () {
        $(this).parent().remove();
    });

    $('#add-step').on('click', function () {
        addStepRow(session.userRole);
    });
      
    $('#steps-list').on('click', '.remove-step', function () {
        $(this).parent().remove();
    });

    // Recipe form submission (add / edit / translate)
    $('#recipeForm').submit(async function (e) {
        e.preventDefault();
        
        const formData = $(this).serializeArray();
        const recipe = {};
    
        const ingredients = [], ingredientsFR = [];
        const steps = [], stepsFR = [], timers = [];
    
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
            } else if (field.name === "step_en[]") {
                steps.push(field.value);
            } else if (field.name === "step_fr[]") {
                stepsFR.push(field.value);
            } else if (field.name === "step_timer[]") {
                const min = parseInt(field.value, 10);
                timers.push(isNaN(min) ? 0 : min);
            } else if (field.name === "is_gluten_free" || field.name === "is_dairy_free") {
                recipe[field.name] = true;
            } else {
                recipe[field.name] = field.value;
            }

            if (recipe.is_gluten_free == undefined) {
                recipe.is_gluten_free = false;
            }
            if (recipe.is_dairy_free == undefined) {
                recipe.is_dairy_free = false;
            }
        });
    
        recipe.ingredients = ingredients;
        recipe.ingredientsFR = ingredientsFR;
        recipe.steps = steps;
        recipe.stepsFR = stepsFR;
        recipe.timers = timers;
        recipe.imageURL = recipe.imageURL || "";
        recipe.originalURL = recipe.originalURL || "";
    
        const isEdit = $('#recipeForm').data('edit-mode');
    
        if (isEdit) {
            recipe.id = $('#recipeForm').data('edit-id');
            recipe.validated = false;
            await editRecipe(recipe);
        }
        else {
            const recipeId = await addRecipe(recipe);
            addRecipeRow(recipeId, recipe.nameFR, false);
        }
        recipeModal.hide();
    });    
});

function addRecipeRow(id, nameFR, role = 'ADMIN', validated = true) {
    const validateText = validated ? "" : " (EN ATTENTE DE VALIDATION)";
    const liClass = validated ? "recipe-item" : "unvalidated-recipe-item";
    const validateButton = (role == 'ADMIN' && !validated) ? `<button class="validateRecipe">Valider</button>` : '';
    const editButton = (role == 'ADMIN' || role == 'CHEF') ? `<button class="editRecipe">Modifier</button>` : '';
    const deleteButton = (role == 'ADMIN') ? `<button class="deleteRecipe">Supprimer</button>` : '';
    const translateButton = (role == 'TRANSLATOR') ? `<button class="editRecipe">Traduire</button>` : '';

    $("#recipeList").append(`
        <li id="${id}" class="${liClass}">
            <div>
                <span class="recipename">${nameFR}</span><span class="validatetext">${validateText}</span>
            </div>
            <div class="actions">
                ${validateButton}
                ${editButton}
                ${deleteButton}
                ${translateButton}
            </div>
        </li>
    `);
}

function addIngredientRow(role, quantity = '', name = '', nameFR = '', type = '') {
    const disabled = role == 'TRANSLATOR' ? 'disabled' : '';
    $('#ingredientsContainer').append(`
        <div class="ingredient-row">
            <input type="text" name="quantity[]" value="${quantity}" placeholder="Quantité" required>
            <input type="text" name="ingredientNameFR[]" value="${nameFR}" placeholder="Nom (FR)" required>
            <input type="text" name="ingredientName[]" value="${name}" placeholder="Name (EN)" required>
            <input type="text" name="ingredientType[]" value="${type}" placeholder="Type">
            <button type="button" class="remove-ingredient" ${disabled}>❌</button>
        </div>
    `);
}

function addStepRow(role, stepEN = '', stepFR = '', timer = 0) {
    const disabled = role == 'TRANSLATOR' ? 'disabled' : '';
    $('#steps-list').append(`
        <div class="step-row">
          <input type="text" name="step_fr[]" value="${stepFR}" placeholder="Étape en français">
          <input type="text" name="step_en[]" value="${stepEN}" placeholder="Step in English">
          <input type="number" name="step_timer[]" value="${timer}" placeholder="Durée (min)" min="0">
          <button type="button" class="remove-step" ${disabled}>❌</button>
        </div>
      `);
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

async function displayRecipes(recipes) {
    const session = await fetchSession();
    let recipeList = $("#recipeList");
    recipeList.empty();

    Object.values(recipes).forEach(recipe => {
        addRecipeRow(recipe.id, recipe.nameFR, session.userRole, recipe.validated);
    });
}


// AJAX functions
function loadUsers(role) {
    if (role == 'ADMIN') {
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
        });
    }
}

function loadRecipes(role, userId) {
    if (role == 'CHEF') {
        $.ajax({
            url: "http://localhost:3000/api/recipeController.php",
            method: "GET",
            data: { 
                action: "getbyauthor",
                author: userId
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
                action: "getall"
            }
        })
        .done(function (data) {
            displayRecipes(JSON.parse(data));
        })
        .fail(function (err) {
            console.log(err);
        });
    }
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

async function getRecipe(id) {
    try {
        let response = await $.ajax({
            url: "http://localhost:3000/api/recipeController.php",
            method: "GET",
            data: { 
                action: "get",
                id: id
            }
        });
        return JSON.parse(response);
    } catch (error) {
        console.error("Error getting recipe:", error);
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
        return JSON.parse(response).id;
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
                validated: recipe.validated,
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
        return JSON.parse(response).id;
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

async function fetchSession() {
    try {
        const sessionData = await $.ajax({
            url: "http://localhost:3000/api/userController.php",
            method: "GET",
            data: { action: "getsession" }
        });
        return JSON.parse(sessionData);
    } catch (err) {
        console.error("Error fetching session:", err);
        return null;
    }
}

async function fetchUser(id) {
    try {
        const userData = await $.ajax({
            url: "http://localhost:3000/api/userController.php",
            method: "GET",
            data: { action: "get", id: id }
        });
        return JSON.parse(userData);
    } catch (err) {
        console.error("Error fetching user:", err);
        return null;
    }
}