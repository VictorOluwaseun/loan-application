//Database controller
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


$(document).ready(function () {
	//check session storage
	if (!JSON.parse(sessionStorage.getItem("admin"))) {
		window.location.replace("http://localhost:3000/admin-login.html");
	}
	//send data to admin page
	let output = "";
	const displayUser = function (users) {
		//display UI
		users.forEach(user => {
			if (user["user"] == "applicant") {
				// if (user.delete == false) {
				if (user["status"] == "Pending") {
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
                    <p class="card-text request-${user.id}">Request: ${user.status}</p>

                    <a href="#" data-id = "${user.id}" class="btn btn-success">Approve</a>
                    <a href="#" data-id = "${user.id}" class="btn btn-warning">Decline</a>
                    <a href="#" data-id = "${user.id}" class ="btn btn-danger">Delete</a>
                </div>
			</div>
			</div>
			</div>`;

					$("#all-pending-loan").html(output);
				}
				// }
			}
		});

	};
	getData(displayUser);


	//Approve Loan //pending
	$("#all-pending-loan").on("click", function (e) {
		e.preventDefault();
		//To approve
		if ($(e.target).hasClass("btn-success")) {
			// console.log(e.target);
			// console.log($(e.target).attr("data-id"));
			patchData({
				status: "Approved",
				dataOfApproval: new Date(Date.now())
			}, $(e.target).attr("data-id"));
			$(e.target).prev().text("Request: Approved");
			$(e.target).parent().parent().hide();
			getData(filterAllApprovedLoan);
			//getOneData(console.log, $(e.target).attr("data-id"));
		}
		//To decline
		if ($(e.target).hasClass("btn-warning")) {
			let id = $(e.target).attr("data-id");
			patchData({
				status: "Declined"
			}, id);
			$(e.target).prev().prev().text("Request: Declined");
			$(e.target).parent().parent().hide();
			getData(filterAllDeclinedLoan);
		}
		//To delete
		if ($(e.target).hasClass("btn-danger")) {
			let id = $(e.target).attr("data-id");

			patchData({
				delete: true,
				status: "deleted"
			}, id);

			$(e.target).prev().prev().prev().text("Request: Deleted");
			$(e.target).prev().prev().hide();
			$(e.target).prev().hide();
			$(e.target).parent().parent().css("display", "none");
		}
	});


	//Approved Loan
	getData(filterAllApprovedLoan);

	//Declined Loan
	getData(filterAllDeclinedLoan);


	function filterAllApprovedLoan(data) {
		let uIOutput = "";
		for (let i = 0; i < data.length; i++) {
			const user = data[i];
			if (user.status === "Approved") {
				uIOutput += `
				<div class = "row">
				<div class="col-lg-4 col-md-6 mb-4">
            <div class="card" style="min-width:18rem">
			<p class="card-text alert alert-success role="alert" request-${user.id}">${user.status}</p>
				<div class="card-body">
				<p class="card-text">Date of Application: ${new Date(user.dateOfApplication).toLocaleDateString()}</p>
                    <p class="card-text">Data of Approval: ${new Date(user.dataOfApproval).toLocaleString()}</p>
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
			if (user.status === "Declined") {
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
                    <p class="card-text request-${user.id}">Request: ${user.status}</p>
                </div>
			</div>
			</div>
			</div>`;
			}
		}
		$("#declined-loan").html(uIOutput);
	}
});