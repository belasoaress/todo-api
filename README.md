# Todo API 📝

API REST de gerenciamento de tarefas desenvolvida com Node.js e Express.

[![CI](https://github.com/belasoaress/todo-api/actions/workflows/ci.yml/badge.svg)](https://github.com/belasoaress/todo-api/actions/workflows/ci.yml)

## Tecnologias

- Node.js
- Express
- Jest + Supertest (testes)
- ESLint (lint)
- GitHub Actions (CI/CD)

## Instalação

```bash
npm install
```

## Executar

```bash
# Produção
npm start

# Desenvolvimento (com hot reload)
npm run dev
```

## Testes

```bash
npm test
```

## Lint

```bash
npm run lint
```

## Endpoints

| Método | Rota       | Descrição            |
| ------ | ---------- | -------------------- |
| GET    | /          | Informações da API   |
| GET    | /tasks     | Listar tarefas       |
| GET    | /tasks/:id | Buscar tarefa por ID |
| POST   | /tasks     | Criar tarefa         |
| PUT    | /tasks/:id | Atualizar tarefa     |
| DELETE | /tasks/:id | Deletar tarefa       |

### Filtros disponíveis em GET /tasks

| Parâmetro  | Valores aceitos                         |
| ---------- | --------------------------------------- |
| `status`   | `pendente`, `em_progresso`, `concluida` |
| `priority` | `baixa`, `media`, `alta`                |

**Exemplo:** `GET /tasks?status=pendente&priority=alta`

## Exemplo de uso

### Criar uma tarefa

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Estudar GitHub Actions", "priority": "alta"}'
```

### Listar tarefas

```bash
curl http://localhost:3000/tasks
```

### Atualizar status

```bash
curl -X PUT http://localhost:3000/tasks/{id} \
  -H "Content-Type: application/json" \
  -d '{"status": "concluida"}'
```

## GitHub Actions

### CI (ci.yml)

Executado a cada push em qualquer branch:

1. **Lint** — Verifica o código com ESLint
2. **Testes** — Roda os testes com Jest e gera relatório de cobertura

### Release (release.yml)

Executado quando uma tag `v*.*.*` é criada:

1. Roda os testes
2. Gera automaticamente uma Release no GitHub com changelog

Para criar uma nova release:

```bash
git tag v1.0.0
git push origin v1.0.0
```

## Mensagens de commit recomendadas

| Prefixo  | Efeito no changelog      |
| -------- | ------------------------ |
| `feat:`  | ✨ Novas Funcionalidades |
| `fix:`   | 🐛 Correções de Bugs     |
| `docs:`  | 📖 Documentação          |
| `chore:` | 🔧 Manutenção            |
