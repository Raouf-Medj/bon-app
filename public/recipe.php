<?php
    include_once __DIR__.'/../components/navbar.php';
    $rec_id = isset($_GET["rec_id"]) ? $_GET["rec_id"] : "none";
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BonApp!</title>
    <link href="./../css/global.css" rel="stylesheet">
    <link href="./../css/index.css" rel="stylesheet">
</head>
<body>
        <script src="/js/recipe.js"></script>
        <div id="recipe"></div>
        <script>
        let recId = <?php echo json_encode($rec_id); ?>;
        console.log("eh");

        if (recId != "none") {
            fetchRecipe(recId);
        } else {
            loadDefaultPage();
        }
        </script>
</body>
</html>

<?php
    echo "<h1>". json_encode($rec_id)."</h1>"
?>
<?php
    include_once __DIR__.'/../components/footer.php';
?>
