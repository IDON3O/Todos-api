const router = require("express").Router();
const { connectClient } = require("../db/postgres");
const sequelize = require("../db/sequelize");
const { Op } = require("sequelize");
const Todo = require("../src/models/todoModel");

// Index
router.get("/", async (req, res) => {
    try {
        const todos = await Todo.findAll();
        res.render('todos/index', { todos: todos }); // Renderiza la vista EJS con los todos obtenidos
    } catch (error) {
        res.status(500).send(error.message);
    }
});
// Get by ID
router.get("/search", async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm;
        const todos = await Todo.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${searchTerm}%` // Busca todos los todos que contengan el searchTerm en el título
                }
            }
        });
        res.render('todos/index', { todos: todos });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
// Store
router.post("/", async (req, res) => {
    try {
        const {title, completed} = req.body;
        await Todo.create({ title, completed: completed == 'on' ? true : false });
        res.redirect('/todospanel');
    } catch (error) {
        res.status(500).send(error.message);
    }
});
// Update
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;
        const todo = await Todo.findByPk(id);
        if (!todo) {
            return res.status(404).send("Todo not found");
        }
        todo.title = title;
        todo.completed = completed;
        await todo.save();
        res.redirect('/todospanel');
    } catch (error) {
        res.status(500).send(error.message);
    }
});
// Delete
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findByPk(id);
        if (!todo) {
            return res.status(404).send("Todo not found");
        }
        await todo.destroy();
        res.redirect('/todospanel');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;