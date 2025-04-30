<?php
    include_once __DIR__.'/../components/session.php';

    if ($_SERVER['REQUEST_METHOD'] === 'GET' && (isset($_GET['action']))) {

        // GET: ~/api/recipeController.php?action=getall
        if ($_GET['action'] == 'getall') {
            $recipes = file_get_contents("../db/recipes.json");
            echo ($recipes ?? '[]');
        }


        // GET: ~/api/recipeController.php?action=get&id=[user_id]
        else if ($_GET['action'] == 'get') {
            if (isset($_GET['id'])) {
                $id = $_GET['id'];
                $recipes = json_decode(file_get_contents("../db/recipes.json"), true);
                $recipe = $recipes[$id] ?? null;
                if ($recipe !== null) {
                    echo json_encode($recipe, JSON_PRETTY_PRINT);
                }
                else {
                    http_response_code(404); echo '{"error" : "Recette introuvable"}';
                }
            }
            else {
                http_response_code(400); echo '{"error" : "ID is not defined"}';
            }
        }

        // GET: ~/api/recipeController.php?action=get&author=[userID]
        else if ($_GET['action'] == 'getbyauthor') {
            if (isset($_GET['author'])) {
                $users = json_decode(file_get_contents("../db/users.json"), true);
                $user = $users[$_GET['author']] ?? null;
                if ($user === null) {
                    http_response_code(404); echo '{"error" : "User not found"}';
                    exit;
                }
                $author = $user['username'];
                $recipes = json_decode(file_get_contents("../db/recipes.json"), true);
                $filtered_recipes = array_filter($recipes, function($recipe) use ($author) {
                    return $recipe['author'] == $author;
                });
                echo json_encode(array_values($filtered_recipes), JSON_PRETTY_PRINT);
            }
            else {
                http_response_code(400); echo '{"error" : "Author is not defined"}';
            }
        }

        // GET: ~/api/recipeController.php?action=get&category=[category]
        else if ($_GET['action'] == 'getbycategory') {
            if (isset($_GET['category'])) {
                $category = $_GET['category'];
                $recipes = json_decode(file_get_contents("../db/recipes.json"), true);
                
                # La logique de filtrage:
                if ($category == 'ALL') {
                    $filtered_recipes = $recipes;
                }
                else if ($category == 'FAVORIS') {
                    $filtered_recipes = array_filter($recipes, function($recipe) {
                        return $recipe['is-favorite'] == true;
                    });
                }
                else if ($category == 'VEGAN') {
                    $filtered_recipes = array_filter($recipes, function($recipe) {
                        return $recipe['diet'] == 'Vegan';
                    });
                }
                else if ($category == 'VÉGÉTARIEN') {
                    $filtered_recipes = array_filter($recipes, function($recipe) {
                        return $recipe['diet'] == 'Vegetarien';
                    });
                }
                else if ($category == 'SANS GLUTEN') {
                    $filtered_recipes = array_filter($recipes, function($recipe) {
                        return $recipe['is_gluten_free'] == true;
                    });
                }
                else if ($category == 'SANS LACTOSE') {
                    $filtered_recipes = array_filter($recipes, function($recipe) {
                        return $recipe['is_dairy_free'] == true;
                    });
                }
                else if ($category == 'EASY') {
                    $filtered_recipes = array_filter($recipes, function($recipe) {
                        return $recipe['difficulty'] == 'Easy';
                    });
                }
                else if ($category == 'MEDIUM') {
                    $filtered_recipes = array_filter($recipes, function($recipe) {
                        return $recipe['difficulty'] == 'Medium';
                    });
                }
                else if ($category == 'HARD') {
                    $filtered_recipes = array_filter($recipes, function($recipe) {
                        return $recipe['difficulty'] == 'Hard';
                    });
                }
                else { http_response_code(400); echo '{"error" : "Invalid category"}'; exit; }

                echo json_encode(array_values($filtered_recipes), JSON_PRETTY_PRINT);
            }
            else {
                http_response_code(400); echo '{"error" : "Category is not defined"}';
            }
        }


        else if ($_GET['action'] == 'getbyquery') {
            if (isset($_GET['query'])) {
                $recipes = json_decode(file_get_contents("../db/recipes.json"), true);
                $filtered_recipes = array_filter($recipes, function($recipe) {
                    $query = $_GET['query'];
                    return (
                        str_contains(strtolower($recipe['name']), strtolower($query)) ||
                        str_contains(strtolower($recipe['nameFR']), strtolower($query)) ||
                        str_contains(strtolower($recipe['author']), strtolower($query))
                    );
                });
                echo json_encode(array_values($filtered_recipes), JSON_PRETTY_PRINT);
            }
            else {
                http_response_code(400); echo '{"error" : "query is not defined"}';
            }
        }


        else {
            http_response_code(400); echo '{"error" : "Invalid action"}';
        }

    }

    else if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
        
        // POST: ~/api/recipeController.php {params in request body}
        if ($_POST['action'] == 'add') {
            if (isset($_POST['name'])) { 

                $recipes = json_decode(file_get_contents("../db/recipes.json"), true);
                $found = null;
                foreach ($recipes as $id => $recipe) {
                    if ($recipe['name'] === $_POST['name']) {
                        $found = $recipe;
                    }
                }
                if ($found === null) {
                    $new_recipe['id'] = uniqid();
                    $new_recipe['validated'] = false;
                    $new_recipe['name'] = $_POST['name'];
                    $new_recipe['nameFR'] = $_POST['nameFR'];
                    $new_recipe['author'] = $_POST['author'];
                    $new_recipe['is_gluten_free'] = filter_var($_POST['is_gluten_free'], FILTER_VALIDATE_BOOLEAN);
                    $new_recipe['is_dairy_free'] = filter_var($_POST['is_dairy_free'], FILTER_VALIDATE_BOOLEAN);
                    $new_recipe['diet'] = $_POST['diet'];
                    $new_recipe['difficulty'] = $_POST['difficulty'];
                    $new_recipe['ingredients'] = json_decode($_POST['ingredients'], true);
                    $new_recipe['ingredientsFR'] = json_decode($_POST['ingredientsFR'], true);
                    $new_recipe['steps'] = json_decode($_POST['steps'], true);
                    $new_recipe['stepsFR'] = json_decode($_POST['stepsFR'], true);
                    $new_recipe['timers'] = json_decode($_POST['timers'], true);
                    $new_recipe['originalURL'] = $_POST['originalURL'];

                    if (isset($_FILES['localImage'])) {
                        if ($_FILES["localImage"]["error"] !== 0) {
                            http_response_code(400); echo '{"error" : "Could not save file due to code: '.$_FILES["image"]["error"].'"}';
                            return;
                        }
                        $new_recipe["localImage"] = $_FILES['localImage']['tmp_name'];
                        $uploadDir = __DIR__."/../assets/images/recipes";
                        if (!is_dir($uploadDir)) {
                            http_response_code(500); echo '{"error" : "Invalid directory for recipe images"}';
                            return;
                        }
                        $uploadPath = $uploadDir."/".$new_recipe['id'].".png";

                        if (!is_uploaded_file($new_recipe["localImage"])) {
                            http_response_code(500);
                            echo '{ "error": "File upload failed"}';
                            return;
                        } elseif (!is_writable($uploadDir)) {
                            http_response_code(500);
                            echo '{ "error": "Server has not permission to write on directory" }';
                            return;
                        } 

                        $is_saved = move_uploaded_file($new_recipe["localImage"], $uploadPath);

                        if (!$is_saved) {
                            var_dump($is_saved);
                            http_response_code(500); echo '{"error" : "Could not save file due to: '.$is_saved.'"}';
                            return;
                        }
                        $new_recipe["localImage"] = $uploadPath;

                    } else {
                        $new_recipe["localImage"] = null;
                    }

                    $new_recipe['imageURL'] = $_POST['imageURL'];

                    $recipes[$new_recipe['id']] = $new_recipe;
                    file_put_contents("../db/recipes.json", json_encode($recipes, JSON_PRETTY_PRINT));

                    echo '{"id" : "'.$new_recipe['id'].'"}';
                }
                else { http_response_code(409); echo '{"error" : "Nom de recette déjà existant"}'; }
            } 
            else { http_response_code(400); echo '{"error" : "Missing name"}'; }
        }


        // POST: ~/api/recipeController.php {params in request body}
        else if($_POST['action'] == 'put') {
            if (isset($_POST['id'])) { 
                $id = $_POST['id'];
                $recipes = json_decode(file_get_contents("../db/recipes.json"), true);
                $old_recipe = $recipes[$id] ?? null;

                if ($old_recipe !== null) {
                    function set_attr($attr, &$modified, $old, $is_obj) {
                        if (isset($_POST[$attr])) {
                            if ($is_obj) { $modified[$attr] = json_decode($_POST[$attr], true); }
                            else {
                                if (in_array($attr, ['is_gluten_free', 'is_dairy_free', 'validated'])) {
                                    $modified[$attr] = filter_var($_POST[$attr], FILTER_VALIDATE_BOOLEAN);
                                }
                                else {
                                    $modified[$attr] = $_POST[$attr];
                                }
                            }
                        }
                        else { $modified[$attr] = $old[$attr]; }
                    }

                    $modified_recipe['id'] = $id;
                    set_attr('validated', $modified_recipe, $old_recipe, false);
                    set_attr('name', $modified_recipe, $old_recipe, false);
                    set_attr('nameFR', $modified_recipe, $old_recipe, false);
                    set_attr('author', $modified_recipe, $old_recipe, false);
                    set_attr('is_gluten_free', $modified_recipe, $old_recipe, false);
                    set_attr('is_dairy_free', $modified_recipe, $old_recipe, false);
                    set_attr('diet', $modified_recipe, $old_recipe, false);
                    set_attr('difficulty', $modified_recipe, $old_recipe, false);
                    set_attr('imageURL', $modified_recipe, $old_recipe, false);
                    set_attr('originalURL', $modified_recipe, $old_recipe, false);
                    set_attr('ingredients', $modified_recipe, $old_recipe, true);
                    set_attr('ingredientsFR', $modified_recipe, $old_recipe, true);
                    set_attr('steps', $modified_recipe, $old_recipe, true);
                    set_attr('stepsFR', $modified_recipe, $old_recipe, true);
                    set_attr('timers', $modified_recipe, $old_recipe, true);

                    if (isset($_FILES['localImage'])) {
                        if ($_FILES["localImage"]["error"] !== 0) {
                            http_response_code(400); echo '{"error" : "Could not save file due to code: '.$_FILES["image"]["error"].'"}';
                            return;
                        }
                        $modified_recipe["localImage"] = $_FILES['localImage']['tmp_name'];
                        $uploadDir = __DIR__."/../assets/images/recipes";
                        if (!is_dir($uploadDir)) {
                            http_response_code(500); echo '{"error" : "Invalid directory for recipe images"}';
                            return;
                        }
                        $uploadPath = $uploadDir."/".$modified_recipe['id'].".png";

                        if (!is_uploaded_file($modified_recipe["localImage"])) {
                            http_response_code(500);
                            echo '{ "error": "File upload failed"}';
                            return;
                        } elseif (!is_writable($uploadDir)) {
                            http_response_code(500);
                            echo '{ "error": "Server has not permission to write on directory" }';
                            return;
                        } 

                        $is_saved = move_uploaded_file($modified_recipe["localImage"], $uploadPath);

                        if (!$is_saved) {
                            var_dump($is_saved);
                            http_response_code(500); echo '{"error" : "Could not save file due to: '.$is_saved.'"}';
                            return;
                        }
                        $modified_recipe["localImage"] = $uploadPath;

                    } else {
                        $modified_recipe["localImage"] = $old_recipe["localImage"];
                    }

                    $recipes[$modified_recipe['id']] = $modified_recipe;
                    file_put_contents("../db/recipes.json", json_encode($recipes, JSON_PRETTY_PRINT));
                    echo '{"recipe" : '.json_encode($modified_recipe, JSON_PRETTY_PRINT).'}';
                }
                else { http_response_code(404); echo '{"error" : "Recette introuvable"}'; }
            } 
            else { http_response_code(400); echo '{"error" : "Missing id"}'; }
        }

        // POST: ~/api/recipeController.php {params in request body}
        else if($_POST['action'] == 'delete') {
            if (isset($_POST['id'])) { 
                $id = $_POST['id'];
                $recipes = json_decode(file_get_contents("../db/recipes.json"), true);
                $recipe = $recipes[$id] ?? null;

                if ($recipe !== null) {
                    if ($recipe['localImage'] !== null) {
                        if (file_exists($recipe['localImage'])) {
                            unlink($recipe['localImage']);
                        }
                    }

                    unset($recipes[$id]);
                    file_put_contents("../db/recipes.json", json_encode($recipes, JSON_PRETTY_PRINT));
                    echo '{"id" : "'.$recipe['id'].'"}';
                }
                else { http_response_code(404); echo '{"error" : "Recette introuvable"}'; }
            } 
            else { http_response_code(400); echo '{"error" : "Missing id"}'; }
        }

        // POST: ~/api/recipeController.php {params in request body}
        else if($_POST['action'] == 'addComment') {
            if (isset($_POST['id'])) { 
                $id = $_POST['id'];
                $recipes = json_decode(file_get_contents("../db/recipes.json"), true);
                $recipe = $recipes[$id] ?? null;

                if ($recipe !== null) {
                    if (!isset($_POST['user_id'])) {
                        http_response_code(400); echo '{"error" : "Missing user"}';
                        return;
                    }
                    if (!isset($_POST['user_name'])) {
                        http_response_code(400); echo '{"error" : "Missing user name"}';
                        return;
                    }
                    if (!isset($_POST['text'])) {
                        http_response_code(400); echo '{"error" : "Missing text"}';
                        return;
                    }
                    $comment = [];
                    $comment["comment_id"] = uniqid(); 
                    //TODO: check if user exists and if user id and user name match
                    $comment["user_id"] = $_POST['user_id'];
                    $comment["user_name"] = $_POST['user_name'];

                    $comment["text"] = $_POST['text'];
                    if (isset($_FILES['image'])) {
                        if ($_FILES["image"]["error"] !== 0) {
                            http_response_code(400); echo '{"error" : "Could not save file due to code: '.$_FILES["image"]["error"].'"}';
                            return;
                        }
                        $comment["image"] =  uniqid();
                        $file = $_FILES['image']['tmp_name'];
                        $uploadDir = __DIR__."/../assets/images/comments";
                        if (!is_dir($uploadDir)) {
                            http_response_code(500); echo '{"error" : "Invalid directory for comment images"}';
                            return;
                        }
                        $uploadPath = $uploadDir."/".$comment['image'].".png";

                        if (!is_uploaded_file($file)) {
                            http_response_code(500);
                            echo '{ "error": "File upload failed"}';
                            return;
                        } elseif (!is_writable($uploadDir)) {
                            http_response_code(500);
                            echo '{ "error": "Server has not permission to write on directory" }';
                            return;
                        } 

                        $is_saved = move_uploaded_file($file, $uploadPath);
                        if (!$is_saved) {
                            var_dump($is_saved);
                            http_response_code(500); echo '{"error" : "Could not save file due to: '.$is_saved.'"}';
                            return;
                        }
                    } else {
                        $comment["image"] = null;
                    }

                    array_push($recipes[$id]["comments"], $comment);
                    file_put_contents("../db/recipes.json", json_encode($recipes, JSON_PRETTY_PRINT));
                    echo '{ "success": ' . json_encode($recipes[$id]) . ' }';
                }
                else { http_response_code(404); echo '{"error" : "Recette introuvable"}'; }
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
