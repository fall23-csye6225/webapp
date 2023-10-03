const express = require('express');
const cors = require('cors');
const checkAuthorization = require('./middleware/checkAuth');


const app = express();

var corOptions = {
    origin: 'https://localhost:4000'
}
// middleware

app.use(cors(corOptions));

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(checkAuthorization);



// routes

const router =  require('./routes/assignmentsRouter.js');
app.use('/v1/assignments',router);

// test

app.get('/', (req,res) => {
    res.json({message: 'hello'});
});

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});