# 🌐 WebApp Knowhall (Frontend)

![React](https://img.shields.io/badge/React-18-blue?logo=react)  
![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)  
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)  
![License](https://img.shields.io/badge/license-MIT-green)

Aplicação frontend desenvolvida em **React + Vite + TypeScript**, otimizada para alta performance e fácil manutenção.

---

## 📦 Pré-requisitos

- [Node.js 18+](https://nodejs.org/) ou [Node 22 (recomendado)](https://nodejs.org/)  
- [Yarn](https://yarnpkg.com/) ou [npm](https://www.npmjs.com/)

---

## 🚀 Instalação

Clone o repositório:

```bash
git clone https://github.com/seu-repositorio/frontend-knowhall.git
cd frontend-knowhall/webapp
```

Instale as dependências:

```bash
yarn install
```

---

## 🛠 Scripts disponíveis

### `yarn dev`
Inicia o servidor de desenvolvimento com hot reload.  
Acesse em: [http://localhost:5173](http://localhost:5173)

### `yarn build`
Gera a versão de produção otimizada na pasta `dist/`.

### `yarn preview`
Roda localmente o build gerado (simula produção).  
Acesse em: [http://localhost:4173](http://localhost:4173)

---

## ⚙️ Variáveis de Ambiente

As variáveis devem **sempre** começar com o prefixo `VITE_`.  
Exemplo de `.env`:

```env
VITE_API_URL=https://api.seuservidor.com
```

Uso no código:

```ts
const apiUrl = import.meta.env.VITE_API_URL
```

---

## 🐳 Rodando com Docker

### Build de produção
```bash
docker build -t webapp-knowhall .
docker run -p 3000:80 --name webapp webapp-knowhall
```
Acesse em: [http://localhost:3000](http://localhost:3000)

### Dev com hot reload
```bash
docker compose -f docker-compose.dev.yml up
```
Acesse em: [http://localhost:5173](http://localhost:5173)

---

## 📚 Documentações úteis
- [Documentação do Vite](https://vitejs.dev/guide/)  
- [Documentação do React](https://react.dev/)  
- [Documentação do TypeScript](https://www.typescriptlang.org/docs/)  

---

## 📄 Licença
Este projeto está sob a licença [MIT](LICENSE).
