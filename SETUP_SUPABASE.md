# Setup com Supabase (PostgreSQL)

Seu projeto está configurado para usar **Supabase** como banco de dados PostgreSQL.

## 1️⃣ Criar Projeto Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login com GitHub (use sua conta de usual)
3. Clique em "New Project"
4. Preencha:
   - **Name**: `erivaldo-campanha`
   - **Database Password**: Defina uma senha forte
   - **Region**: `South America (São Paulo)` se disponível
5. Aguarde ~5 minutos o projeto ser criado

## 2️⃣ Copiar Credenciais

Após criar o projeto:

1. Vá em **Settings > Database**
2. Procure por **Connection String** (ou **URI**)
3. Copie a string que começa com `postgresql://`
4. Cole em `.env.local`:

```bash
DATABASE_URL="postgresql://postgres.xxxxx:password@aws-x-xxxxx.supabase.co:5432/postgres"
```

Ou use o **Connection Pooler** para melhor performance:

```bash
DATABASE_URL="postgresql://postgres.xxxxx:password@aws-x-xxxxx-pooler.supabase.co:5432/postgres"
```

## 3️⃣ Configurar Projeto

```bash
# 1. Instalar dependências
npm install --legacy-peer-deps

# 2. Atualizar .env.local com DATABASE_URL do Supabase
# (Não altere as outras variáveis)

# 3. Executar migrations
npx prisma migrate dev

# 4. Seed com dados de teste
npx prisma db seed

# 5. Iniciar dev server
npm run dev
```

## 4️⃣ Verificar Banco em Supabase

1. Supabase Dashboard > SQL Editor
2. Executar query para ver dados:

```sql
SELECT COUNT(*) as total_cadastros FROM cadastros;
SELECT * FROM users;
```

## 5️⃣ Deploy em Vercel

Agora o banco está pronto! Para deploy:

1. Push para GitHub:
```bash
git remote add origin https://github.com/seu-user/erivaldo-campanha.git
git push -u origin main
```

2. Conectar com Vercel:
   - vercel.com > Import
   - Selecionar repo
   - Em "Environment Variables", adicionar:
     - `DATABASE_URL`: (de Supabase Connection Pooler)
     - `JWT_SECRET`: (gerar novo com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - Deploy!

## 📝 Nota Importante

- **Connection Pooler** é melhor para Vercel (serverless)
- **Direct Connection** é melhor para desenvolvimento local
- Se der erro "too many connections", use Connection Pooler

## 🆘 Troubleshooting

### Erro: "could not translate host name"
- Verificar DATABASE_URL está completo
- Checar se `.env.local` tem quebras de linha extras

### Erro: "P1000: Authentication failed"
- Supabase dashboard > Database > Users > Resetar password
- Regenerar connection string

### Banco vazio após primeira execução
```bash
npx prisma migrate deploy
npx prisma db seed
```

Pronto! Seu projeto está 100% funcional com Supabase 🎉
