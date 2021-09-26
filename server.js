const express = require("express");

const app = express();
var cors = require('cors')

const port = process.env.PORT || 5000;
const router=require('./routes/payment');
// middlewares
app.use(express.json({ extended: false }));
app.use(cors())

// route included
app.use("/payment", router);

app.listen(port, () => console.log(`server started on port ${port}`));