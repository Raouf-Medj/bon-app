<?php
    include_once __DIR__.'/../components/session.php';

    if ($_SERVER['REQUEST_METHOD'] === 'GET' && (isset($_GET['action']))) {

        // GET: ~/api/userControllers.php?action=getall
        if ($_GET['action'] == 'getall') {
            $users = file_get_contents("../db/users.json");
            echo ($users ?? '[]');
        }

        // GET: ~/api/userControllers.php?action=get&id=[user_id]
        else if ($_GET['action'] == 'get') {
            if (isset($_GET['id'])) {
                $id = $_GET['id'];
                $users = json_decode(file_get_contents("../db/users.json"), true);
                $user = $users[$id] ?? null;
                if ($user !== null) {
                    echo json_encode($user, JSON_PRETTY_PRINT);
                }
                else {
                    http_response_code(404); echo '{"error" : "Utilisateur introuvable"}';
                }
            }
            else {
                http_response_code(400); echo '{"error" : "ID is not defined"}';
            }
        }


        else {
            http_response_code(400); echo '{"error" : "Invalid action"}';
        }

    }

    else if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
        
        // POST: ~/api/userControllers.php {params in request body}
        if ($_POST['action'] == 'signup') {
            if (isset($_POST['username'])) { 

                $users = json_decode(file_get_contents("../db/users.json"), true);
                $found_username = null;
                $found_email = null;
                foreach ($users as $id => $user) {
                    if ($user['username'] === $_POST['username']) {
                        $found_username = $user;
                    }
                    if ($user['email'] === $_POST['email']) {
                        $found_email = $user;
                    }
                }
                if ($found_username === null && $found_email === null) {
                    $new_user['username'] = $_POST['username'];
                    if (isset($_POST['email'])) { 
                        $new_user['email'] = $_POST['email'];
                        if (isset($_POST['password'])) { 
                            $new_user['password'] = password_hash($_POST['password'], PASSWORD_DEFAULT);
                            if (isset($_POST['role'])) { 
                                $new_user['role'] = $_POST['role'];
                                $new_user['id'] = uniqid();
                                $new_user['favorites'] = [];
    
                                $users[$new_user['id']] = $new_user;
                                file_put_contents("../db/users.json", json_encode($users, JSON_PRETTY_PRINT));

                                $_SESSION['userId'] = $new_user['id'];
                                $_SESSION['userRole'] = $new_user['role'];

                                echo '{"id" : '.$new_user['id'].'}';
                            } 
                            else { http_response_code(400); echo '{"error" : "Missing role"}'; }
                        } 
                        else { http_response_code(400); echo '{"error" : "Missing password"}'; }
                    } 
                    else { http_response_code(400); echo '{"error" : "Missing email"}'; }
                }
                else if ($found_username !== null) { http_response_code(409); echo '{"error" : "Nom d\'utilisateur déjà existant"}'; }
                else { http_response_code(409); echo '{"error" : "Adresse email déjà existante"}'; }
            } 
            else { http_response_code(400); echo '{"error" : "Missing username"}'; }
        }

        // POST: ~/api/userControllers.php {params in request body}
        else if ($_POST['action'] == 'signin') {
            if (isset($_POST['username'])) {
                $users = json_decode(file_get_contents("../db/users.json"), true);
                $found = null;
                foreach ($users as $id => $user) {
                    if ($user['username'] === $_POST['username']) {
                        $found = $user;
                    }
                }

                if ($found !== null) {
                    if (isset($_POST['password'])) {
                        if (password_verify($_POST['password'], $found['password'])) {

                            $_SESSION['userId'] = $found['id'];
                            $_SESSION['userRole'] = $found['role'];

                            echo '{"id" : '.$found['id'].'}';
                        }
                        else { http_response_code(401); echo '{"error" : "Mot de passe erroné"}'; }
                    }
                    else { http_response_code(400); echo '{"error" : "Missing password"}'; }
                }
                else { http_response_code(404); echo '{"error" : "Utilisateur introuvable"}'; }
            } 
            else { http_response_code(400); echo '{"error" : "Missing username"}'; }
        }

        // POST: ~/api/userControllers.php {params in request body}
        else if ($_POST['action'] == 'signout') {
            session_destroy();
        }

        else if ($_POST['action'] == 'getsession') {
            echo '{ "session" : "'.$_SESSION['userId'].'" }';
        }
        
        // POST: ~/api/userControllers.php {params in request body}
        else if ($_POST['action'] == 'put') {
            if (isset($_POST['id'])) { 
                $id = $_POST['id'];
                $users = json_decode(file_get_contents("../db/users.json"), true);
                $old_user = $users[$id] ?? null;

                if ($old_user !== null) {
                    if (isset($_POST['username'])) {
                        $modified_user['username'] = $_POST['username'];
                    }
                    else { $modified_user['username'] = $old_user['username']; }

                    if (isset($_POST['email'])) { 
                        $modified_user['email'] = $_POST['email'];
                    } 
                    else { $modified_user['email'] = $old_user['email']; }

                    if (isset($_POST['role'])) {
                        $modified_user['role'] = $_POST['role'];
                    }
                    else { $modified_user['role'] = $old_user['role']; }

                    $modified_user['password'] = $old_user['password'];
                    $modified_user['favorites'] = $old_user['favorites'];
                    $modified_user['id'] = $id;

                    $users[$modified_user['id']] = $modified_user;
                    file_put_contents("../db/users.json", json_encode($users, JSON_PRETTY_PRINT));
                    echo '{"user" : '.json_encode($modified_user, JSON_PRETTY_PRINT).'}';
                }
                else { http_response_code(404); echo '{"error" : "Utilisateur introuvable"}'; }
            } 
            else { http_response_code(400); echo '{"error" : "Missing id"}'; }
        }

        // POST: ~/api/userControllers.php {params in request body}
        else if ($_POST['action'] == 'delete') {
            if (isset($_POST['id'])) { 
                $id = $_POST['id'];
                $users = json_decode(file_get_contents("../db/users.json"), true);
                $user = $users[$id] ?? null;

                if ($user !== null) {
                    unset($users[$id]);
                    file_put_contents("../db/users.json", json_encode($users, JSON_PRETTY_PRINT));
                    echo '{"id" : '.$user['id'].'}';
                }
                else { http_response_code(404); echo '{"error" : "Utilisateur introuvable"}'; }
            } 
            else { http_response_code(400); echo '{"error" : "Missing id"}'; }
        }

        // POST: ~/api/userControllers.php {params in request body}
        else if ($_POST['action'] == 'request-role') {
            if (isset($_POST['id'])) {
                $id = $_POST['id'];
                $users = json_decode(file_get_contents("../db/users.json"), true);
                $user = $users[$id] ?? null;

                if ($user !== null) {
                    if ($user['role'] == 'COOK') {
                        if (isset($_POST['requested_role']) && ($_POST['requested_role'] == 'TRANSLATOR' || $_POST['requested_role'] == 'CHEF')) {
                            $user['role'] = 'request'.$_POST['requested_role'];

                            $users[$user['id']] = $user;
                            file_put_contents("../db/users.json", json_encode($users, JSON_PRETTY_PRINT));

                            echo '{"user" : '.json_encode($user, JSON_PRETTY_PRINT).'}';
                        }
                        else { http_response_code(400); echo '{"error" : "Can only request TRANSLATOR or CHEF roles"}'; }
                    }
                    else { http_response_code(400); echo '{"error" : "Only cooks can request roles"}'; }
                }
                else { http_response_code(404); echo '{"error" : "Utilisateur introuvable"}'; }
            } 
            else { http_response_code(400); echo '{"error" : "Missing id"}'; }
        }


        else {
            http_response_code(400); echo '{"error" : "Invalid action"}';
        }
    }

    else {
        http_response_code(400); echo '{"error" : "invalid request, use GET or POST only, and specify an \'action\' (in the params for GET) or (in the request body for POST)"}';
    }
?>