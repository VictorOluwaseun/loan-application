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

// DbCtrl.patchData({
//     "name": "heyeyeeyeyey"
// }, 2);
//User Controller
const UserCtrl = (function () {

})();

//UI Controller
const UICtrl = (function () {
    // Selectors
    const UISelectors = {
        lastName: "#lastName",
        firstName: "#firstName",
        email: "#email",
        gender: "input[name='gender']",
        password: "#password",
        password2: "#password2",
        phone: "phone",
        dob: "#dob",
        address: "#address",
        occupation: "#occupation",
        houseRent: "houseRent",
        income: "#income",
        amount: "#amount",
        submit: "#submit-form"
    };

    // console.log($(UISelectors.gender));


    // console.log($(lastName).val());

    //public methods
    return {
        getSelectors: function () {
            return UISelectors;
        },
        getUserInput: function () {
            return {
                lastName: $(lastName).val(),
                firstName: $(firstName).val(),
                email: $(email).val(),
                gender: $("input[name='gender']:checked").val(),
                password: $(password).val(),
                password2: $(password2).val(),
                phone: $(phone).val(),
                dob: $(dob).val(),
                address: $(address).val(),
                occupation: $(occupation).val(),
                houseRent: $(houseRent).val(),
                income: $(income).val(),
                amount: $(amount).val(),
            };
        }

    };
})();

const App = (function (DbCtrl, UserCtrl, UICtrl) {
    const UISelectors = UICtrl.getSelectors();

    function loadEventListeners(params) {
        $(UISelectors.submit).on("click", submitData);
    }

    const submitData = function (e) {
        e.preventDefault();
        //User validation: check if all inputs have value
        const userValidation = UICtrl.getUserInput();
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

        DbCtrl.getData(checkMail);
    };
    //make email unique
    checkMail = function (data) {
        const currentEmail = UICtrl.getUserInput().email;

        const dbEmail = data.find(el => el.email === currentEmail);
        if (dbEmail) {
            console.log("email already exits");
            return false;
        }

        const userData = UICtrl.getUserInput();

        if (!dbEmail) {
            Object.assign(userData, DbCtrl.virtuals(Date.now()));
            DbCtrl.postData(userData); //make a post request
            window.location.replace("http://localhost:3000/confirmation_page.html");
        }
    };

    //public methods
    return {
        init: function () {
            console.log("App initialising...");
            loadEventListeners();
        }
    };
})(DbCtrl, UserCtrl, UICtrl);

App.init();