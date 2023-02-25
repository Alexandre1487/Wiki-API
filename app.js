//jshint esversion:6

const express = require("express");
const bodyParser = require('body-parser');
const ejs = require("ejs");
const { message } = require("statuses");
const _ = require('lodash');

// AQUI FICA A LIGAÇÃO À BASE DE DADOS
const { MongoClient, ListCollectionsCursor, MongoError } = require("mongodb");
const uri = "mongodb+srv://userUser:SzH8dbzDXDazh8ZT@cluster0.zipgvvy.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

const app = express();

const database = client.db("wikiDB");
const collection = database.collection("articles");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());


// REQUEST TARGETTING ALL ARTICLES
app.route("/articles")

    .get(function (req, res) {

        const articlesDocs = collection.find({});

        async function run() {
            const cursor = await articlesDocs.toArray();
            res.send(cursor);
        };

        run();

    })

    .post(function (req, res) {

        const searchParams = new URLSearchParams(req.url);

        const info = (Array.from(searchParams.values()));

        const newArticle = {
            title: info[0],
            content: info[1]
        };

        collection.insertOne(newArticle);

        res.send("Successfully added a new article!");

    })

    .delete(function (req, res) {

        collection.deleteMany({});

        res.send("All articles successfully deleted!");

    });



// REQUEST TARGETTING A SPECIFIC ARTICLE
app.route("/articles/:articleTitle")

    .get(function (req, res) {

        async function run() {
            const cursor = await collection.findOne({ title: req.params.articleTitle });
            res.send(cursor);
        };

        run();

    })

    .put(function (req, res) {

        const searchParams = new URLSearchParams(req.url);

        const info = (Array.from(searchParams.values()));

        const updatedArticle = {
            $set: {
                title: info[0],
                content: info[1]
            },
        };

        const options = { upsert: true };

        collection.updateOne({ title: req.params.articleTitle }, updatedArticle, options);

        res.send("Successfully updated an article!");

    })

    .patch(function (req, res) {

        const searchParams = new URLSearchParams(req.url);

        const info = (Array.from(searchParams.values()));

        const updatedArticle = {
            $set: {
                title: info[0],
                content: info[1] },
        };

        const options = { upsert: true };

        collection.updateOne({ title: req.params.articleTitle }, updatedArticle, options);

        res.send("Successfully updated the field of an article!");

    })

    .delete(function (req, res) {

        collection.deleteOne({ title: req.params.articleTitle });

        res.send("Article successfully deleted!");

    });






//SERVIDOR
app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});