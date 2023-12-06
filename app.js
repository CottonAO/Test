const express = require('express');
const knex = require('knex');
const bcrypt = require('bcrypt');

const db = knex({
 client: 'sqlite3',
 connection: {
    filename: './users.db'
 },
 useNullAsDefault: true
});

const app = express();

app.use(express.json());

app.post('/api/users', async (req, res) => {
 const { name, email, password } = req.body;

 if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
 }

 const hashedPassword = await bcrypt.hash(password, 10);

 const user = { name, email, password: hashedPassword };

 db('users').insert(user).then(() => {
    res.status(201).json(user);
 }).catch(() => {
    res.status(400).json({ error: 'Error inserting user into database' });
 });
});

app.get('/api/users', (req, res) => {
 db('users').then((users) => {
    res.json(users);
 }).catch(() => {
    res.status(400).json({ error: 'Error retrieving users from database' });
 });
});

app.get('/api/users/:id', (req, res) => {
 const id = req.params.id;

 db('users').where('id', id).first().then((user) => {
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
 }).catch(() => {
    res.status(400).json({ error: 'Error retrieving user from database' });
 });
});

app.put('/api/users/:id', async (req, res) => {
 const id = req.params.id;
 const { name, email, password } = req.body;

 if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
 }

 const hashedPassword = await bcrypt.hash(password, 10);

 const user = { name, email, password: hashedPassword };

 db('users').where('id', id).update(user).then(() => {
    res.json(user);
 }).catch(() => {
    res.status(400).json({ error: 'Error updating user in database' });
 });
});

app.delete('/api/users/:id', (req, res) => {
 const id = req.params.id;

 db('users').where('id', id).del().then(() => {
    res.json({ success: true });
 }).catch(() => {
    res.status(400).json({ error: 'Error deleting user from database' });
 });
});

app.listen(3000, () => {
 console.log('Server is running on port 3000');
});