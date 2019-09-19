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
                request: "Pending",
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
        loan: $(getSelectors.amount).val(),
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
                console.log("Enter all fields"); //UI
                return false;
            }
        }
        //password validation
        if (userValidation.password !== userValidation.password2) {
            console.log("Password not matched!");
            return false;
        }

        //make email unique
        const checkMail = function (data) {
            const currentEmail = getUserInput().email;
            const dbEmail = data.find(el => el.email === currentEmail);
            if (dbEmail) {
                console.log("email already exits");
                return false;
            }
            const userData = getUserInput();
            userData.loan = [{
                "amount": getUserInput().loan
            }];
            if (!dbEmail) {
                userData.loan[0].dateOfApplication = new Date(Date.now());
                Object.assign(userData, DbCtrl.virtuals());
                DbCtrl.postData(userData); //make a post request
                window.location.replace("http://localhost:3000/confirmation_page.html");
            }
        };

        //
        DbCtrl.getData(checkMail);
    }
});