import express from "express"

// Get access to the router
const router = express.Router()

router.route("/").get((req, res) => res.send("Hello World"))

export default router