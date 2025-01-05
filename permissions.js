const { ROLES } = require("./db")

function canViewProject(project, user) {
    return user.role === ROLES.ADMIN || project.managerId === user.id;
}

function canEditProject(project, user) {
    return project.managerId === user.id;
}

function canCreateProject(user) {
    return user.role === ROLES.ADMIN || (user.role === ROLES.MANAGER && req.body.managerId === user.id);
}

module.exports = {
    canViewProject,
    canEditProject,
    canCreateProject,
}