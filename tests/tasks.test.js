const request = require("supertest");
const app = require("../src/app");
const { resetTasks } = require("../src/controllers/tasksController");

beforeEach(() => {
  resetTasks();
});

// ─────────────────────────────────────────────
// GET /
// ─────────────────────────────────────────────
describe("GET /", () => {
  it("deve retornar informações da API", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("version");
  });
});

// ─────────────────────────────────────────────
// POST /tasks
// ─────────────────────────────────────────────
describe("POST /tasks", () => {
  it("deve criar uma tarefa com dados válidos", async () => {
    const res = await request(app).post("/tasks").send({
      title: "Estudar GitHub Actions",
      description: "Aprender CI/CD na prática",
      priority: "alta",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Estudar GitHub Actions");
    expect(res.body.status).toBe("pendente");
    expect(res.body.priority).toBe("alta");
  });

  it("deve criar tarefa com prioridade padrão 'media' se não informada", async () => {
    const res = await request(app).post("/tasks").send({
      title: "Tarefa sem prioridade",
    });

    expect(res.status).toBe(201);
    expect(res.body.priority).toBe("media");
  });

  it("deve retornar 400 se o título não for informado", async () => {
    const res = await request(app).post("/tasks").send({
      description: "Sem título",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("deve retornar 400 se o título for vazio", async () => {
    const res = await request(app).post("/tasks").send({ title: "   " });
    expect(res.status).toBe(400);
  });

  it("deve retornar 400 se a prioridade for inválida", async () => {
    const res = await request(app).post("/tasks").send({
      title: "Tarefa",
      priority: "urgente",
    });
    expect(res.status).toBe(400);
  });
});

// ─────────────────────────────────────────────
// GET /tasks
// ─────────────────────────────────────────────
describe("GET /tasks", () => {
  it("deve retornar lista vazia inicialmente", async () => {
    const res = await request(app).get("/tasks");
    expect(res.status).toBe(200);
    expect(res.body.tasks).toHaveLength(0);
    expect(res.body.total).toBe(0);
  });

  it("deve retornar todas as tarefas criadas", async () => {
    await request(app).post("/tasks").send({ title: "Tarefa 1" });
    await request(app).post("/tasks").send({ title: "Tarefa 2" });

    const res = await request(app).get("/tasks");
    expect(res.status).toBe(200);
    expect(res.body.tasks).toHaveLength(2);
    expect(res.body.total).toBe(2);
  });

  it("deve filtrar tarefas por status", async () => {
    await request(app).post("/tasks").send({ title: "Tarefa A" });
    const created = await request(app).post("/tasks").send({ title: "Tarefa B" });

    await request(app).put(`/tasks/${created.body.id}`).send({ status: "concluida" });

    const res = await request(app).get("/tasks?status=concluida");
    expect(res.status).toBe(200);
    expect(res.body.tasks).toHaveLength(1);
    expect(res.body.tasks[0].title).toBe("Tarefa B");
  });

  it("deve filtrar tarefas por prioridade", async () => {
    await request(app).post("/tasks").send({ title: "Baixa", priority: "baixa" });
    await request(app).post("/tasks").send({ title: "Alta", priority: "alta" });

    const res = await request(app).get("/tasks?priority=alta");
    expect(res.status).toBe(200);
    expect(res.body.tasks).toHaveLength(1);
    expect(res.body.tasks[0].title).toBe("Alta");
  });

  it("deve retornar 400 para status inválido", async () => {
    const res = await request(app).get("/tasks?status=invalido");
    expect(res.status).toBe(400);
  });
});

// ─────────────────────────────────────────────
// GET /tasks/:id
// ─────────────────────────────────────────────
describe("GET /tasks/:id", () => {
  it("deve retornar uma tarefa pelo ID", async () => {
    const created = await request(app).post("/tasks").send({ title: "Minha tarefa" });

    const res = await request(app).get(`/tasks/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Minha tarefa");
  });

  it("deve retornar 404 para ID inexistente", async () => {
    const res = await request(app).get("/tasks/id-que-nao-existe");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});

// ─────────────────────────────────────────────
// PUT /tasks/:id
// ─────────────────────────────────────────────
describe("PUT /tasks/:id", () => {
  it("deve atualizar o título de uma tarefa", async () => {
    const created = await request(app).post("/tasks").send({ title: "Título antigo" });

    const res = await request(app)
      .put(`/tasks/${created.body.id}`)
      .send({ title: "Título novo" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Título novo");
  });

  it("deve atualizar o status de uma tarefa", async () => {
    const created = await request(app).post("/tasks").send({ title: "Tarefa" });

    const res = await request(app)
      .put(`/tasks/${created.body.id}`)
      .send({ status: "em_progresso" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("em_progresso");
  });

  it("deve retornar 400 para status inválido", async () => {
    const created = await request(app).post("/tasks").send({ title: "Tarefa" });

    const res = await request(app)
      .put(`/tasks/${created.body.id}`)
      .send({ status: "fazendo" });

    expect(res.status).toBe(400);
  });

  it("deve retornar 404 ao atualizar ID inexistente", async () => {
    const res = await request(app).put("/tasks/id-falso").send({ title: "X" });
    expect(res.status).toBe(404);
  });
});

// ─────────────────────────────────────────────
// DELETE /tasks/:id
// ─────────────────────────────────────────────
describe("DELETE /tasks/:id", () => {
  it("deve deletar uma tarefa existente", async () => {
    const created = await request(app).post("/tasks").send({ title: "Deletar isso" });

    const res = await request(app).delete(`/tasks/${created.body.id}`);
    expect(res.status).toBe(204);

    const check = await request(app).get(`/tasks/${created.body.id}`);
    expect(check.status).toBe(404);
  });

  it("deve retornar 404 ao deletar ID inexistente", async () => {
    const res = await request(app).delete("/tasks/id-falso");
    expect(res.status).toBe(404);
  });
});
