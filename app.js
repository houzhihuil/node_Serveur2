const express = require("express");  
const mongoose = require("mongoose");
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

// Connect to your MongoDB database
mongoose.connect('mongodb+srv://root:JoB0QY9yqosg2EIa@cluster0.na3ur4v.mongodb.net/cluster0')
mongoose.connection.once('open', () => {
    console.log('conneted to database');
}); 

const actorSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
});

const Actor = mongoose.model("Actor", actorSchema);
 
// Get all actors
app.get("/getAllActors", async(req, res)=>{
    try {
        const actors = await Actor.find();
        res.status(200).json(actors);
    } catch (err) {
        res.status(500).json({ error: "Error fetching actors" });
    }
}); 

// Get a single actor by ID
app.get("/getActor/:actor_id", async (req, res) => {
    const id = req.params.actor_id;
    try {
        const actor = await Actor.findById(id);
        if (actor) {
            res.status(200).json({
                message: "Actor trouvé",
                data: actor,
            });
        } else {
            res.status(404).json({
                message: "Aucun acteur trouvé",
                data: {},
            });
        }
    } catch (err) {
        res.status(500).json({ error: "Error fetching actor" });
    }
});

// Add a new actor
app.post("/addActor", async (req, res) => {
    const actorData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
    };

    try {
        const newActor = await Actor.create(actorData);
        res.status(200).json({ message: "Actor ajouté", data: newActor });
    } catch (err) {
        res.status(500).json({ error: "Error adding actor" });
    }
});

// Update an actor by ID
app.put("/updateActor/:actor_id", async (req, res) => {
    const id = req.params.actor_id;
    const actorData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
    };

    try {
        const updatedActor = await Actor.findByIdAndUpdate(id, actorData, { new: true });
        if (updatedActor) {
            res.status(200).json({ message: "Actor modifié", data: updatedActor });
        } else {
            res.status(404).json({ message: "Aucun acteur trouvé" });
        }
    } catch (err) {
        res.status(500).json({ error: "Error updating actor" });
    }
});

// Delete an actor by ID
app.delete("/deleteActor/:actor_id", async (req, res) => {
    const id = req.params.actor_id;

    try {
        const deletedActor = await Actor.findByIdAndDelete(id);
        if (deletedActor) {
            res.status(200).json({ message: "Actor supprimé" });
        } else {
            res.status(404).json({ message: "Aucun acteur trouvé" });
        }
    } catch (err) {
        res.status(500).json({ error: "Error deleting actor" });
    }
}); 

 
 


 
