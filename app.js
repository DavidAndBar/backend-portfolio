const express = require('express');
const index = require('./to-do-list-react/index');


const port = process.env.PORT || 3000;

const app = express();




// Define the url used with a router inside backtest file. - These are middlewares.
app.use(express.json()) // This middleware is to accept json in the body request.

app.use('/to-do-list',index);

// Executes the back
app.listen(port, () => {
    console.log(`Server Running in port: ${port}`);
}); 