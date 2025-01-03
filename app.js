const express = require('express');
const cors = require('cors')
const index = require('./to-do-list-react/index');


const port = process.env.PORT_TODO || 3000;

const app = express();

// Define CORS options:
var corsOptions = {
    origin: '*',
    exposedHeaders: '*'
}

// Define the url used with a router inside backtest file. - These are middlewares.
app.use(express.json()) // This middleware is to accept json in the body request.

app.use('/to-do-list',cors(corsOptions),index);

// Executes the back
app.listen(port, () => {
    console.log(`Server Running in port: ${port}`);
});