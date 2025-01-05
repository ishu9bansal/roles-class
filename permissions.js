const { ROLES } = require("./db")

function canViewProject(project, user) {
    return user.role === ROLES.ADMIN || project.managerId === user.id;
}

function canEditProject(project, user) {
    return project.managerId === user.id;
}

module.exports = {
    canViewProject,
    canEditProject,
}