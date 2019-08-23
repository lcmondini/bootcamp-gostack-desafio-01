const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
var numRequests = 0;

server.use((req, res, next) => {
  numRequests += 1;

  console.log(`Number of requests: ${numRequests}`);

  return next();
});

function checkIdInArray(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project does not exists" });
  }

  req.project = project;

  return next();
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

server.post("/projects/:id/tasks", checkIdInArray, (req, res) => {
  const { title } = req.body;

  req.project.tasks.push(title);

  return res.json(req.project);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkIdInArray, (req, res) => {
  const { title } = req.body;

  req.project.title = title;

  return res.json(req.project);
});

server.delete("/projects/:id", checkIdInArray, (req, res) => {
  projects.splice(projects.indexOf(req.project));

  return res.send();
});

server.listen(3000);
