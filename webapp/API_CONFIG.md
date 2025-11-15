# Configuração de API - KnowHall Frontend

## Arquivos de Configuração

### 📁 `src/config/api.config.ts`
**Arquivo central** de configuração da API. Todos os outros arquivos importam daqui.

- `API_CONFIG.BASE_URL`: URL base da API (ex: `http://localhost:8080` ou `https://api.knowhall.com`)
- `API_CONFIG.API_PREFIX`: Prefixo `/api` 
- `API_CONFIG.ENDPOINTS`: Todos os endpoints da aplicação
- `buildApiUrl()`: Função helper para construir URLs completas
- `getApiBaseUrl()`: Retorna a URL base completa

### 📁 Arquivos que usam a configuração centralizada:

1. **`src/api/api.ts`** - Cliente Axios principal
2. **`src/api/http.ts`** - Cliente HTTP com interceptors
3. **`src/services/editar.perfil.service.ts`** - Serviço de edição de perfil
4. **Todos os outros services** - Usam `apiService` que já está configurado

## Variáveis de Ambiente

### Desenvolvimento Local
Crie um arquivo `.env` na pasta `webapp/`:

```env
VITE_API_URL=http://localhost:8080
```

### Produção (Vercel)
No painel do Vercel, adicione:

**Name**: `VITE_API_URL`  
**Value**: `https://sua-api-producao.com`  
**Environment**: Production

### Staging
```env
VITE_API_URL=https://api-know-hall-staging.onrender.com
```

## Como Funciona

### Desenvolvimento (`npm run dev`)
- Usa proxy do Vite: `/api` → `http://localhost:8080`
- Definido em `vite.config.ts`

### Produção (`npm run build`)
- Usa `VITE_API_URL` das variáveis de ambiente
- Fallback: `http://localhost:8080` (apenas para desenvolvimento)

## Fluxo de Requisição

```
Componente
    ↓
Service (ex: perfil.service.ts)
    ↓
apiService (src/services/apiService.ts)
    ↓
http client (src/api/http.ts)
    ↓
API_CONFIG (src/config/api.config.ts)
    ↓
API Backend
```

## Alterando a URL da API

**✅ Correto**: Alterar apenas as variáveis de ambiente
```env
VITE_API_URL=https://nova-url.com
```

**❌ Errado**: Alterar URLs hardcoded nos arquivos
