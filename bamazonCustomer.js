require("dotenv").config();

// Required node modules.
var mysql = require("mysql");
var inquirer = require("inquirer");

// Connects to the database.
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "BamazonDB"
});


// If connection doesn't work, throws error, else...
connection.connect(function(err) {
  if (err) throw err;

  // Displays list of available products.
  displayProducts();

});

// Displays list of all products.
var displayProducts = function() {
	var query = "Select * FROM products";
	connection.query(query, function(err, res) {

		if (err) throw err;

		for (var i = 0; i < res.length; i++) {
			console.log("Product ID: " + res[i].item_id + " || Product Name: " +
						res[i].product_name + " || Price: " + res[i].price);
		}

  		requestProduct();
	});
};

// Requests product and number of product items
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

		// Queries database for selected product.
		var query = "Select stock_quantity, price, product_sales, department_name FROM products WHERE ?";
		connection.query(query, { item_id: answer.productID}, function(err, res) {
			
			if (err) throw err;

			var available_stock = res[0].stock_quantity;
			var price_per_unit = res[0].price;
			var productSales = res[0].product_sales;
			var productDepartment = res[0].department_name;

			// Checks quanitity inventory on hand to process the request.
			if (available_stock >= answer.productUnits) {

				completePurchase(available_stock, price_per_unit, productSales, productDepartment, answer.productID, answer.productUnits);
			} else {

				// If there's not enough inventory left.
				console.log("There isn't enough stock left!");

				// Lets user request a new product.
				requestProduct();
			}
		});
	});
};


// Completes consumer request to purchase product.
var completePurchase = function(availableStock, price, productSales, productDepartment, selectedProductID, selectedProductUnits) {
	
	// Increase stock quantity 
	var updatedStockQuantity = availableStock - selectedProductUnits;

	// Calculates total price 
	var totalPrice = price * selectedProductUnits;

	// Update total product sales.
	var updatedProductSales = parseInt(productSales) + parseInt(totalPrice);
	
	// Updates stock quantity 
	var query = "UPDATE products SET ? WHERE ?";
	connection.query(query, [{
		stock_quantity: updatedStockQuantity,
		product_sales: updatedProductSales
	}, {
		item_id: selectedProductID
	}], function(err, res) {

		if (err) throw err;
		// Tells consumer purchase is successful.
		console.log("Thank you, your purchase is complete.");

		// Display the total price for that purchase.
		console.log("Payment has been received in the amount of : " + totalPrice);

		// Updates department revenue based on purchase.
		updateDepartmentRevenue(updatedProductSales, productDepartment);
		// Displays products so user can make a new selection.
	});
};

// Updates total sales for department after completed purchase.
var updateDepartmentRevenue = function(updatedProductSales, productDepartment) {

	// Query database for total sales value for department.
	var query = "Select total_sales FROM departments WHERE ?";
	connection.query(query, { department_name: productDepartment}, function(err, res) {

		if (err) throw err;

		var departmentSales = res[0].total_sales;

		var updatedDepartmentSales = parseInt(departmentSales) + parseInt(updatedProductSales);

		// Completes update to total sales for department.
		completeDepartmentSalesUpdate(updatedDepartmentSales, productDepartment);
	});
};

// Completes update to total sales
var completeDepartmentSalesUpdate = function(updatedDepartmentSales, productDepartment) {

	var query = "UPDATE departments SET ? WHERE ?";
	connection.query(query, [{
		total_sales: updatedDepartmentSales
	}, {
		department_name: productDepartment
	}], function(err, res) {

		if (err) throw err;

		// Displays products so user can choose to make another purchase.
		displayProducts();
	});
};