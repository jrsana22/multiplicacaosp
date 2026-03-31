# Guia de Deploy

## Setup Inicial Local (Para Testes)

### 1. PostgreSQL Local com Docker

```bash
# Executar PostgreSQL em Docker
docker run --name erivaldo-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=erivaldo_campanha \
  -p 5432:5432 \
  -d postgres:15

# Verificar se está rodando
docker ps | grep erivaldo-postgres
```

### 2. Setup do App

```bash
# Instalar dependências
npm install --legacy-peer-deps

# Rodar migrations
npx prisma migrate dev

# Seed com dados de teste
npx prisma db seed

# Iniciar dev server
npm run dev
```

Acesse: http://localhost:3000

---

## Deploy em Produção (Vercel + Supabase)

### Passo 1: Criar banco Supabase

1. Ir em [supabase.com](https://supabase.com)
2. Create New Project
3. Nome: `erivaldo-campanha`
4. Region: Brazil (São Paulo) se possível
5. Copiar `DATABASE_URL` da aba "Settings > Database"

### Passo 2: Preparar repositório GitHub

```bash
cd erivaldo-campanha-system

# Inicializar git
git init
git add .
git commit -m "Initial commit: sistema de campanha"
git branch -M main

# Adicionar remote (substitua USER/REPO)
git remote add origin https://github.com/USER/erivaldo-campanha-system.git
git push -u origin main
```

### Passo 3: Deploy em Vercel

1. Ir em [vercel.com](https://vercel.com)
2. Import Project
3. Conectar GitHub e selecionar o repositório
4. Framework Preset: **Next.js**
5. Em "Environment Variables", adicionar:
   ```
   DATABASE_URL=postgresql://...  (copiar de Supabase)
   JWT_SECRET=seu-secret-super-seguro-com-32-chars-minimo
   NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
   ```
6. Deploy

### Passo 4: Rodar migrations em produção

Após deploy bem-sucedido:

```bash
# Via Vercel CLI
vercel env pull  # Baixa .env.production.local
npx prisma migrate deploy  # Roda migrations em produção

# Ou via Supabase Dashboard:
# Settings > SQL Editor > Execute queries do Prisma migrate
```

### Passo 5: Seed em produção (opcional)

```bash
# Se quiser adicionar usuários de teste em produção
npx prisma db seed --skip-generate
```

---

## Variáveis de Ambiente

### Desenvolvimento (.env.local)
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/erivaldo_campanha"
JWT_SECRET="dev-secret-change-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Produção (Vercel)
```
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres
JWT_SECRET=<generate-strong-random-32-char-string>
NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
```

**Gerar JWT_SECRET forte:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Verificar Deploy

1. Acessar a URL do Vercel
2. Fazer login com credenciais de teste (se seed rodou)
3. Testar:
   - ✅ Login/logout
   - ✅ Criar cadastro (como regional)
   - ✅ Ver ranking (como líder)
   - ✅ Validações

---

## Troubleshooting

### Erro: "could not translate host name to address"
- Verificar DATABASE_URL está correta
- Testar conexão: `npx prisma db push`

### Erro: "P1000: Authentication failed"
- Verificar credenciais PostgreSQL
- Checar se Supabase está acessível

### Erro: "JWT_SECRET is not defined"
- Adicionar em .env.local ou variáveis Vercel

### Banco vazio após deploy
- Rodar: `npx prisma migrate deploy` na CLI
- Ou executar seed: `npx prisma db seed`

---

## Backups

### Supabase
Automaticamente diário. Acessar em Supabase Dashboard > Backups

### Local
```bash
pg_dump erivaldo_campanha > backup.sql
```

---

## Monitoramento

### Logs Vercel
```
vercel logs --tail
```

### Logs Banco de Dados
Supabase Dashboard > Logs > Queries
