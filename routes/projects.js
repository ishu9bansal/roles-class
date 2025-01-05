const { PROJECTS, TASKS, USERS } = require('../db.js');
const router = require('express').Router();


router.get('/', (req, res) => {
    const detailedProjects = PROJECTS.map(project => {
        const taskCount = TASKS.filter(task => task.projectId === project.id).length;
        return {
            ...project,
            taskCount,
        };
    });
    res.json(detailedProjects);
});

router.get('/:id', (req, res) => {
    const project = PROJECTS.find(p => p.id === parseInt(req.params.id));
    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }
    const tasksForProject = TASKS.filter(task => task.projectId === project.id).map(task => {
        const user = USERS.find(u => u.id === task.userId);
        return {
            ...task,
            userName: user ? user.username : null,
        };
    });
    res.json({
        ...project,
        tasks: tasksForProject,
    });
});

router.post('/projects', (req, res) => {
    const { name, managerId } = req.body;
    if (!name || !managerId) {
        return res.status(400).json({ error: 'Name and managerId are required' });
    }
    const newProject = {
        id: PROJECTS.length + 1,
        name,
        managerId,
    };
    PROJECTS.push(newProject);
    res.status(201).json(newProject);
});

router.post('/:id/task', (req, res) => {
    const { name, userId } = req.body;
    const projectId = parseInt(req.params.id);
    if (!name || !projectId || !userId) {
        return res.status(400).json({ error: 'Name, projectId, and userId are required' });
    }
    const newTask = {
        id: TASKS.length + 1,
        name,
        projectId,
        userId,
    };
    TASKS.push(newTask);
    res.status(201).json(newTask);
});

router.delete('/:id', (req, res) => {
    const project = PROJECTS.findIndex(p => p.id === parseInt(req.params.id));
    if (project === null) {
        return res.status(404).json({ error: 'Project not found' });
    }
    console.log("Marked project completed", project.id);
    res.status(204).send();
});

module.exports = router;