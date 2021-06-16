let restaurants // use to store a reference to the database

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
    }
}