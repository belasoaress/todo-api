const express = require("express");
const tasksRouter = require("./routes/tasks");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Todo API funcionando!",
    version: "1.0.0",
    endpoints: {
      "GET    /tasks": "Listar todas as tarefas",
      "GET    /tasks/:id": "Buscar tarefa por ID",
      "POST   /tasks": "Criar nova tarefa",
      "PUT    /tasks/:id": "Atualizar tarefa",
      "DELETE /tasks/:id": "Deletar tarefa",
    },
  });
});

app.use("/tasks", tasksRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno no servidor" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;
