<?php
    include_once __DIR__.'/session.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/navbar.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="js/navbar.js"></script>
</head>
<body>

    <div>LINKS</div>



    <?php if (isset($_SESSION['userId'])) { ?>
        <span>Hello <?php echo $_SESSION['userId'] ?>!</span>
        <button id="signoutButton">Signout</button>
    <?php } else { ?>
        <a href="/public/signin.php">Signin</a>
    <?php } ?>
</body>
</html>