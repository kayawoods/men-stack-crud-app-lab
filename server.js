const dotenv = require("dotenv")
dotenv.config()
const express = require('express') // loads express so it can be used 
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const morgan = require("morgan")



const app = express(); // creates an express app so it a route can be defined

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

const Cheese = require("./models/cheese.js");


app.use(express.urlencoded({ extended: false })); //this is middleware that reads the data
app.use(methodOverride("_method")); 
// app.use(morgan("dev")) //


app.get("/", async (req, res) => {
    res.render("index.ejs");
})

app.get("/cheeses", async (req, res) => {
    const allCheeses = await Cheese.find()
    res.render("cheeses/index.ejs", { cheeses: allCheeses})
  });


app.get("/cheeses/new", (req, res) => {
    res.render("cheeses/new.ejs");
})

app.get("/cheeses/:cheeseId", async (req, res) => {
    const foundCheese = await Cheese.findById(req.params.cheeseId)
    res.render("cheeses/show.ejs", { cheese: foundCheese })
  })

app.put("/cheeses/:cheeseId", async (req, res) => {
    if (req.body.isStinky === "on") {
      req.body.isStinky = true;
    } else {
      req.body.isStinky = false;
    }
    await Cheese.findByIdAndUpdate(req.params.cheeseId, req.body);
    res.redirect(`/cheeses/${req.params.cheeseId}`);
})


app.post("/cheeses", async (req, res) => {
    if (req.body.isStinky === "on") {
        req.body.isStinky = true;
      } else {
        req.body.isStinky = false;
      }
      await Cheese.create(req.body)
    res.redirect("/cheeses")
})



  app.get("/cheeses/:cheeseId/edit", async (req, res) => {
    const foundCheese = await Cheese.findById(req.params.cheeseId);
    res.render('cheeses/edit.ejs', { cheese: foundCheese}) 
})

app.put("/cheeses/:cheeseId", async (req, res) => {
    if (req.body.isStinky === "on") {
      req.body.isStinky = true;
    } else {
      req.body.isStinky = false;
    }
    await Cheese.findByIdAndUpdate(req.params.cheeseId, req.body);
    res.redirect(`/cheeses/${req.params.cheeseId}`);
})
  
app.delete("/cheeses/:cheeseId", async (req, res) => {
    await Cheese.findByIdAndDelete(req.params.cheeseId)
    res.redirect("/cheeses")
  })

app.listen(3000, () => {
    console.log('Listening on port 3000');
})