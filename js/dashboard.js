$(document).ready(function () {
    // Load users on page load
    loadUsers();

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