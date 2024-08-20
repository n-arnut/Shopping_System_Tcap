const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 3001;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// MySQL connection setup
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "shopping_system",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

// Fetch all items
app.get("/product", (req, res) => {
  const sql = "SELECT * FROM product";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).send("Server error");
    }
    res.status(200).json(results);
  });
});
app.get("/cart", (req, res) => {
  // const sql = 'SELECT * FROM cart';
  const sql =
    "SELECT c.product_id, COUNT(*) AS product_qty, COUNT(*)*p.price AS price, p.product_name, p.product_code FROM cart c INNER JOIN product p on p.product_id = c.product_id GROUP BY c.product_id;";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).send("Server error");
    }
    res.status(200).json(results);
  });
});

app.post("/cart", (req, res) => {
  const { product_id } = req.body;

  if (!product_id || typeof product_id !== "number") {
    return res.status(400).send("Invalid product ID");
  }

  const sql1 = `INSERT INTO cart (product_id, product_qty) VALUES (?, 1);`;
  const sql2 = `UPDATE product SET stock_count = stock_count - 1 WHERE product_id = ?`;

  db.query(sql1, [product_id], (err, results) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).send("Server error");
    }
    console.log(results);
    db.query(sql2, [product_id], (err, results) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).send("Server error");
      }
    //   console.log(results);
      res.status(200).json(results);
    });
  });
});

app.delete("/cart", (req, res) => {
  const { product_id } = req.body;

  if (!product_id || typeof product_id !== "number") {
    return res.status(400).send("Invalid product ID");
  }

  const sql = `DELETE FROM cart WHERE cart_id = (SELECT MAX(cart_id) FROM cart WHERE product_id = ?)`;

  db.query(sql, [product_id], (err, results) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).send("Server error");
    }
    // console.log(results);
    res.status(200).json(results);
  });
});

app.delete("/cart/clear", (req, res) => {
  const sql = `DELETE FROM cart`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error deleting data:", err);
      return res.status(500).send("Server error");
    }
    res.status(200).json({ message: "All items in the cart have been deleted", affectedRows: results.affectedRows });
  });
});

app.get("/product/:id", (req, res) => {
  const product_id = req.params.id;
  const sql = "SELECT * FROM product WHERE product_id = ?";
  db.query(sql, [product_id], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).send("Server error");
    }
    res.status(200).json(results);
  });
});


app.put("/product", (req, res) => {
  const { product_id, stock_count } = req.body;

  if (!product_id || !stock_count) {
    return res.status(400).json({
      success: false,
      message: "Product ID and Order Item are required fields.",
    });
  }

  const sql = "UPDATE product SET stock_count = ? WHERE product_id = ?";

  db.query(sql, [stock_count, product_id], (err, results) => {
    if (err) {
      console.error("Error updating data:", err.message || err);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the database.",
        error: err.message || err,
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found or no changes were made.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: results,
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
