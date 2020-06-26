const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const midIsUuid = (request, response, next) =>{
  const { id } = request.params;
  if(!isUuid(id))
    return response.status(400).send();

  return next();
}

const midFoundRepository = (request, response, next) => {
  const { id } = request.params;
  const index = repositories.findIndex(repository => repository.id === id);
  if(index < 0) {
    return response.status(404).send();
  }
  request.params.index = index
  return next();
}


const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);
  return response.status(201).json(repository);
});

app.put(
  "/repositories/:id",
  midIsUuid,
  midFoundRepository,
  (request, response) => {
    const { index } = request.params;
    const { title, url, techs } = request.body;
    repositories[index].title = title;
    repositories[index].url = url;
    repositories[index].techs = techs;

    return response.json(repositories[index]);
});

app.delete(
  "/repositories/:id", 
  midIsUuid, 
  midFoundRepository, 
  (request, response) => {
    const { index } = request.params;
    repositories.splice(index,1);
    return response.status(204).send();
});

app.post(
  "/repositories/:id/like", 
  midIsUuid, 
  midFoundRepository, 
  (request, response) => {
    const { index } = request.params;
    repositories[index].likes+=1;
    return response.json(repositories[index]);
});

module.exports = app;
