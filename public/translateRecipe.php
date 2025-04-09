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
        <script src="/js/translateRecipe.js"></script>
        <div id="content"></div>
        <script>
        let recId = <?php echo json_encode($rec_id); ?>;
        console.log(recId);

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
