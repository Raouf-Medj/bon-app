<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/footer.css">
</head>
<body>
    <footer class="footer_container">
        <div class="inner_container">
            <div class="overline">
                <a href="/" onclick="
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                    });"
                >
                    <img class="footer_logo" src="../assets/images/website/logo_white.png" alt="BonApp logo">
                </a>

                <button id="scrollbutton" onclick="
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                    });"
                >
                    <h1 class='scrollbuttontext'>Haut de page</h1> 
                    <i class="uil uil-arrow-up arrowup"></i>  
                </button>

                <div class="links">
                    <a class="link" href="https://www.instagram.com" target="_blank"><i class="uil uil-instagram"></i></a>
                    <a class="link" href="https://www.x.com" target="_blank" style="margin-left: 1rem;"><i class="uil uil-twitter-alt"></i></a>
                    <a class="link" href="https://www.facebook.com" target="_blank" style="margin-left: 1rem; margin-right: 1rem;"><i class="uil uil-facebook-f"></i></a>
                    <a class="link" href="mailto:contact@bonapp.fr" target="_blank"><i class="uil uil-at"></i></a>
                </div>
            </div>

            <div class='separator'></div>

            <div class='copyright'>
                <div>©<span class='year'>2025</span><span class='brand'>BonApp</span></div>
                <a href="/public/about.php
                " class="foot_link">À Propos</a>
            </div>
        </div>
    </footer>
</body>
</html>