let restaurants // use to store a reference to the database
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

export default class RestaurantsDAO {
    // initially connect to the database once server starts
    // gets reference to the restaurant database
    static async injectDB(conn) {
        if (restaurants) { // if filled
            return
        }
        try { // else fill with db from collection restaurants
            restaurants = await conn.db(process.env.RESTVIEWS_NS).collection("restaurants")
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in restaurantsDAO: ${e}`
            )
        }
    }

    // Get all restaurants from database
    static async getRestaurants({
        filters = null,
        page = 0,
        restaurantsPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if ("name" in filters) {
                query = { $text: { $search: filters["name"] } }
            } else if ("cuisine" in filters) {
                query = { "cuisine": { $eq: filters["cuisine"] } }
            } else if ("zipcode" in filters) {
                query = { "address.zipcode": { $eq: filters["zipcode"] } }
            }
        }

        let cursor

        try {
            cursor = await restaurants
                .find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { restaurantsList : [], totalNumRestauarants: 0 }
        }

        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

        try {
            const restaurantsList = await displayCursor.toArray()
            const totalNumRestauarants = page === 0 ? await restaurants.countDocuments(query) : 0

            return { restaurantsList, totalNumRestauarants }
        } catch (error) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`)
            return { restaurantsList : [], totalNumRestauarants: 0 }
        }
    }

    static async getRestaurantById(id) {
        try {
            const pipeline = [ // help match different collections together
                {
                    $match: {
                        _id: new ObjectId(id),
                    },
                },
                {
                    $lookup: {
                        from: "reviews",
                        let: {
                            id: "$_id",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$restaurant_id", "$$id"],
                                    },
                                },
                            },
                            {
                                $sort: {
                                    date: -1,
                                },
                            },
                        ],
                        as: "reviews",
                    },
                },
                {
                    $addFields: {
                        reviws: "$reviews",
                    },
                },
            ]
            return await restaurants.aggregate(pipeline).next()
        } catch (e) {
            console.error(`Something went wrong in getRestaurantByID: ${e}`)
            throw e
        }
    }

    static async getCuisines() {
        let cuisines = []
        try {
            cuisines = await restaurants.distinct("cuisine")
            return cuisines
        } catch (e) {
            console.error(`Unable to get cuisines, ${e}`)
            return cuisines
        }
    }
}