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


const addSubmission = async (req, res) => {

    try {
        statsdClient.increment('api_call_post_submission');
        logger.info(`Received ${req.method} request to add submission`);
        let assignmentId = req.params.id;
        const userId = req.user.id;
        const user = await Users.findByPk(userId);

        if(Object.entries(req.body).length === 0 || Object.keys(req.body).length === 0 || JSON.stringify(req.body) === '{}'){
            logger.warn('Bad request: Request body is empty.');
            return res.status(400).send({message: 'Bad Request'});
        }


        let assignment = await Assignments.findOne({ where: { id: assignmentId} });
        // console.log("assi", assignment);
        if(!assignment){
            logger.info(`No assignment found with id: ${id}`);
            return res.status(404).send({message: 'Assignment not found'});
        }

        

        const { submission_url } = req.body;

        //console.log(points);


        if(submission_url == undefined) {
            logger.warn('Submission URL is not provided.');
            return res.status(400).send({message: 'Submission URL is not provided.'});
        }
        
        if (!user) {
            logger.warn('User not found.');
            return res.status(404).send('User not found');
        }

        const currentDateTime = new Date();
        const assignmentDeadline = new Date(assignment.deadline);

        if (currentDateTime > assignmentDeadline) {
            logger.warn('Submission deadline has passed.');
            return res.status(400).send({ message: 'Submission deadline has passed.' });
        }

        const maxAttempts = assignment.num_of_attempts;

        const submissionExists = await Submissions.count({
            where: {
                assignmentId,
                userId,
            },
        });

        if(submissionExists) {

            let submission = await Submissions.findOne({ where: {
                assignmentId,
                userId,
            }, });

            const existingSubmissionsCount = submission.attempts;

            if (existingSubmissionsCount >= maxAttempts) {
                logger.warn('Exceeded the maximum number of submission attempts.');
                return res.status(400).send({ message: 'Exceeded the maximum number of submission attempts.' });
            }
            
                    // let submission_info = {
                    //     submission_url: req.body.submission_url
                    // };

                    //const submission_url = req.body.submission_url;        


                    const updatedFields = {};
                    if (submission_url !== undefined) updatedFields.submission_url = submission_url;
            
                    updatedFields.submission_updated = db.sequelize.literal('CURRENT_TIMESTAMP');
                    updatedFields.attempts = submission.attempts + 1;
            
                    let result = await Submissions.update(updatedFields, { where: {
                        assignmentId,
                        userId,
                    } });
            
                    if (result[0] === 0) {
                        logger.info(`Submission not found or not updated`);
                        return res.status(404).send({message: 'Submission not found'});
                    }
            
                    logger.info(`Submission updated successfully`);
                    res.status(204).send({message: 'Submission updated successfully'});        
            
                    // const submission = await Submissions.create(submission_info);
                    // logger.info(`Submission created successfully: ${submission.id}`);
                    // res.status(201).send(submission);
        } else {

            let submissionInfo = {
                submission_url: submission_url,
                attempts: 0
            };
    
            const submission = await Submissions.create(submissionInfo);
            logger.info(`Assignment created successfully: ${submission.id}`);
            res.status(201).send(submission);

        }



        
                
        
    } catch (error) {
        console.error(error);
        logger.error(`Error occurred while processing the ${req.method} request: ${error}`);
        res.status(500).send('Internal Server Error');
    }

}



module.exports = {addSubmission}