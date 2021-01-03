const express = require('express');
const mysql = require('mysql');
const pool = dbConnection();
const app = express();
const bcrypt = require('bcrypt');
const session = require('express-session');

var list= [];
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));//makes it possible to get values using POST method

app.use(session({
  secret: "top secret!",
  resave: false,
  saveUninitialized: true
}));


/* Default route */
app.get('/', (req, res) => {
  res.render("index");
});

app.get('/login', (req, res) => {
  res.render("login");
});

app.get('/Checkout', (req, res) => {
  let total = list.length*10;
  list.length = 0;
  res.render("Checkout",{"total":total});
});

app.get('/done', (req, res) => {
  res.render("done");
});

app.get('/destroy', (req, res) => {
  list.length =0;
  res.render("Cart",{"rows": list});
});

app.get('/FoodList', async (req, res) => {
  if(req.query.item){
    var items = req.query.item;
    let sql = "SELECT * FROM f_food WHERE foodID = ?";
    req.session.rows = await executeSQL(sql, [items]);
    let myItem = req.session.rows;
    list.push(myItem);
    res.render("Cart",{"rows": list});
}
  let sql = "SELECT foodName, imgLink, foodID FROM f_food ORDER BY foodID";
  let rows = await executeSQL(sql);
  res.render('FoodList', { "foods": rows })
});
app.get('/Nutrition', (req, res) => {
  res.render("Nutrition");
});

app.get('/Contact', (req, res) => {
  res.render("Contact");
});


app.get('/Cart', async (req, res) => {
  //save 'item' form data
    res.render("Cart",{"rows": list});
});

app.post('/login', async (req, res) => {
  //check credentials here
  let username = req.body.username;
  //getting data using POST method
  let userPassword = req.body.password;
  //let password = "$2a$10$X/hXoWuBY0WXJT1TcASLsexL0nZ7xhB4HC3skkBMb25zvb8KYDf7q";
  //*BF138E5F461C8D87AF26043D1AB18D37F81810AA
  let password = "";
  let sql = "SELECT * FROM users WHERE username = ?";
  let rows = await executeSQL(sql, [username]);
  
  if (rows.length > 0) {
    password = rows[0].password;
  }
  // res.render('admin',{"pass":password})

  let passwordMatch = await bcrypt.compare(userPassword, password);

  req.session.authenticated = false;

  if (passwordMatch) {
    req.session.authenticated = true;
    res.render('admin')
  } else {
    res.render("login");
  }

  res.send(`${username} / ${userPassword}`);

});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.render("login");
});

//admin route
app.get('/admin', isAuthenticated, (req, res) => {
  res.render("admin");
});

//addFood route
app.get('/addFood', async (req, res) => {
  //console.log("within the foodAdded");

  let rowAffected = false;

  if (req.query.foodName) {
    //form to add Food was submitted
    let sql = "INSERT INTO f_food (foodName, imgLink) VALUES (?,?)";
    let params = [req.query.foodName, req.query.imgLink];
    let rows = await executeSQL(sql, params);

    if (rows.affectedRows == 1) {
      rowsAffected = true;
    }
  }
  res.render('addFood', { 'foodAdded': rowAffected })
});

app.get('/updateFood', async (req, res) => {
  if (req.query.foodName) {
    let sql = "UPDATE f_food SET foodName = ?, imgLink = ? WHERE foodID = ?";
    let rows = await executeSQL(sql, [req.query.foodName, req.query.imgLink, req.query.foodID]);
    if (rows.affectedRows == 1) {
      rowsAffected = true;
    }
  }
  let sql = "SELECT * FROM f_food WHERE foodID = ?";

  let rows = await executeSQL(sql, [req.query.foodID]);

  res.render('updateFood', { "rows": rows });
});


app.get('/deleteFood', async (req, res) => {
  let sql = "DELETE FROM f_food WHERE foodID = ?";
  let rows = await executeSQL(sql, [req.query.foodID]);

  res.redirect('/displayFood');
});


app.get('/displayFood', async (req, res) => {
  let sql = "SELECT foodID, foodName, imgLink FROM f_food ORDER BY foodID";
  let rows = await executeSQL(sql);

  res.render('displayFood', { "foods": rows })
});

function isAuthenticated(req, res, next) {
  if (!req.session.authenticated) {
    res.render("login");
  } else {
    next();
  }
}


app.get("/dbTest", async function(req, res) {

  let sql = "SELECT CURDATE()";
  let rows = await getData(sql);
  res.send(rows);
});//dbTest

async function executeSQL(sql, params) {

  return new Promise(function(resolve, reject) {
    let conn = dbConnection();

    pool.query(sql, params, function(err, rows, fields) {
      if (err) throw err;
      resolve(rows);
    });
  });

}//getData

function dbConnection() {
  const pool = mysql.createPool({
    connectionLimit: 20,
    host: "s0znzigqvfehvff5.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "ti4k2omb7i0n56ey",
    password: "intxrslnz7cjhzw1",
    database: "dc3a63aacus5ig8x"
  });

  return pool;
} //dbConnection


app.listen(3000, () => {
  console.log('server started');
});