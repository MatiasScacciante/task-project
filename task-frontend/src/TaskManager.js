import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000/tasks';

function TaskManager({ user }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', category: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async () => {
    if (!newTask.name || !newTask.category) return alert('Completa todos los campos');
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTask, user }),
      });
      setNewTask({ name: '', category: '' });
      fetchTasks();
      setShowForm(false);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const updateCompletion = async (id, completed) => {
    try {
      await fetch(`${API_URL}/${id}/completed`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: completed ? 0 : 1, completedBy: user }),
      });
      fetchTasks();
    } catch (err) {
      console.error('Error updating task completion:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const startEdit = (task) => setEditingTask(task);

  const confirmEdit = async () => {
    try {
      await fetch(`${API_URL}/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingTask.name,
          category: editingTask.category,
        }),
      });
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error('Error editing task:', err);
    }
  };

  return (
    <div className="container py-3">
      <h3 className="text-center mb-3">Hola, {user}</h3>

      <div className="mb-3 text-center">
        <button className="btn btn-outline-primary w-100" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Nueva tarea'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title mb-3">Crear nueva tarea</h5>
            <div className="d-grid gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Categoría"
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              />
              <button className="btn btn-success mt-2" onClick={createTask}>
                Agregar tarea
              </button>
            </div>
          </div>
        </div>
      )}

      <h5 className="mb-2">Tareas compartidas</h5>
      <ul className="list-group">
        {tasks.map((task) => (
          <li key={task.id} className="list-group-item">
            <div className="d-flex flex-column">
              <div className="d-flex align-items-center">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  checked={task.completed === 1}
                  onChange={() => updateCompletion(task.id, task.completed)}
                />
                {editingTask?.id === task.id ? (
                  <div className="w-100 d-grid gap-2">
                    <input
                      className="form-control"
                      type="text"
                      value={editingTask.name}
                      onChange={(e) =>
                        setEditingTask({ ...editingTask, name: e.target.value })
                      }
                    />
                    <input
                      className="form-control"
                      type="text"
                      value={editingTask.category}
                      onChange={(e) =>
                        setEditingTask({ ...editingTask, category: e.target.value })
                      }
                    />
                  </div>
                ) : (
                  <span>
                    <strong>{task.name}</strong> <em className="text-muted">({task.category})</em>
                  </span>
                )}
              </div>

              <div className="mt-2 d-flex justify-content-end gap-1">
                {editingTask?.id === task.id ? (
                  <>
                    <button className="btn btn-sm btn-success w-30" onClick={confirmEdit}>
                      Guardar
                    </button>
                    <button className="btn btn-sm btn-secondary w-30" onClick={() => setEditingTask(null)}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-sm btn-warning w-30" onClick={() => startEdit(task)}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-danger w-30" onClick={() => deleteTask(task.id)}>
                      Eliminar
                    </button>
                  </>
                )}
              </div>

              {task.completed === 1 && (
                <div className="text-success small mt-1">
                  ✅ Por <strong>{task.completedBy}</strong> el{' '}
                  {new Date(task.completedAt).toLocaleString()}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;
