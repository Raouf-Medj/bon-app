<?php
    include_once __DIR__.'/../components/session.php';

    if ($_SERVER['REQUEST_METHOD'] === 'GET' && (isset($_GET['action']))) {

        // getFavorites
        // GET: ~/api/favoriteController.php?action=getFavorites
        if ($_GET['action'] === 'get') {
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo '{"error" : "ID is not defined"}';
                return;
            }

            $id = $_GET['id'];
            $users = json_decode(file_get_contents("../db/users.json"), true);
            $user = $users[$id] ?? null;

            if ($user === null) {
                http_response_code(404);
                echo '{"error" : "Utilisateur introuvable"}';
                return;
            }
            
            $favorites = $user['favorites'];
            echo json_encode($favorites, JSON_PRETTY_PRINT);
        }
        
        else {
            http_response_code(400);
            echo '{"error": "Invalid action"}';
        }
    }

    else if ($_SERVER['REQUEST_METHOD'] === 'POST' && (isset($_POST['action']))) {

        // addFavorite
        if ($_POST['action'] === 'add') {
            if (!isset($_POST['id_usr']) || !isset($_POST['id_rec'])) {
                http_response_code(400);
                echo '{"error": "Missing user or recipe id\'s."}';
                return;
            }
            $id_usr = $_POST['id_usr'];
            $id_rec = $_POST['id_rec'];
            $users = json_decode(file_get_contents('../db/users.json'), true);

            $user = $users[$id_usr] ?? null;
            if ($user === null) {
                http_response_code(404);
                echo 'Utilisateur introuvable.';
                return;
            }

            $recs = json_decode(file_get_contents('../db/recipes.json'), true);

            $rec = $recs[$id_rec] ?? null;
            if ($rec === null) {
                http_response_code(404);
                echo 'Recette introuvable.';
                return;
            }

            if (in_array($id_rec, $user['favorites'])) {
                echo "{\"id\": $id_usr, \"rec\": $id_rec}";
                return;
            }
            
            array_push($users[$id_usr]['favorites'], $id_rec);

            $save_succ = file_put_contents('../db/users.json', json_encode($users, JSON_PRETTY_PRINT));

            if ($save_succ === false) {
                http_response_code(500);
                echo json_encode(["error" => "Failed to save file."]);
                return;
            }
            
            echo "{\"id\": $id_usr, \"rec\": $id_rec}";
            
        }

        // deleteFavorite
        else if ($_POST['action'] === 'delete') {
            if (!isset($_POST['id_usr']) || !isset($_POST['id_rec'])) {
                http_response_code(404);
                echo '{"error": "Missing user or recipe id\'s."}';
                return;
            }
            $id_usr = $_POST['id_usr'];
            $id_rec = $_POST['id_rec'];
            $users = json_decode(file_get_contents('../db/users.json'), true);

            $user = $users[$id_usr] ?? null;
            if ($user === null) {
                http_response_code(404);
                echo 'Utilisateur introuvable.';
                return;
            }

            $recs = json_decode(file_get_contents('../db/recipes.json'), true);

            $rec = $recs[$id_rec] ?? null;
            if ($rec === null) {
                http_response_code(404);
                echo 'Recette introuvable.';
                return;
            }

            if (!in_array($id_rec, $user['favorites'])) {
                http_response_code(404);
                echo 'Cette recette n\'est pas un favorite.';
                return;
            }
            
            $index = array_search($id_rec, $users[$id_usr]['favorites']);
            unset($users[$id_usr]['favorites'][$index]);
            $users[$id_usr]['favorites'] = array_values($users[$id_usr]['favorites']);

            $save_succ = file_put_contents('../db/users.json', json_encode($users, JSON_PRETTY_PRINT));

            if ($save_succ === false) {
                http_response_code(500);
                echo json_encode(["error" => "Failed to save file."]);
                return;
            }
            
            echo "{\"id\": $id_usr, \"rec\": $id_rec}";
            
        }
        else {
            http_response_code(400);
            echo '{"error": "Invalid action"}';
        }
    }
    
    else {
        http_response_code(400);
        echo '{"error" : "invalid request, use GET or POST only, and specify an \'action\' (in the params for GET) or (in the request body for POST)"}';
    }
?>
