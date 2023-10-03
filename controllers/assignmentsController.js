const db = require('../models');

const Users = db.users;
const Assignments = db.assignments;

const addAssignment = async (req, res) => {



    let info = {
        name: req.body.name,
        points: req.body.points,
        num_of_attempts: req.body.num_of_attempts,
        deadline: req.body.deadline
    }

    const assignment = await Assignments.create(info);
    res.status(200).send(assignment);
    console.log(assignment);

}


const getAllAssignments = async (req, res) => {

    let assignments = await Assignments.findAll({});
    res.status(200).send(assignments);
}


const getAnAssignment = async (req, res) => {

    let id = req.params.id;
    let assignment = await Assignments.findOne({where: {id: id}});
    res.status(200).send(assignment);
}


const updateAssignment = async (req, res) => {

    let id = req.params.id;
    let assignment = await Assignments.update(req.body,{where: {id: id}});
    res.status(200).send(assignment);
}


const deleteAssignment = async (req, res) => {

    let id = req.params.id;
    await Assignments.delete({where: {id: id}});
    res.status(200).send('Assignment is deleted');
}


module.exports = {
    addAssignment,
    getAllAssignments,
    getAnAssignment,
    updateAssignment,
    deleteAssignment
}

