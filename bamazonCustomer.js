// JS

var inquirer = require("inquirer");
var mysql = require("mysql");
var myconsole = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "Trojanman2010",
  database: "bamazon"
})

connection.connect(function(err) {
  if (err) throw err;
  showProducts();
});

function showProducts(){

  var sql = 'SELECT * FROM products';

  connection.query(sql, function (error, results, fields) {
      if (error) throw error;

        console.table(results);

        inquirer.prompt([

          {
            type: "list",
            name: "exit",
            message: "Do you want to quit the program? ",
            choices:[
                "yes",
                "no"]
          },

        ]).then(function(data) {

        if (data.exit == "yes") {
          process.exit(0);
        }
        else {
          afterConnection();
        }

      });

    });
  }

function afterConnection(){

  inquirer.prompt([

    {
      type: "input",
      name: "itemId",
      message: "Please enter the Item Number for the product you want to purchase: "
    },

    {
      type: "input",
      name: "itemQuantity",
      message: "Item quantity? "
    },


    ]).then(function(data) {


  var userId = data.itemId;
  var userQuantity = data.itemQuantity;

  var sql = 'SELECT * FROM products WHERE item_id = ' + connection.escape(userId);

  connection.query(sql, function (error, res, fields) {
      if (error) throw error;

      if (parseInt(res[0].stock_quantity) < userQuantity) {
        console.log("Insufficient Stock! Your desired quantity is too high!");
      }

      else {

        var diff = parseInt(res[0].stock_quantity - userQuantity);
        var total = parseInt(res[0].price) * userQuantity;
        console.log("Total Price: " + total);
        console.log("---------------------------------------------");

        connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [diff, userId], function (error, results, fields) {

          if (error) throw error;

        });
      }

        showProducts();

      });
  });
}