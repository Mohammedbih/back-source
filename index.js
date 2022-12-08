const express = require('express');
const router = express.Router();

const app = express();

app.listen(3000, ()=>{
    console.log('Ready');
})