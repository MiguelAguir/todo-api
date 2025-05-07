require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.json());
let tasks = [];
let nextId = 1;

app.get('/', (req, res) => {
    res.render('index', { tasks });
});

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'El título es obligatorio' });
    }
    const task = { id: nextId++, title, completed: false };
    tasks.push(task);
    res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, completed } = req.body;
    const task = tasks.find(t => t.id === id);
    if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;
    res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    tasks.splice(index, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});