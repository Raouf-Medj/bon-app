$(document).ready(function () {
    const button = $("#signupButton");
    let loading = false;

    button.on("click", function () {
        if (!loading) {
            loading = true;
            let usernameInputBox = $("#username_input_box");
            let emailInputBox = $("#email_input_box");
            let passwordInputBox = $("#password_input_box");
            let confirmpasswordInputBox = $("#confirmpassword_input_box");

            usernameInputBox.addClass("input_box").removeClass("input_box_error");
            emailInputBox.addClass("input_box").removeClass("input_box_error");
            passwordInputBox.addClass("input_box").removeClass("input_box_error");
            confirmpasswordInputBox.addClass("input_box").removeClass("input_box_error");
            button.addClass("loading").html(`<div class="loading-content">Connexion en cours...<img src="../assets/images/website/spinner1.gif" alt="Loading"/></div>`);

            let username = $("#username").val().trim();
            let email = $("#email").val().trim();
            let password = $("#password").val().trim();
            let confirmpassword = $("#confirmpassword").val().trim();
            let errorMessage = $("#error-message");

            errorMessage.text("");

            if (!username || !email || !password || !confirmpassword) {
                if (!username) {
                    usernameInputBox.removeClass("input_box").addClass("input_box_error");
                }
                if (!email) {
                    emailInputBox.removeClass("input_box").addClass("input_box_error");
                }
                if (!password) {
                    passwordInputBox.removeClass("input_box").addClass("input_box_error");
                }
                if (!confirmpassword) {
                    confirmpasswordInputBox.removeClass("input_box").addClass("input_box_error");
                }
                errorMessage.text("Veuillez remplir tous les champs");
                loading = false;
                button.removeClass("loading").text("S'inscrire");
                return;
            }

            let regex = /^[a-zA-Z0-9_]+$/;
            let regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (username.length < 8) {
                usernameInputBox.removeClass("input_box").addClass("input_box_error");
                errorMessage.text("Le nom d'utilisateur doit être composé de 8 caracters au minimum");
                loading = false;
                button.removeClass("loading").text("S'inscrire");
                return;
            }

            if (!regex.test(username)) {
                usernameInputBox.removeClass("input_box").addClass("input_box_error");
                errorMessage.text("Le nom d'utilisateur ne doit pas contenir des caracters speciaux");
                loading = false;
                button.removeClass("loading").text("S'inscrire");
                return;
            }

            if (!regexEmail.test(email)) {
                emailInputBox.removeClass("input_box").addClass("input_box_error");
                errorMessage.text("L'adresse email n'est pas valide");
                loading = false;
                button.removeClass("loading").text("S'inscrire");
                return;
            }

            if (password !== confirmpassword) {
                passwordInputBox.removeClass("input_box").addClass("input_box_error");
                confirmpasswordInputBox.removeClass("input_box").addClass("input_box_error");
                errorMessage.text("Les mots de passes ne sont pas identiques");
                loading = false;
                button.removeClass("loading").text("S'inscrire");
                return;
            }

            if (password.length < 8) {
                passwordInputBox.removeClass("input_box").addClass("input_box_error");
                errorMessage.text("Le mot de passe doit être composé de 8 caracters au minimum");
                loading = false;
                button.removeClass("loading").text("S'inscrire");
                return;
            }

            if (!regex.test(password)) {
                passwordInputBox.removeClass("input_box").addClass("input_box_error");
                errorMessage.text("Le mot de passe ne doit pas contenir des caracters speciaux");
                loading = false;
                button.removeClass("loading").text("S'inscrire");
                return;
            }

            $.ajax({
                url: "http://localhost:3000/api/userController.php",
                method: "POST",
                data: { 
                    action: "signup", 
                    username: username,
                    email: email,
                    password: password,
                    role: "COOK"
                }
            })
            .done(function (response) {
                // localStorage.setItem("token", response.access_token);
                // localStorage.setItem("role", response.role);
                // localStorage.setItem("user_id", response.id);
            
                // if (response.role === "COOK") {
                //     window.location.href = "/";
                // } else if (response.role === "TRANSLATOR") {
                //     window.location.href = "/translate";
                // } else if (response.role === "CHEF") {
                //     window.location.href = "/chefpage";
                // } else if (response.role === "ADMIN") {
                //     window.location.href = "/admin";
                // }
                window.location.href = "/";
            })
            .fail(function (xhr) {
                let err = null;
                err = JSON.parse(xhr.responseText);
                if (err && err.error) {
                    errorMessage.text(err.error);
                } else {
                    errorMessage.text("Une erreur est survenue.");
                }
            })
            .always(function () {
                loading = false;
                button.removeClass("loading").text("S'inscrire");
            });
        }
    });
});