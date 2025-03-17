import express from "express"

import rootRoutes from "./roots/root"

const app = express()
const PORT = process.env.PORT || 3000

app.use("/", rootRoutes)

app.listen(PORT, () => {
    console.log("server listening at port: ", PORT)
})