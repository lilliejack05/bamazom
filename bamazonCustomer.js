require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");

// connects to the database.
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Root is default username.
  user: "root",
  // Password to display.
  password: "password",
  database: "Bamazon_db"
});


// if connection doesn't work, throws error.
connection.connect(function(err) {
  if (err) throw err;

  // displays list of products.
  displayProducts();

});

// displays list of available products.
var displayProducts = function() {
	var query = "Select * FROM products";
	connection.query(query, function(err, res) {

		if (err) throw err;

		for (var i = 0; i < res.length; i++) {
			console.log("Product ID: " + res[i].item_id + " || Product Name: " +
						res[i].product_name + " || Price: " + res[i].price);
		}

		// requests product and number of items consumer wants to purchase.
  		requestProduct();
	});
};

// requests product and number of items consumer wants to purchase.
var requestProduct = function() {
	inquirer.prompt([{
		name: "productID",
		type: "input",
		message: "Please enter product ID for product you want.",
		validate: function(value) {
			if (isNaN(value) === false) {
				return true;
			}
			return false;
		}
	}, {
		name: "productUnits",
		type: "input",
		message: "How many units do you want?",
		validate: function(value) {
			if (isNaN(value) === false) {
				return true;
			}
			return false
		}
	}]).then(function(answer) {

		// query database for selected product.
		var query = "Select stock_quantity, price, department_name FROM products WHERE ?";
		connection.query(query, { item_id: answer.productID}, function(err, res) {
			
			if (err) throw err;

			var available_stock = res[0].stock_quantity;
			var price_per_unit = res[0].price;
			var productDepartment = res[0].department_name;

			// checks inventory  to process user's request.
			if (available_stock >= answer.stock_quantity) {

				// process consumer request to complete purchase.
				completePurchase(available_stock, price_per_unit, productDepartment, answer.productID, answer.productUnits);
			} else {

				// tells user there isn't enough stock left.
				console.log("There isn't enough stock left!");

			}
		});
	});
};
