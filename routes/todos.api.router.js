const router = require("express").Router();
//const { connectClient } = require("../db/postgres");
const todoModel = require("../src/models/todoModel");

// Index
router.get("/", async (req, res) => {
    try {
        const todos = await todoModel.findAll();
        res.json(todos);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
// Get by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await todoModel.findByPk(id);
        if (!todo) {
            return res.status(404).send("Todo not found");
        }
        res.json(todo);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
//STORE
router.post("/", async (req, res) => {
    try {
        const { title, completed } = req.body;
        const newTodo = await todoModel.create({ title, completed });
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
// Update
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;
        const todo = await todoModel.findByPk(id);
        if (!todo) {
            return res.status(404).send("Todo not found");
        }
        todo.title = title;
        todo.completed = completed;
        await todo.save();
        res.json(todo);
        console.log("Todo updated")
    } catch (error) {
        res.status(500).send(error.message);
    }
});
// Delete
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await todoModel.findByPk(id);
        if (!todo) {
            return res.status(404).send("Todo not found");
        }
        await todo.destroy();
        res.send("Todo deleted");
        console.log("Todo deleted")
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
