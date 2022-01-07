import axios from "axios";
require("dotenv").config();

console.log("in itemfinder, this is port", process.env.PORT);
export default axios.create({
    baseURL: "/api/v1/items"
    }
);
