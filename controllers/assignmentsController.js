const db = require('../models/index');

const Users = db.users;
const Assignments = db.assignments;
const Submissions = db.submissions;
const StatsD = require('node-statsd');
const statsdClient = new StatsD(({
    host: 'localhost',  
    port: 8125,          
  }));
const log4js = require('../log4js_config');

const logger = log4js.getLogger();


const addAssignment = async (req, res) => {

    try {
        statsdClient.increment('api_call_post');
        logger.info(`Received ${req.method} request to add assignment`);
        //let id = req.params.id;
        const userId = req.user.id;
        const user = await Users.findByPk(userId);

        if(Object.entries(req.body).length === 0 || Object.keys(req.body).length === 0 || JSON.stringify(req.body) === '{}'){
            logger.warn('Bad request: Request body is empty.');
            return res.status(400).send({message: 'Bad Request'});
        }
        

        const { name, points, num_of_attempts, deadline } = req.body;

        //console.log(points);


        if(name == undefined) {
            logger.warn('Name is not defined.');
            return res.status(400).send({message: 'Name is not defined.'});
        }
        if (deadline == undefined || new Date(deadline) <= new Date()) {
            logger.warn('Deadline must be in the future.');
            return res.status(400).send({message: 'Deadline must be in the future'});
        }
        if (points == undefined || !Number.isInteger(points) || points < 1 || points > 10) {
            logger.warn('Points should be in the range 1 to 10.');
            return res.status(400).send({message: 'Points should be in the range 1 to 10'});
        } 
        if (num_of_attempts == undefined || num_of_attempts < 1 || num_of_attempts > 100) {
            logger.warn('num_of_attempts should be in the range 1 to 100');
            return res.status(400).send({message: 'num_of_attempts should be in the range 1 to 100'});
        }
        
        if (!user) {
            logger.warn('User not found.');
            return res.status(404).send('User not found');
                }
        
                let info = {
                    name: req.body.name,
                    points: req.body.points,
                    num_of_attempts: req.body.num_of_attempts,
                    deadline: req.body.deadline,
                    userId: userId
                };
        
                const assignment = await Assignments.create(info);
                logger.info(`Assignment created successfully: ${assignment.id}`);
                res.status(201).send(assignment);
                
        
    } catch (error) {
        console.error(error);
        logger.error(`Error occurred while processing the ${req.method} request: ${error}`);
        res.status(500).send('Internal Server Error');
    }

}


const getAllAssignments = async (req, res) => {

    try {
        //const userId = req.user.id;
        statsdClient.increment('api_call_get');
        logger.info(`Received ${req.method} request to get all assignments`);
        let assignments = await Assignments.findAll({});
        res.status(200).send(assignments);
    } catch (error) {
        console.error(error);
        logger.error(`Error occurred while processing the ${req.method} request: ${error}`);
        res.status(500).send('Internal Server Error');
    }
}


const getAnAssignment = async (req, res) => {

    try {
        statsdClient.increment('api_call_get');
        logger.info(`Received ${req.method} request to get assignment with id: ${req.params.id}`);
        let id = req.params.id;
        //const userId = req.user.id;

        let assignment = await Assignments.findOne({ where: { id: id} });
        
        if (!assignment) {
            logger.info(`No assignment found with id: ${id}`);
            return res.status(404).send({message: 'Assignment not found'});
        }
        logger.info(`Retrieved assignment details for id: ${id}`);
        res.status(200).send(assignment);
    } catch (error) {
        console.error(error);
        logger.error(`Error occurred while processing the ${req.method} request: ${error}`);
        res.status(500).send('Internal Server Error');
    }

}


const updateAssignment = async (req, res) => {
    try {
        statsdClient.increment('api_call_put');
        logger.info(`Received ${req.method} request to update assignment with id: ${req.params.id}`);
        let id = req.params.id;
        // console.log("entires",Object.entries(req.body).length);
        // console.log("keys",Object.keys(req.body).length === 0);
        // console.log("json",JSON.stringify(req.body) === '{}');

        if(Object.entries(req.body).length === 0 || Object.keys(req.body).length === 0 || JSON.stringify(req.body) === '{}'){
            logger.warn('Bad request: Request body is empty.');
            return res.status(400).send({message: 'Bad Request'});
        }
        
        const userId = req.user.id;
        let assignment = await Assignments.findOne({ where: { id: id} });
        // console.log("assi", assignment);
        if(!assignment){
            logger.info(`No assignment found with id: ${id}`);
            return res.status(404).send({message: 'Assignment not found'});
        }
        if(assignment.userId === userId){

        const { name, points, num_of_attempts, deadline } = req.body;

        //console.log(points);
        if(name == undefined) {
            logger.warn('Name is not defined.');
            return res.status(400).send({message: 'Name is not defined.'});
        }
        if (deadline == undefined || new Date(deadline) <= new Date()) {
            return res.status(400).send({message: 'Deadline must be in the future'});
        }
        if (points == undefined || !Number.isInteger(points) || points < 1 || points > 10) {
            return res.status(400).send({message: 'Points should be in the range 1 to 10'});
        } 
        if (num_of_attempts == undefined || num_of_attempts < 1 || num_of_attempts > 100) {
            return res.status(400).send({message: 'num_of_attempts should be in the range 1 to 100'});
        }
        
        const updatedFields = {};
        if (name !== undefined) updatedFields.name = name;
        if (points !== undefined) updatedFields.points = points;
        if (num_of_attempts !== undefined) updatedFields.num_of_attempts = num_of_attempts;
        if (deadline !== undefined) updatedFields.deadline = deadline;

        updatedFields.assignment_updated = db.sequelize.literal('CURRENT_TIMESTAMP');

        let result = await Assignments.update(updatedFields, { where: { id: id, userId: userId } });

        if (result[0] === 0) {
            logger.info(`Assignment not found or not updated for id: ${id}`);
            return res.status(404).send({message: 'Assignment not found'});
        }

        logger.info(`Assignment updated successfully: ${id}`);
        res.status(204).send({message: 'Assignment updated successfully'});



        } else {
            logger.warn('Unauthorized user attempt to update assignment.');
            return res.status(403).send({'message': 'Unauthorized User'});
        }
        
        
    } catch (error) {
        console.error(error);
        logger.error(`Error occurred while processing the ${req.method} request: ${error}`);
        res.status(500).send('Internal Server Error');
    }
};



const deleteAssignment = async (req, res) => {

    try {
        statsdClient.increment('api_call_delete');
        logger.info(`Received ${req.method} request to delete assignment with id: ${req.params.id}`);
        let id = req.params.id;
        
        const userId = req.user.id;

        if (Object.keys(req.body).length > 0) {
            logger.warn('Request with body is not allowed for deletion.');
            return res.status(400).send({ message: 'Request with body is not allowed for deletion' });
        }
        
        let assignment = await Assignments.findOne({ where: { id: id} });
        if(!assignment){
            logger.info(`No assignment found with id: ${id}`);
            return res.status(404).send({message: 'Assignment not found'});
        }
        if(assignment.userId === userId){
            const submissionExists = await Submissions.count({
                where: {
                    id
                },
            });
            if(submissionExists){
            logger.info(`Assignment was not deleted`);
            res.status(404).send({message: 'Assignment found with submissions.'});
            } else {

            await Assignments.destroy({ where: { id: id, userId: userId } });
            logger.info(`Assignment deleted successfully: ${id}`);
            res.status(204).send({message: 'Assignment is deleted'});
            }
    
            
        } else {
            logger.warn('Unauthorized user attempt to delete assignment.');
            return res.status(403).send({'message': 'Unauthorized User'});
        }
    } catch (error) {
        console.error(error);
        logger.error(`Error occurred while processing the ${req.method} request: ${error}`);
        res.status(500).send('Internal Server Error');
    }
}

const patchUpdateAssignment = async (req, res) => {
    statsdClient.increment('api_call_patch');
    logger.info(`Received ${req.method} request for patch update assignment with id: ${req.params.id}`);
    logger.warn('Received a PATCH request, but this method does not support PATCH updates.');

    return res.status(405).send({'message': 'Method Not Allowed'});

}


module.exports = {
    addAssignment,
    getAllAssignments,
    getAnAssignment,
    updateAssignment,
    deleteAssignment,
    patchUpdateAssignment
}

