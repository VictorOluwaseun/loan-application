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
		getOneData: function (callback, id) {
			$.get(url + id)
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
		showAllData: "get-all-data"
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

			};
		},
		displayUser: function (user) {
			$(UISelectors.showAllData).html(user.name);
		}

	};
})();


// $(document).ready(function (e) {
//     // console.log("hi", DbCtrl.getData(console.log));
//     if (sessionStorage.getItem("admin")) {
//         const checkForAdmin = function (data) {
//             data.forEach(element => {
//                 if (element.email !== JSON.parse(sessionStorage.getItem("admin"))) {
//                     window.location.replace("http://localhost:3000/index.html"); //take to home page to make another form of security
//                 }
//             });
//         };

//         DbCtrl.getData(checkForAdmin);
//     } else {
//         window.location.replace("http://localhost:3000/index.html");
//     }
// });



$(document).ready(function () {
	let output = "";
	const displayUser = function (users) {
		//display UI
		users.forEach(user => {
			if (user["user"] !== "admin" && user["request"] !== "Approved" && user["request"] !== "Declined" && user["request"] !== "Deleted" && user.delete == false) {
				output += `
				<div class = "row">
				<div class="col-lg-4 col-md-6 mb-4">
            <div class="card" style="min-width:18rem">
                <div class="card-body">
                    <h4 class="card-title">${user.lastName} ${user.firstName}</h4>
                    <h6 class="card-subtitle mb-2">${user.email}</h6>
                    <p class="card-text">gender: ${user.gender}</p>
                    <p class="card-text">Phone: ${user.phone}</p>
                    <p class="card-text">Date of Birth: ${user.dob}</p>
                    <p class="card-text">Address: ${user.address}</p>
                    <p class="card-text">Occupation: ${user.occupation}</p>
                    <p class="card-text">House Rent: ${user.houseRent}</p>
                    <p class="card-text">Income: ${user.income}</p>
                    <p class="card-text">Request for: ${user.amount}</p>
                    <p class="card-text">Date of Application: ${user.dateOfApplication}</p>
                    <p class="card-text request-${user.id}">Request: ${user.request}</p>

                    <a href="#" data-id = "${user.id}" class="btn btn-success">Approve</a>
                    <a href="#" data-id = "${user.id}" class="btn btn-warning">Decline</a>
                    <a href="#" data-id = "${user.id}" class ="btn btn-danger">Delete</a>
                </div>
			</div>
			</div>
			</div>`;
				// var text = $("<p></p>").text(user.lastName);
				// $("#get-all-data").append(output);
				$("#all-pending-loan").html(output);
			}
		});

	};

	DbCtrl.getData(displayUser);

	//Approve Loan //pending
	$("#all-pending-loan").on("click", function (e) {
		e.preventDefault();
		//To approve
		if ($(e.target).hasClass("btn-success")) {
			// console.log(e.target);
			// console.log($(e.target).attr("data-id"));
			DbCtrl.patchData({
				request: "Approved",
				dataOfApproval: new Date(Date.now())
			}, $(e.target).attr("data-id"));
			$(e.target).prev().text("Request: Approved");
			$(e.target).parent().parent().hide();
			// DbCtrl.getOneData(console.log, $(e.target).attr("data-id"));
		}
		//To decline
		if ($(e.target).hasClass("btn-warning")) {
			let id = $(e.target).attr("data-id");
			DbCtrl.patchData({
				request: "Declined"
			}, id);
			$(e.target).prev().prev().text("Request: Declined");
			$(e.target).parent().parent().hide();
			DbCtrl.getData(filterAllDeclinedLoan);
		}
		//To delete
		if ($(e.target).hasClass("btn-danger")) {
			let id = $(e.target).attr("data-id");

			DbCtrl.patchData({
				delete: true
			}, id);

			$(e.target).prev().prev().prev().text("Request: Deleted");
			console.log();
			DbCtrl.getOneData(console.log, id);
			$(e.target).parent().parent().hide();
		}
	});


	//Approved Loan
	DbCtrl.getData(filterAllApprovedLoan);

	//Declined Loan
	DbCtrl.getData(filterAllDeclinedLoan);

	//Deleted Loan
	DbCtrl.getData(filterAllDeletedLoan);

	function filterAllApprovedLoan(data) {
		let uIOutput = "";
		for (let i = 0; i < data.length; i++) {
			const user = data[i];
			if (user.request === "Approved") {
				uIOutput += `
				<div class = "row">
				<div class="col-lg-4 col-md-6 mb-4">
            <div class="card" style="min-width:18rem">
			<p class="card-text alert alert-success role="alert" request-${user.id}">${user.request}</p>
				<div class="card-body">
				<p class="card-text">Date of Application: ${user.dateOfApplication}</p>
                    <p class="card-text">Data of Approval: ${user.dataOfApproval}</p>
                    <h4 class="card-title">${user.lastName} ${user.firstName}</h4>
                    <h6 class="card-subtitle mb-2">${user.email}</h6>
                    <p class="card-text">gender: ${user.gender}</p>
                    <p class="card-text">Phone: ${user.phone}</p>
                    <p class="card-text">Date of Birth: ${user.dob}</p>
                    <p class="card-text">Address: ${user.address}</p>
                    <p class="card-text">Occupation: ${user.occupation}</p>
                    <p class="card-text">House Rent: ${user.houseRent}</p>
                    <p class="card-text">Income: ${user.income}</p>
                    <p class="card-text">Request for: ${user.amount}</p>
                </div>
			</div>
			</div>
			</div>`;
			}
		}
		$("#approved-loan").html(uIOutput);
	}

	function filterAllDeclinedLoan(data) {
		let uIOutput = "";
		for (let i = 0; i < data.length; i++) {
			let user = data[i];
			if (user.request === "Declined") {
				uIOutput += `
				<div class = "row">
				<div class="col-lg-4 col-md-6 mb-4">
            <div class="card" style="min-width:18rem">
                <div class="card-body">
                    <h4 class="card-title">${user.lastName} ${user.firstName}</h4>
                    <h6 class="card-subtitle mb-2">${user.email}</h6>
                    <p class="card-text">gender: ${user.gender}</p>
                    <p class="card-text">Phone: ${user.phone}</p>
                    <p class="card-text">Date of Birth: ${user.dob}</p>
                    <p class="card-text">Address: ${user.address}</p>
                    <p class="card-text">Occupation: ${user.occupation}</p>
                    <p class="card-text">House Rent: ${user.houseRent}</p>
                    <p class="card-text">Income: ${user.income}</p>
                    <p class="card-text">Request for: ${user.amount}</p>
                    <p class="card-text">Date of Application: ${user.dateOfApplication}</p>
                    <p class="card-text request-${user.id}">Request: ${user.request}</p>
                </div>
			</div>
			</div>
			</div>`;
			}
		}
		$("#declined-loan").html(uIOutput);
	}

	function filterAllDeletedLoan(data) {
		let uIOutput = "";
		for (let i = 0; i < data.length; i++) {
			let user = data[i];
			if (user.delete == true) {
				uIOutput += `
				<div class = "row">
				<div class="col-lg-4 col-md-6 mb-4">
            <div class="card" style="min-width:18rem">
                <div class="card-body">
                    <h4 class="card-title">${user.lastName} ${user.firstName}</h4>
                    <h6 class="card-subtitle mb-2">${user.email}</h6>
                    <p class="card-text">gender: ${user.gender}</p>
                    <p class="card-text">Phone: ${user.phone}</p>
                    <p class="card-text">Date of Birth: ${user.dob}</p>
                    <p class="card-text">Address: ${user.address}</p>
                    <p class="card-text">Occupation: ${user.occupation}</p>
                    <p class="card-text">House Rent: ${user.houseRent}</p>
                    <p class="card-text">Income: ${user.income}</p>
                    <p class="card-text">Request for: ${user.amount}</p>
                    <p class="card-text">Date of Application: ${user.dateOfApplication}</p>
                    <p class="card-text request-${user.id}">Request: ${user.request}</p>
                </div>
			</div>
			</div>
			</div>`;
			}
		}
		$("#deleted-loan").html(uIOutput);
	}
});