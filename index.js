const express = require('express');
const bodyParser = require('body-parser');


const db = require('./db');


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.listen(port, 'localhost', () => {
    console.log(`Server running on port ${port}`);
});

class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    async save() {
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [this.name, this.email, this.password]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM users');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, name, email) {
        await db.execute(
            'UPDATE users SET name = ?, email = ? WHERE id = ?',
            [name, email, id]
        );
    }

    static async delete(id) {
        await db.execute('DELETE FROM users WHERE id = ?', [id]);
    }
}

app.post('/users', async (req, res) => {
    const { name, email, password } = req.body;
    const user = new User(name, email, password);
    const userId = await user.save();
    res.status(201).json({ id: userId });
});

app.get('/users', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

app.get('/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
});

app.put('/users/:id', async (req, res) => {
    const { name, email } = req.body;
    await User.update(req.params.id, name, email);
    res.status(204).send();
});

app.delete('/users/:id', async (req, res) => {
    await User.delete(req.params.id);
    res.status(204).send();
});

class Habit {
    constructor(userId, name, description) {
        this.userId = userId;
        this.name = name;
        this.description = description;
    }

    async save() {
        const [result] = await db.execute(
            'INSERT INTO habits (user_id, name, description) VALUES (?, ?, ?)',
            [this.userId, this.name, this.description]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM habits');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM habits WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, name, description) {
        await db.execute(
            'UPDATE habits SET name = ?, description = ? WHERE id = ?',
            [name, description, id]
        );
    }

    static async delete(id) {
        await db.execute('DELETE FROM habits WHERE id = ?', [id]);
    }
}


app.post('/habits', async (req, res) => {
    const { userId, name, description } = req.body;
    const habit = new Habit(userId, name, description);
    const habitId = await habit.save();
    res.status(201).json({ id: habitId });
});

app.get('/habits', async (req, res) => {
    const habits = await Habit.findAll();
    res.json(habits);
});

app.get('/habits/:id', async (req, res) => {
    const habit = await Habit.findById(req.params.id);
    res.json(habit);
});

app.put('/habits/:id', async (req, res) => {
    const { name, description } = req.body;
    await Habit.update(req.params.id, name, description);
    res.status(204).send();
});

app.delete('/habits/:id', async (req, res) => {
    await Habit.delete(req.params.id);
    res.status(204).send();
});



