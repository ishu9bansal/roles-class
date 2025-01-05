require('dotenv').config();
const express = require('express');
const tasksRouter = require('./routes/tasks.js');
const projectsRouter = require('./routes/projects.js');
const { USERS, ROLES } = require('./db.js');
const { authenticateToken, authRole } = require('./middleware/auth.js');

const app = express();
const PORT = 5050;

// Middleware to parse JSON
app.use(express.json());
app.use(authenticateToken);

app.use('/tasks', tasksRouter);
app.use('/projects', authRole(ROLES.ADMIN, ROLES.MANAGER), projectsRouter);

app.get('/users', authRole(ROLES.ADMIN), (req, res) => {
    return res.json(USERS);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
