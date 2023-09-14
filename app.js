const express = require("express");  
const mysql = require('mysql2');
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.listen(3000);

 
 
// Middleware to check API token
app.use((req, res, next) => {
    const apiToken = req.headers.authorization;

    if (!apiToken || !apiToken.startsWith('Bearer ')) {
        // Authorization header is missing or doesn't start with 'Bearer '
        return res.status(401).json({ error: 'Invalid authorization header' });
    }

    const token = apiToken.substring(7); // Remove 'Bearer ' prefix
    const presetApiToken = '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'; // Replace with your actual preset API token

    if (token === presetApiToken) {
        // API token is valid, proceed to the route
        next();
    } else {
        // API token is invalid, return an error response
        res.status(401).json({ error: 'Invalid API token' });
    }
}); 
     
const con= mysql.createConnection({ 
    host:"localhost",
    user: "root",
    password: "Zh9$*@92If84", 
    database:"sakila"
  });
 
con.connect(function(err){
    if(err) throw err; 
});  
 
// database: sakila
// tbl : actor 
app.get("/getAllActors", function(request, response){
    con.query("SELECT * FROM actor", function(err, result, fields){
        if(err) throw err; 
        response.status(200).json(result);
    }); 
}); 

    app.get("/getActor/:actor_id", function(req, res) { 
        const id = req.params.actor_id;
    
        const query = "SELECT * FROM actor WHERE actor_id = ?;";
        const values = [id];
    
        con.query(query, values, function(err, result, fields) {
            if(err) throw err; 
            if (result.length > 0) {
                console.log(JSON.stringify(result[0]));
                res.status(200).json({
                    message: "Actor trouvé",
                    data: result[0]
                });
            } else {
                console.log("Actor non trouvé");
                res.status(404).json({
                    message: "Aucun acteur trouvé",
                    data: {}
                });
            }
        });
    });

app.post('/addActor', (req, res) => {
    const actor = {
        first_name: req.body.first_name,
        last_name: req.body.last_name
    };

    const query = "INSERT INTO actor (first_name, last_name) VALUES (?, ?);";
    const values = [actor.first_name, actor.last_name];

    con.query(query, values, (err, result, fields) => {
        if (err) throw err;
        res.status(200).json({ message: "Actor ajouté" });
    });
});
 
app.put("/updateActor/:actor_id", function(req, res) { 
    const id= req.params.actor_id; 
    const actor = {
        first_name: req.body.first_name,
        last_name: req.body.last_name
    };
  
    const query = "UPDATE Actor SET first_name = ?, last_name = ? WHERE actor_id = ?;";
    const values = [actor.first_name, actor.last_name, id];
    con.query(query, values, (err, result, fields) => {
        if (err) throw err;
        res.status(200).json({ message: "modifié" });
    }); 
});

app.delete("/deleteActor/:actor_id", function(req, res){
    const id = req.params.actor_id;  
    query = "DELETE FROM Actor where actor_id = ?";
    const values = [id];
    con.query(query, values, (err, result, fields) => { 
        if(err) throw err; 
        res.status(200).json({ message: "Actor supprimé" }); 
    });  
});
// tbl: address

app.get("/getAllAddress", function(request, response){
    con.query("SELECT * FROM address", function(err, result, fields){
        if(err) throw err; 
        response.status(200).json(result);
    }); 
}); 

app.get("/getAddress/:address_id", function(req, res) { 
    const id = req.params.address_id;

    const query = "SELECT * FROM address WHERE address_id = ?;";
    const values = [id];

    con.query(query, values, function(err, result, fields) {
        if(err) throw err; 
        if (result.length > 0) {
            console.log(JSON.stringify(result[0]));
            res.status(200).json({
                message: "Address trouvé",
                data: result[0]
            });
        } else {
            console.log("Address non trouvé");
            res.status(404).json({
                message: "Aucun acteur trouvé",
                data: {}
            });
        }
    });
});

app.post('/addAddress', (req, res) => {
    const address = {
        address: req.body.address,
        address2: req.body.address2,
        district: req.body.district,
        city_id: req.body.city_id,
        postal_code: req.body.postal_code,
        phone: req.body.phone
       /*  x: req.body.x, // Provide x coordinate
        y: req.body.y  // Provide y coordinate */
    };

    
     
    const query = "INSERT INTO address (address, address2, district, city_id, postal_code, phone, location) VALUES (?, ?, ?, ?, ?, ? ,?);";
    const values = [address.address, address.address2, address.district, address.city_id, address.postal_code, address.phone, null ];

    con.query(query, values, (err, result, fields) => {
        if (err) {
            console.error("Error adding address:", err);
            return res.status(500).json({ message: "An error occurred while adding the address." });
        }
        res.status(200).json({ message: "Address ajouté" });
    });
});

app.put("/updateAddress/:address_id", function(req, res) { 
    const id= req.params.address_id; 
    const address = {
        address: req.body.address,
        address2: req.body.address2,
        district: req.body.district,
        city_id: req.body.city_id,
        postal_code: req.body.postal_code,
        phone: req.body.phone
    };
     
    const query = "UPDATE Address SET address = ?, address2 = ?, district = ?, city_id = ?, postal_code = ?, phone = ?  WHERE address_id = ?;";
     
    const values = [address.address, address.address2, address.district, address.city_id, address.postal_code, address.phone];

    con.query(query, values, (err, result, fields) => {
        if (err) throw err;
        res.status(200).json({ message: "modifié" });
    }); 
});
 
app.delete("/deleteAddress/:address_id", function(req, res){
    const id = req.params.address_id;  
    query = "DELETE FROM Address where address_id = ?";
    const values = [id];
    con.query(query, values, (err, result, fields) => { 
        if(err) throw err; 
        res.status(200).json({ message: "Address supprimé" }); 
    });  
});



 