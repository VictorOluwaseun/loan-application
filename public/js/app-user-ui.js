const url = "http://localhost:3000/users/";
//get Data
const getData = function (callback) {
    $.get(url)
        .done(function (data) {
            callback(data);
        }).fail(function () {
            callback("Error!");
        });
};
//post data
const postData = function (data) {
    $.post(url, data)
        .done(function (data) {
            console.log(data);
        })
        .fail(function () {
            console.log("Error making post request!");
        });
};
//update data
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
//pacth data
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
//delete data
const deleteData = function (id) {
    $.ajax({
        url: url + id,
        method: "DELETE",
        // dataType: "json",
        success: function (data) {
            console.log(data);
        }
    });
};
//on ready domcontentloaded
$(document).ready(function () {
    //check session storage
    if (!JSON.parse(sessionStorage.getItem("user"))) {
        window.location.replace("http://localhost:3000/user-login.html");
    } //if nothing in session storage continue

    //Get data from session storage to track user
    const dataFromSS = JSON.parse(sessionStorage.getItem("user"));
    getData(getUserDetails);

    function getUserDetails(data) {
        const userData = data.find(el => el.email === dataFromSS);
        $(".surname").text(userData.lastName);
        // $("title").val(userData.lastName);
        if (userData.status == "Approved") {
            $(".info-loan-status").text(userData.status).addClass("bg-success").addClass("text-light");
        } else if (userData.status == "Declined") {
            $(".info-loan-status").text(userData.status).addClass("bg-warning").addClass("text-dark");
        } else if (userData.status == "Pending") {
            $(".info-loan-status").text(userData.status).addClass("bg-secondary").addClass("text-light");
        } else if (userData.delete == true || userData.status == "delete") {
            $("#message").text("Your request was deleted!");
            $(".info-loan-status").text(userData.status).addClass("bg-danger").addClass("text-light");
        }

        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        $(".amount").text(numberWithCommas(userData.amount));
        $(".date-of-application").text(new Date(userData.dateOfApplication).toLocaleDateString());

        $("#firstname").text(userData.firstName);
        $("#email").text(userData.email);
        $("#gender").text(userData.gender);
        $("#mobile").text(userData.phone);
        $("#dob").text(userData.dob);
        $("#address").text(userData.address);
        $("#income").text(userData.income);
        $("#house-rent").text(userData.houseRent);
        $("#occupation").text(userData.occupation);
        // $("#firstname").text();

        $("#details").on("click", function (e) {
            e.preventDefault();
            $("#details-card").toggle(function () {});
        });
    }

    $(".logout").on("click", function (e) {
        e.preventDefault();
        sessionStorage.clear();
        window.location.replace("http://localhost:3000/user-login.html");
    });
});