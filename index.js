const express = require('express')

const server = express()
server.use(express.json())
server.use(incrementRequisitionCounter)

let requisitionCounter = 0

//DEFAULT PROJECTS
let projects = [
    {
        "id": 1,
        "title": 'Javascript',
        "tasks": []
    },
    {
        "id": 2,
        "title": 'GoStack',
        "tasks": []
    }
]

//MIDDLEWARES
function checkProjectExists (req, res, next) {
    const { id } = req.params

    const project = projects.filter(proj => proj.id == id)

    if (! project)
        return res.status(400).json({ error: 'Project does not exists!' })

    req.project = project
    next()
}

function incrementRequisitionCounter (req, res, next) {
    requisitionCounter++
    console.log(requisitionCounter)
    
    next()
}

//GET ALL PROJECTS
server.get('/projects', (req, res) => {
    res.send(projects)
})

//GET ONE PROJECT
server.get('/projects/:id', checkProjectExists, (req, res) => {
    res.json(req.project)
})

//CREATE PROJECT
server.post('/projects', (req, res) => {
    const { id, title } = req.body

    projects.push({
        id, title, tasks: []
    })

    res.json(projects)
})

//UPDATE PROJECT
server.put('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params
    const { title } = req.body

    for (const index in projects) {
        const project = projects[index]

        if (project.id == id) {
            project.title = title
            break
        }
    }

    res.json(projects)
})

//DELETE PROJECT
server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params

    projects = projects.filter(project => project.id != id)

    res.send()
})

//CREATE TASK
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const { id } = req.params
    const { title } = req.body

    for (const index in projects) {
        const project = projects[index]

        if (project.id == id) {
            project.tasks.push(title)
            break
        }
    }

    res.json(projects)
})

const PORT = 3000
server.listen(PORT)