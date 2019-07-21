DROP DATABASE IF EXISTS Bamazon_DB;

CREATE DATABASE Bamazon_DB;

USE Bamazon_DB;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(50) NULL,
    price DECIMAL(7,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT '1',
    PRIMARY KEY (item_id)
  );
  SELECT * FROM products;
  
// Table data
INSERT INTO products (product_name, department_name, price, stock_quantity)

VALUES ("Chocolate Chip Cookies", "Snack", 4.79, 20), 
 ("Womens Plaid Blazer", "Jacket", 45.00, 10),
 ("Red bottom Shoes","Highheels", 220.00, 15), 
 ("Vanilla Icecream","Dessert", 7.00, 5), 
 ("Notebook","Schoolsupplies", 4.97, 12), 
 ("Lamp","Furniture", 25.99, 6),
 ("Doritos","Chips", 4.98, 8), 
 ("Orange Juice","Beverage",4.50, 8), 
 ("Wireless Bluetooth Speaker","Electronic", 35.00, 12), 
 ("Confident CodingBook","Self Help", 19.97, 8);
 