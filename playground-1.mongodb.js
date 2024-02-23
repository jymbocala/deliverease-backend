/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

const database = "Deliverease";
const usersCollection = "users";
const locationsCollection = "locations";

// Create a new database.
use(database);

// Create collections for users and locations.
db.createCollection(usersCollection);
db.createCollection(locationsCollection);

// More information on the `createCollection` command can be found at:
// https://www.mongodb.com/docs/manual/reference/method/db.createCollection/
