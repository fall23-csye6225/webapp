const db = require('../models/index');

const Users = db.users;
const Assignments = db.assignments;

const addAssignment = async (req, res) => {

    try {
        //let id = req.params.id;
        const userId = req.user.id;
        const user = await Users.findByPk(userId);

        if(Object.entries(req.body).length === 0 || Object.keys(req.body).length === 0 || JSON.stringify(req.body) === '{}'){
            return res.status(400).send({message: 'Bad Request'});
        }
        

        const { name, points, num_of_attempts, deadline } = req.body;

        //console.log(points);

        if (deadline && new Date(deadline) <= new Date()) {
            return res.status(400).send({message: 'Deadline must be in the future'});
        }
        if (points !== undefined && points < 1 || points > 10) {
            return res.status(400).send({message: 'Points should be in the range 1 to 10'});
        } 
        if (num_of_attempts !== undefined && num_of_attempts < 1 || num_of_attempts > 100) {
            return res.status(400).send({message: 'num_of_attempts should be in the range 1 to 100'});
        }
        
        if (!user) {
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
                res.status(200).send(assignment);

        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

}


const getAllAssignments = async (req, res) => {

    try {
        //const userId = req.user.id;

        let assignments = await Assignments.findAll({});
        res.status(200).send(assignments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}


const getAnAssignment = async (req, res) => {

    try {
        let id = req.params.id;
        //const userId = req.user.id;

        let assignment = await Assignments.findOne({ where: { id: id} });
        
        if (!assignment) {
            return res.status(204).send({message: 'Assignment not found'});
        }

        res.status(200).send(assignment);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

}


const updateAssignment = async (req, res) => {
    try {
        let id = req.params.id;
        // console.log("entires",Object.entries(req.body).length);
        // console.log("keys",Object.keys(req.body).length === 0);
        // console.log("json",JSON.stringify(req.body) === '{}');

        if(Object.entries(req.body).length === 0 || Object.keys(req.body).length === 0 || JSON.stringify(req.body) === '{}'){
            return res.status(400).send({message: 'Bad Request'});
        }
        
        const userId = req.user.id;
        let assignment = await Assignments.findOne({ where: { id: id} });
        // console.log("assi", assignment);
        if(!assignment){return res.status(404).send({message: 'Assignment not found'});}
        if(assignment.userId === userId){

        const { name, points, num_of_attempts, deadline } = req.body;

        //console.log(points);

        if (deadline && new Date(deadline) <= new Date()) {
            return res.status(400).send({message: 'Deadline must be in the future'});
        }
        if (points !== undefined && points < 1 || points > 10) {
            return res.status(400).send({message: 'Points should be in the range 1 to 10'});
        } 
        if (num_of_attempts !== undefined && num_of_attempts < 1 || num_of_attempts > 100) {
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
            return res.status(404).send({message: 'Assignment not found'});
        }

        res.status(204).send({message: 'Assignment updated successfully'});



        } else {
            return res.status(403).send({'message': 'Unauthorized User'});
        }
        
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};



const deleteAssignment = async (req, res) => {

    try {
    let id = req.params.id;
        
        const userId = req.user.id;
        let assignment = await Assignments.findOne({ where: { id: id} });
        if(!assignment){return res.status(404).send({message: 'Assignment not found'});}
        if(assignment.userId === userId){
            await Assignments.destroy({ where: { id: id, userId: userId } });
            res.status(204).send({message: 'Assignment is deleted'});
        } else {
            return res.status(403).send({'message': 'Unauthorized User'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const patchUpdateAssignment = async (req, res) => {

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

