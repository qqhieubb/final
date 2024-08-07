import { readdirSync} from "fs"

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

require("dotenv").config();

const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use((req,res,next) => {
    console.log("This is middleware")
    next()
});

// Route
app.get('/', (req, res) => {
  res.send("Hit the endpoint");
});

readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)))


// Port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));