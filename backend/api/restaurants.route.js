import express from "express"
import RestaurantsCtrl from "./restaurants.controller.js"
import ReviewsCtrl from "./reviews.controller.js"

// Get access to the router
const router = express.Router()

router.route("/").get(RestaurantsCtrl.apiGetRestaurants)
router.route("/id/:id").get(RestaurantsCtrl.apiGetRestaurantById)
router.route("/cuisines").get(RestaurantsCtrl.apiGetRestaurantCuisine)

router
    .route("/review")
    .post(ReviewsCtrl.apiPostReview) // create
    .put(ReviewsCtrl.apiUpdateReview) // edit
    .delete(ReviewsCtrl.apiDeleteReview) // delete

export default router