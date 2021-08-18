import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import restaurantsDAO from "./dao/restaurantsDAO.js"
import ReviewsDAO from "./dao/reviewsDAO.js"
dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI,
    {
        poolSize: 50,
        wtimeout: 2500,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .catch(err => {
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client => {
        await restaurantsDAO.injectDB(client) // gets initial reference to the restaurants collection in the database
        await ReviewsDAO.injectDB(client)
        app.listen(port, () => { // start webserver
            console.log(`listening on port ${port}`)
        })
    })
