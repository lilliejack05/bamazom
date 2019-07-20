DROP DATABASE IF EXISTS Bamazon_DB;

CREATE DATABASE Bamazon_DB;

USE Bamazon_DB;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER NOT NULL,
    PRIMARY KEY (id)
);

// Table data
INSERT INTO products (product_name, department_name, price, stock_quantity)

VALUES ("Chocolate Chip Cookies", 4.79, 20), 
 ("Womens Plaid Blazer", 45.00, 10),
 ("Red bottom Shoes", 220.00, 15), 
 ("Vanilla Icecream", 7.00, 5), 
 ("Notebook", 4.97, 12), ("Lamp", 25.99, 6),
 ("Doritos", 4.98, 8), 
 ("Orange Juice", 4.50, 8), 
 ("Wireless Bluetooth Speaker", 35.00, 12), 
 ("Confident Coding Book", 19.97, 8);
 ("Chocolate Chip Larabars", "Grocery", 14.79, 20);
 

SELECT * FROM products;