//Database controller
const DbCtrl = (function () {
    const url = "http://localhost:3000/users/";

    //public methods
    return {
        getData: function (callback) {
            $.get(url)
                .done(function (data) {
                    callback(data);
                }).fail(function () {
                    callback("Error!");
                });
        },
        postData: function (data) {
            $.post(url, data)
                .done(function (data) {
                    console.log(data);
                })
                .fail(function () {
                    console.log("Error making post request!");
                });
        },
        updateData: function (data, id) {
            $.ajax({
                url: url + id,
                method: "PUT",
                dataType: "json",
                data,
                success: function (data) {
                    console.log(data);
                }
            }, );
        },
        patchData: function (data, id) {
            $.ajax({
                url: url + id,
                method: "PATCH",
                dataType: "json",
                data,
                success: function (data) {
                    console.log(data);
                }
            }, );
        },
        deleteData: function (id) {
            $.ajax({
                url: url + id,
                method: "DELETE",
                // dataType: "json",
                success: function (data) {
                    console.log(data);
                }
            }, );
        },
        virtuals: function (dateOfApplication) {
            return {
                "dateOfApplication": new Date(dateOfApplication),
                request: "pending",
                user: "applicant",
                delete: false
            };
        }
    };
})();

$(document).ready(function () {
    //Check for data in session in sesssionStorage
    if (JSON.parse(sessionStorage.getItem("user"))) {
        window.location.replace("http://localhost:3000/userui.html");
    }
    //
    $("#signIn").on("click", signIn);

    function signIn(e) {
        e.preventDefault();
        //User inputs
        const email = $("#email-signIn").val();
        const password = $("#password-signIn").val();
        //check database
        const checkForEmailAndPassword = function (data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].user !== "admin") {
                    const emailFromDB = data.find(el => el.email === email);
                    if (emailFromDB) {
                        const dataFromDB = data.find(el => el.password === password);
                        if (dataFromDB) {
                            console.log("log in successfully", dataFromDB.email);
                            sessionStorage.setItem("user", JSON.stringify(emailFromDB.email));
                            window.location.replace("http://localhost:3000/userui.html");
                        } else {
                            displayAlert("Invalid password", "alert-danger");
                        }
                    } else {
                        displayAlert("Invalid email", "alert-danger");
                    }
                }
            }
        };
        DbCtrl.getData(checkForEmailAndPassword);
    }



    //Display alert

    function displayAlert(message, className) {
        clearAlert();
        $(".alert").text(message).addClass(className);
        setTimeout(() => {
            clearAlert();
        }, 2000);
    }

    function clearAlert() {
        const currentAlert = $(".alert");
        if (currentAlert.hasClass("alert-danger")) {
            currentAlert.removeClass("alert-danger");
        }
        if (currentAlert.hasClass("alert-success")) {
            currentAlert.removeClass("alert-success");
        }
        currentAlert.text("");
    }
});