$(document).ready(function () {
    const button = $("#signoutButton");
    let loading = false;

    button.on("click", function () {
        if (!loading) {
            loading = true;

            $.ajax({
                url: "http://localhost:3000/api/userController.php",
                method: "POST",
                data: { 
                    action: "signout"
                }
            })
            .done(function (_) {
                window.location.href = "/";
            })
            .fail(function (xhr) {
                let err = null;
                err = JSON.parse(xhr.responseText);
                if (err && err.error) {
                    // errorMessage.text(err.error);
                } else {
                    // errorMessage.text("Une erreur est survenue.");
                }
            })
            .always(function () {
                loading = false;
            });
        }
    });
});