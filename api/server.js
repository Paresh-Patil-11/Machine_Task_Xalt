const express = require('express')
const app = express()
const port = 5000
const routes = require("./routes");
var cors = require('cors')

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('./api', routes)

app.listen(port, () => {
  console.log(`Server run on port ${port}`)
})
