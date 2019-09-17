// 
//Database controller
const DbCtrl = (function () {
    const url = "http://localhost:3000/users/";
    // jQuery.each(["put", "delete"], function (i, method) {
    //     jQuery[method] = function (url, data, callback, type) {
    //         if (jQuery.isFunction(data)) {
    //             type = type || callback;
    //             callback = data;
    //             data = undefined;
    //         }

    //         return jQuery.ajax({
    //             url: url,
    //             type: method,
    //             dataType: type,
    //             data: data,
    //             success: callback
    //         });
    //     };
    // });
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
    //Selectors
    // const UISelectors = {
    //     lname: "#lname",
    //     fname: "#fname",
    //     email: "#email",
    //     password: "#password",
    //     password1: "#password1",
    //     dob: "#dob",
    //     address: "#address",
    //     occupation: "#occupation",
    //     income: "#income",
    //     amount: "#amount",
    //     submit: "#submit-form"
    // };

    console.log($(lname).val());
})();

const App = (function (DbCtrl, UserCtrl, UICtrl) {


    return {
        init: function () {
            console.log("App initialising...");

        }
    };
})(DbCtrl, UserCtrl, UICtrl);

App.init();