// 
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
        virtuals: function () {
            return {
                status: "Pending",
                user: "applicant",
                delete: false
            };
        }
    };
})();

//UI Selectors
const getSelectors = {
    lastName: "#lastName",
    firstName: "#firstName",
    email: "#email",
    gender: "input[name='gender']",
    password: "#password",
    password2: "#password2",
    phone: "#phone",
    dob: "#dob",
    address: "#address",
    occupation: "#occupation",
    houseRent: "#houseRent",
    income: "#income",
    amount: "#amount",
    submit: "#submit-form"
};

//field values
const getUserInput = function () {
    return {
        lastName: $(getSelectors.lastName).val(),
        firstName: $(getSelectors.firstName).val(),
        email: $(getSelectors.email).val(),
        gender: $("input[name='gender']:checked").val(),
        password: $(getSelectors.password).val(),
        password2: $(getSelectors.password2).val(),
        phone: $(getSelectors.phone).val(),
        dob: $(getSelectors.dob).val(),
        address: $(getSelectors.address).val(),
        occupation: $(getSelectors.occupation).val(),
        houseRent: $(getSelectors.houseRent).val(),
        income: $(getSelectors.income).val(),
        amount: $(getSelectors.amount).val(),
    };
};

$(document).ready(function () {
    $(getSelectors.submit).on("click", submitData);

    function submitData(e) {
        e.preventDefault();

        //User validation: check if all inputs have value
        const userValidation = getUserInput();
        for (const i in userValidation) { // iterate through object
            if (!userValidation[i] || userValidation[i] === undefined || userValidation[i] === null) {
                displayAlert("Enter all fields", "alert-danger"); //UI
                return false;
            }
        }
        //password validation
        if (userValidation.password !== userValidation.password2) {
            displayAlert("Password not matched!", "alert-danger");
            return false;
        }

        //make email unique
        const checkMail = function (data) {
            const currentEmail = getUserInput().email;
            const dbEmail = data.find(el => el.email === currentEmail);
            if (dbEmail) {
                displayAlert("email already exits", "alert-danger");
                return false;
            }
            const userData = getUserInput();
            if (!dbEmail) {
                userData.dateOfApplication = new Date(Date.now());
                Object.assign(userData, DbCtrl.virtuals());
                DbCtrl.postData(userData); //make a post request
                window.location.replace("http://localhost:3000/confirmation_page.html");
            }
        };

        DbCtrl.getData(checkMail);
    }

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