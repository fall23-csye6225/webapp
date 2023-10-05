const assignmentsController = require('../controllers/assignmentsController.js');

const router = require('express').Router();


router.get('/', assignmentsController.getAllAssignments)
router.get('/:id', assignmentsController.getAnAssignment)

router.post('/', assignmentsController.addAssignment)

router.put('/:id', assignmentsController.updateAssignment)
router.delete('/:id', assignmentsController.deleteAssignment)
router.patch('/:id', assignmentsController.patchUpdateAssignment)

module.exports = router;