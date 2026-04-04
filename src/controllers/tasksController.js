const { v4: uuidv4 } = require("uuid");

let tasks = [];

const getAllTasks = (req, res) => {
  const { status, priority } = req.query;
  let result = [...tasks];

  if (status) {
    const validStatuses = ["pendente", "em_progresso", "concluida"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Status inválido. Use: ${validStatuses.join(", ")}`,
      });
    }
    result = result.filter((t) => t.status === status);
  }

  if (priority) {
    const validPriorities = ["baixa", "media", "alta"];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        error: `Prioridade inválida. Use: ${validPriorities.join(", ")}`,
      });
    }
    result = result.filter((t) => t.priority === priority);
  }

  res.json({ total: result.length, tasks: result });
};

const getTaskById = (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({ error: "Tarefa não encontrada" });
  }

  res.json(task);
};

const createTask = (req, res) => {
  const { title, description, priority } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "O campo 'title' é obrigatório" });
  }

  const validPriorities = ["baixa", "media", "alta"];
  const taskPriority = priority || "media";

  if (!validPriorities.includes(taskPriority)) {
    return res.status(400).json({
      error: `Prioridade inválida. Use: ${validPriorities.join(", ")}`,
    });
  }

  const newTask = {
    id: uuidv4(),
    title: title.trim(),
    description: description ? description.trim() : "",
    status: "pendente",
    priority: taskPriority,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
};

const updateTask = (req, res) => {
  const taskIndex = tasks.findIndex((t) => t.id === req.params.id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Tarefa não encontrada" });
  }

  const { title, description, status, priority } = req.body;
  const validStatuses = ["pendente", "em_progresso", "concluida"];
  const validPriorities = ["baixa", "media", "alta"];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Status inválido. Use: ${validStatuses.join(", ")}`,
    });
  }

  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({
      error: `Prioridade inválida. Use: ${validPriorities.join(", ")}`,
    });
  }

  if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
    return res.status(400).json({ error: "O campo 'title' não pode ser vazio" });
  }

  const updatedTask = {
    ...tasks[taskIndex],
    ...(title !== undefined && { title: title.trim() }),
    ...(description !== undefined && { description: description.trim() }),
    ...(status && { status }),
    ...(priority && { priority }),
    updatedAt: new Date().toISOString(),
  };

  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
};

const deleteTask = (req, res) => {
  const taskIndex = tasks.findIndex((t) => t.id === req.params.id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Tarefa não encontrada" });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
};

const resetTasks = () => {
  tasks = [];
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  resetTasks,
};
