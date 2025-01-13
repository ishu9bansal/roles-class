const { TASKS, fillTaskDetails } = require('../db.js');
const { populateTask } = require('../middleware/data.js');
const { paginate } = require('../middleware/pagination.js');
const router = require('express').Router();

router.get('/', filterTasks, paginate, (req, res) => {

    res.json(res.paginatedResults);
});

router.get('/:id', populateTask, (req, res) => {
    res.json(fillTaskDetails(req.task));
});

router.delete('/:id', populateTask, (req, res) => {
    console.log("Marked task completed", req.task.id);
    res.status(204).send();
});

function filterTasks(req, res, next) {
    const { users } = req.query;
    let filteredTasks = TASKS;
    if (users) {
        const userIds = users.split(',').map(id => parseInt(id));
        filteredTasks = filteredTasks.filter(task => userIds.includes(task.userId));
    }
    req.paginationResource = filteredTasks;
    next();
}

module.exports = router;