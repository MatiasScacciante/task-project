const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Base de datos
const db = new sqlite3.Database('./src/db.sqlite', (err) => {
  if (err) console.error('❌ Error opening database', err);
  else console.log('✅ Connected to SQLite database');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    user TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    completedBy TEXT,
    completedAt TEXT
  )`);
});

// Rutas API
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/tasks', (req, res) => {
  const { name, category, user } = req.body;
  db.run(
    'INSERT INTO tasks (name, category, user) VALUES (?, ?, ?)',
    [name, category, user],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: this.lastID,
        name,
        category,
        user,
        completed: 0,
        completedBy: null,
        completedAt: null,
      });
    }
  );
});

app.put('/tasks/:id', (req, res) => {
  const { name, category } = req.body;
  db.run(
    'UPDATE tasks SET name = ?, category = ? WHERE id = ?',
    [name, category, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

app.put('/tasks/:id/completed', (req, res) => {
  const { completed, completedBy } = req.body;
  const completedAt = completed ? new Date().toISOString() : null;

  db.run(
    'UPDATE tasks SET completed = ?, completedBy = ?, completedAt = ? WHERE id = ?',
    [completed, completedBy, completedAt, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

app.delete('/tasks/:id', (req, res) => {
  db.run('DELETE FROM tasks WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Servir React (build)
const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

// Redirigir todo lo que no sea API a React
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
