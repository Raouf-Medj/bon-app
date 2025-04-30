<?php
    include_once __DIR__.'/../components/navbar.php';
    $rec_id = isset($_GET["rec_id"]) ? $_GET["rec_id"] : "none";
    $lang = 'fr';
?>

<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BonApp! - Recette</title>
    <link href="./../css/global.css" rel="stylesheet">
    <link href="./../css/recipe.css" rel="stylesheet">
</head>
<body>
    <script src="/js/recipe.js"></script>
    <div id="content"></div>
    <script>
        let recId = <?php echo json_encode($rec_id); ?>;
        //let currentLang = <?php echo json_encode($lang); ?>;

        if (recId != "none") {
            fetchRecipe(recId);
        } else {
            loadMissingIdPage();
        }
    </script>
</body>
</html>

<?php
    include_once __DIR__.'/../components/footer.php';
?>
