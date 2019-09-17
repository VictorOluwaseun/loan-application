//Controllers
const url = "http://localhost:3000/users/";
const getData = function (callback) {
    $.get(url)
        .done(function (data) {
            callback(data);
        }).fail(function () {
            callback("Error!");
        });
};
const postData = function (data) {
    $.post(url, data)
        .done(function (data) {
            console.log(data);
        })
        .fail(function () {
            console.log("Error making post request!");
        });
};
const updateData = function (data, id) {
    $.ajax({
        url: url + id,
        method: "PUT",
        dataType: "json",
        data,
        success: function (data) {
            console.log(data);
        }
    }, );
};
const patchData = function (data, id) {
    $.ajax({
        url: url + id,
        method: "PATCH",
        dataType: "json",
        data,
        success: function (data) {
            console.log(data);
        }
    }, );
};
const deleteData = function (id) {
    $.ajax({
        url: url + id,
        method: "DELETE",
        // dataType: "json",
        success: function (data) {
            console.log(data);
        }
    }, );
};
const virtuals = function (dateOfApplication) {
    return {
        "dateOfApplication": new Date(dateOfApplication),
        request: "pending",
        user: "applicant",
        delete: false
    };
};

// getData(console.log);


$(document).ready(checkSessionStorage);



//check session storage
function checkSessionStorage() {
    if (!sessionStorage.getItem("admin")) {
        showUI();
    }
};

//Ui functions
function showUI() {
    return $(".form-wrap").css("display", "block");
}

const logIn = $("#logIn");



$(document).ready(function () {
    // Handler for .ready() called.
    $(logIn).on("click", checkData);
});

function checkData(e) {
    e.preventDefault();
    const confirmData = function (data) {
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.user === "admin") {
                if (element.lastName === $("#lastName").val() && element.email === $("#email").val() && element.password === $("#password").val()) {
                    sessionStorage.setItem("admin", JSON.stringify([$("#email").val()]));
                    window.location.replace("http://localhost:3000/adminui.html");
                }
            } else {
                continue;
            }
        }
        console.log($("#password").val(), "invalid input");
    };
    getData(confirmData);
}