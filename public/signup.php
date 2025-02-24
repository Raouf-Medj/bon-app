<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signup</title>
    <link rel="stylesheet" href="../css/global.css">
    <link rel="stylesheet" href="../css/auth.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="../js/signup.js"></script>
</head>
<body>
    <div class="container">
        <div class="left_col_signup">
            <div class="bg2">
                <img
                    src="../assets/images/website/auth.png"
                    alt="img_auth_2"
                    class="img_auth"
                />
                <h2 class="greeting">Inscrivez-vous</h2>
                <div style="width: 100%;">
                    <label htmlFor="username">
                        Nom d'utilisateur
                    </label>
                    <div class="input_box" id="username_input_box">
                        <i class="uil uil-user input_icon"></i>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Entrer votre nom d'utilisateur"
                            class="auth_input"
                        />
                    </div>
                </div>
                <div style="margin-top: 5%; width: 100%;">
                    <label htmlFor="email">
                        Email
                    </label>
                    <div class="input_box" id="email_input_box">
                        <i class="uil uil-at input_icon"></i>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Entrer votre adresse email"
                            class="auth_input"
                        />
                    </div>
                </div>
                <div  style="margin-top: 5%; width: 100%;">
                    <label htmlFor="password">
                        Mot de passe
                    </label>
                    <div class="input_box" id="password_input_box">
                        <i class="uil uil-lock input_icon"></i>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Entrer votre mot de passe"
                            class="auth_input"
                        />
                    </div>
                </div>
                <div  style="margin-top: 5%; width: 100%;">
                    <label htmlFor="confirmpassword">
                        Confirmation du mot de passe
                    </label>
                    <div class="input_box" id="confirmpassword_input_box">
                        <i class="uil uil-lock input_icon"></i>
                        <input
                            type="password"
                            name="confirmpassword"
                            id="confirmpassword"
                            placeholder="Re-entrer votre mot de passe"
                            class="auth_input"
                        />
                    </div>
                </div>
                
                <div id='error-message'></div>

                <div class='button_container'>
                    <button id="signupButton" type="submit">S'inscrire</button>
                </div>
                <div class='text_under_button'>
                    <h3 class='question'>Vous n'avez pas de compte?</h3>
                    <a href="/public/signin.php" class='link'>Connectez-vous</a>
                </div>
            </div>
        </div>
        <div class="right_col_signup">
            <div class="img2">
                <div class="logo_signup"></div>
            </div>
        </div>
    </div>
</body>
</html>
