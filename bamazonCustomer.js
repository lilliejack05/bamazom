require("dotenv").config();

// required node modules.
var mysql = require("mysql");
var inquirer = require("inquirer");

// connects to database.
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // root is default username.
  user: "root",
  // password is empty.
  password: "",
  database: "Bamazon_db"
});

// if connection doesn't work, throws error, else...
connection.connect(function(err) {
  if (err) throw err;

  // list of available products.
  displayProducts();

});

// shows available products.
var displayProducts = function() {
	var query = "Select * FROM products";
	connection.query(query, function(err, res) {

		if (err) throw err;

		for (var i = 0; i < res.length; i++) {
			console.log("Product ID: " + res[i].item_id + " || Product Name: " +
						res[i].product_name + " || Price: " + res[i].price);
		}

		// requests product.
  		requestProduct();
	});
};

// requests product and number of items consumer wishes to purchase.
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
		var query = "Select stock_quantity, price, product_sales, department_name FROM products WHERE ?";
		connection.query(query, { item_id: answer.productID}, function(err, res) {
			
			if (err) throw err;

			var available_stock = res[0].stock_quantity;
			var price_per_unit = res[0].price;
			var productSales = res[0].product_sales;
			var productDepartment = res[0].department_name;

			// checks inventory on-hand to process consumer request.
			if (available_stock >= answer.productUnits) {

				// processes request to complete purchase.
				completePurchase(available_stock, price_per_unit, productSales, productDepartment, answer.productID, answer.productUnits);
			} else {

				// alerts consumer there isn't enough stock left.
				console.log("There isn't enough stock left!");

				// request a new product.
				requestProduct();
			}
		});
	});
};


// process consumer request to purchase product.
var completePurchase = function(availableStock, price, productSales, productDepartment, selectedProductID, selectedProductUnits) {
	
	// updates inventory once purchase complete.
	var updatedStockQuantity = availableStock - selectedProductUnits;

	// calculate price of purchase and number of units.
	var totalPrice = price * selectedProductUnits;

	// updates product sales.
	var updatedProductSales = parseInt(productSales) + parseInt(totalPrice);
	
	// updates inventory on the database based on consumer purchase.
	var query = "UPDATE products SET ? WHERE ?";
	connection.query(query, [{
		stock_quantity: updatedStockQuantity,
		product_sales: updatedProductSales
	}, {
		item_id: selectedProductID
	}], function(err, res) {

		if (err) throw err;
		//purchase is a success.
		console.log("Thank you, your purchase is complete.");

		// shpws total price for purchase.
		console.log("You're payment has been received in the amount of : " + totalPrice);

		// updates department inevnotry based on purchase.
		updateDepartmentRevenue(updatedProductSales, productDepartment);
		// shows products so consumer can make a new selection.
	});
};

// updates total sales for department after completed purchase.
var updateDepartmentRevenue = function(updatedProductSales, productDepartment) {

	// query database for total sales value .
	var query = "Select total_sales FROM departments WHERE ?";
	connection.query(query, { department_name: productDepartment}, function(err, res) {

		if (err) throw err;

		var departmentSales = res[0].total_sales;

		var updatedDepartmentSales = parseInt(departmentSales) + parseInt(updatedProductSales);

		// update total sales for department.
		completeDepartmentSalesUpdate(updatedDepartmentSales, productDepartment);
	});
};

// update total sales for department on database.
var completeDepartmentSalesUpdate = function(updatedDepartmentSales, productDepartment) {

	var query = "UPDATE departments SET ? WHERE ?";
	connection.query(query, [{
		total_sales: updatedDepartmentSales
	}, {
		department_name: productDepartment
	}], function(err, res) {

		if (err) throw err;

		// shows products consumer can select to make another purchase.
		displayProducts();
	});
};
