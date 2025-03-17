import express from "express"
import httpErrors from "http-errors"

// custom routes
import rootRoutes from "./roots/root"
// custom middleware

const app = express()
const PORT = process.env.PORT || 3000

app.use("/", rootRoutes)


app.use((_, __, next) => {
    next(httpErrors(404))
})

app.listen(PORT, () => {
    console.log("server listening at port: ", PORT)
})