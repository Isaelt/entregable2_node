import express from "express";
import db from './utils/database.js'
import Todo from "./models/todos.model.js";
import "dotenv/config";

Todo;

const PORT = process.env.PORT ?? 8000;

db.authenticate()
  .then(() => {
    console.log("conexion correcta")
  })
  .catch((error) => console.log(error));

db.sync()
  .then(() => console.log('base de datos sincronizada'))
  .catch((error) => console.log(error));

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('OK');
});

app.post('/todos', async (req, res) => {
    try {
        const { body } =req;
    
        const todo = await Todo.create(body);
        res.status(201).json(todo);
        
    } catch (error) {
        res.status(400).json(error);
    }
});

app.get('/todos', async (req, res) => {
    try {
        const todos =  await Todo.findAll();
        res.json(todos)
    } catch (error) {
        res.status(400).json(error);
    }
});

app.get('/todos/:id', async (req, res) => {
    try {
        
        const { id } = req.params;
        const todos =  await Todo.findByPk(id);
        res.json(todos)
    } catch (error) {
        res.status(400).json(error);
    }
});

app.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;

        const todos = await Todo.update(body, {
            where: { id }
        });
        res.json(todos);
    } catch (error) {
        res.status(400).json(error);
    }
})

app.delete('/todos/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      await Todo.destroy({
        where: {id}
      });
      res.status(204).end() // termina con la petición
    } catch (error) {
       res.status(400).json(error);
      }
})

app.listen(PORT, () => {
    console.log(`servidor escuchando en el puerto ${PORT}`);
});