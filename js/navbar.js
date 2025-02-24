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
            .fail(function (err) {
                console.log(err);
            })
            .always(function () {
                loading = false;
            });
        }
    });
});