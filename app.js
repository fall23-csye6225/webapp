const express = require('express');
const cors = require('cors');
const checkAuthorization = require('./middleware/checkAuth');
const db = require('./models/index');
const StatsD = require('node-statsd');
const statsdClient = new StatsD(({
  host: 'localhost',  
  port: 8125,          
}));
const log4js = require('./log4js_config');

const logger = log4js.getLogger();


const app = express();

var corOptions = {
    origin: 'https://localhost:4000'
}
// middleware

app.use(cors(corOptions));

app.use(express.json());

app.use(express.urlencoded({extended: true}));

//app.use(checkAuthorization);



// routes

const router =  require('./routes/assignmentsRouter.js');
app.use('/v2/assignments',checkAuthorization,router);

// test

app.get('/', (req,res) => {
    res.json({message: 'hello'});
});


app.use((req, res, next) => {
    
    if(req.method === 'GET' && Object.keys(req.body).length && req.body !== 0) {
        console.log(req.body);
        res.setHeader('Cache-Control', 'no-cache');
        return res.status(400).send();
    } 
    next();
});


app.get("/healthz", (req, res) => {
  statsdClient.increment('api_call_get_healthz');
  logger.info(`Received ${req.method} request for health check`);
    console.log("test:",req.body.length);
    db.sequelize.authenticate().then( ()=> {
        res.setHeader('Cache-Control', 'no-cache');
        console.log("Connection Successful");
        logger.info("Database connection successful");
        res.status(200).send();
        //res.status(200).json({message: 'HTTP 200 OK'});
    }).catch( (error) => {
        console.log(error);
        console.log("Connection Unsuccessful");
        logger.error(`Database connection error: ${error}`);
        logger.warn("Connection Unsuccessful");
        res.setHeader('Cache-Control', 'no-cache');
        res.status(503).send();
    });
  });



  app.post("/healthz", (req, res) => {
    statsdClient.increment('api_call_post_healthz');
    logger.warn(`Received a ${req.method} request for health check. This endpoint only supports GET requests.`);
    res.setHeader('Cache-Control', 'no-cache');
    res.status(405).send();
  });

  app.put("/healthz", (req, res) => {
    statsdClient.increment('api_call_put_healthz');
    logger.warn(`Received a ${req.method} request for health check. This endpoint only supports GET requests.`);
    res.setHeader('Cache-Control', 'no-cache');
    res.status(405).send();
  });

  app.delete("/healthz", (req, res) => {
    statsdClient.increment('api_call_delete_healthz');
    logger.warn(`Received a ${req.method} request for health check. This endpoint only supports GET requests.`);
    res.setHeader('Cache-Control', 'no-cache');
    res.status(405).send();
  });

  app.patch("/healthz", (req, res) => {
    statsdClient.increment('api_call_patch_healthz');
    logger.warn(`Received a ${req.method} request for health check. This endpoint only supports GET requests.`);
    res.setHeader('Cache-Control', 'no-cache');
    res.status(405).send();
  });


  app.options("/healthz", (req, res) => {
    statsdClient.increment('api_call_options_healthz');
    logger.warn(`Received a ${req.method} request for health check. This endpoint only supports GET requests.`);
    res.setHeader('Cache-Control', 'no-cache');
    res.status(405).send();
  });



app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.status(404).send();
  });

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

module.exports = app;
