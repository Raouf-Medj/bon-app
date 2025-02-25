<?php
    include_once __DIR__.'/../components/session.php';

    if ($_SERVER['REQUEST_METHOD'] === 'GET' && (isset($_GET['action']))) {

        // GET: ~/api/recipeControllers.php?action=getall
        if ($_GET['action'] == 'getall') {
            $recipes = file_get_contents("../db/recipes.json");
            echo ($recipes ?? '[]');
        }


        // GET: ~/api/recipeControllers.php?action=get&id=[user_id]
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


        else {
            http_response_code(400); echo '{"error" : "Invalid action"}';
        }

    }

    else if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
        
        // POST: ~/api/recipeControllers.php {params in request body}
        if ($_POST['action'] == 'add') {
            if (isset($_POST['title'])) { 

                $recipes = json_decode(file_get_contents("../db/recipes.json"), true);
                $found = null;
                foreach ($recipes as $id => $recipe) {
                    if ($recipe['title'] === $_POST['title']) {
                        $found = $recipe;
                    }
                }
                if ($found === null) {
                    $new_recipe['title'] = $_POST['title'];
                    if (isset($_POST['language'])) { 
                        $new_recipe['language'] = $_POST['language'];
                        $new_recipe['id_pair'] = $_POST['id_pair'];
                        $new_recipe['description'] = $_POST['description'];
                        $new_recipe['author'] = $_POST['author'];
                        $new_recipe['photo-link'] = $_POST['photo-link'];
                        $new_recipe['cooking-time'] = $_POST['cooking-time'];
                        $new_recipe['ingredients'] = $_POST['ingredients'];
                        $new_recipe['steps'] = $_POST['steps'];
                        $new_recipe['is-gluten-free'] = $_POST['is-gluten-free'];
                        $new_recipe['is-dairy-free'] = $_POST['is-dairy-free'];
                        $new_recipe['diet'] = $_POST['diet'];
                        $new_recipe['meal'] = $_POST['meal'];
                        $new_recipe['cuisine'] = $_POST['cuisine'];
                        $new_recipe['difficulty'] = $_POST['difficulty'];
                        $new_recipe['id'] = uniqid();

                        $recipes[$new_recipe['id']] = $new_recipe;
                        file_put_contents("../db/recipes.json", json_encode($recipes, JSON_PRETTY_PRINT));

                        echo '{"id" : '.$new_recipe['id'].'}';
                    } 
                    else { http_response_code(400); echo '{"error" : "Missing language"}'; }
                }
                else { http_response_code(409); echo '{"error" : "Titre déjà existant"}'; }
            } 
            else { http_response_code(400); echo '{"error" : "Missing title"}'; }
        }


        // POST: ~/api/recipeControllers.php {params in request body}
        else if($_POST['action'] == 'put') {
            if (isset($_POST['id'])) { 
                $id = $_POST['id'];
                $recipes = json_decode(file_get_contents("../db/recipes.json"), true);
                $old_recipe = $recipes[$id] ?? null;

                if ($old_recipe !== null) {
                    function set_attr($attr, &$modified, $old) {
                        if (isset($_POST[$attr])) {
                            $modified[$attr] = $_POST[$attr];
                        }
                        else { $modified[$attr] = $old[$attr]; }
                    }

                    $modified_recipe['id'] = $id;
                    set_attr('title', $modified_recipe, $old_recipe);
                    set_attr('description', $modified_recipe, $old_recipe);
                    set_attr('author', $modified_recipe, $old_recipe);
                    set_attr('photo-link', $modified_recipe, $old_recipe);
                    set_attr('cooking-time', $modified_recipe, $old_recipe);
                    set_attr('ingredients', $modified_recipe, $old_recipe);
                    set_attr('steps', $modified_recipe, $old_recipe);
                    set_attr('is-gluten-free', $modified_recipe, $old_recipe);
                    set_attr('is-dairy-free', $modified_recipe, $old_recipe);
                    set_attr('diet', $modified_recipe, $old_recipe);
                    set_attr('difficulty', $modified_recipe, $old_recipe);
                    set_attr('meal', $modified_recipe, $old_recipe);
                    set_attr('cuisine', $modified_recipe, $old_recipe);
                    set_attr('language', $modified_recipe, $old_recipe);
                    set_attr('id_pair', $modified_recipe, $old_recipe);

                    $recipes[$modified_recipe['id']] = $modified_recipe;
                    file_put_contents("../db/recipes.json", json_encode($recipes, JSON_PRETTY_PRINT));
                    echo '{"recipe" : '.json_encode($modified_recipe, JSON_PRETTY_PRINT).'}';
                }
                else { http_response_code(404); echo '{"error" : "Recette introuvable"}'; }
            } 
            else { http_response_code(400); echo '{"error" : "Missing id"}'; }
        }


        // POST: ~/api/recipeControllers.php {params in request body}
        else if($_POST['action'] == 'delete') {
            if (isset($_POST['id'])) { 
                $id = $_POST['id'];
                $recipes = json_decode(file_get_contents("../db/recipes.json"), true);
                $recipe = $recipes[$id] ?? null;

                if ($recipe !== null) {
                    unset($recipes[$id]);
                    file_put_contents("../db/recipes.json", json_encode($recipes, JSON_PRETTY_PRINT));
                    echo '{"id" : '.$recipe['id'].'}';
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