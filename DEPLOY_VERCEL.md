# Deploy no Vercel - Projeto Multiplicação SP

## 🚀 Checklist de Deploy

### 1. Criar banco de dados no Supabase

- [ ] Acesse https://supabase.com/dashboard
- [ ] Crie novo projeto
- [ ] Copie a `DATABASE_URL` (postgres://...)
- [ ] Copie ou gere um `JWT_SECRET` seguro (32+ caracteres)

### 2. Git - Push das mudanças

```bash
cd /Users/jrsana/erivaldo-campanha-system
git add .env.example
git commit -m "Update env example for production deployment"
git push origin main
```

### 3. Deploy no Vercel

- Acesse https://vercel.com/dashboard
- Clique **"New Project"**
- Selecione repositório: `erivaldo-campanha-system`
- Configure:
  - **Framework Preset:** Next.js
  - **Root Directory:** `.`
  - **Build Command:** `npm run build`
  - **Output Directory:** `.next`

### 4. Variáveis de Ambiente (no Vercel)

Adicione no projeto Vercel:

```
DATABASE_URL=postgresql://... (do Supabase)
JWT_SECRET=sua-chave-super-segura-com-32-caracteres
NEXT_PUBLIC_APP_URL=https://multiplicacaosp.solucoesdeia.com
```

### 5. Deploy

- Clique **"Deploy"**
- Aguarde conclusão (~5 min)

### 6. Configurar Domínio

No projeto Vercel → **Settings** → **Domains**:

- [ ] Adicione domínio: `multiplicacaosp.solucoesdeia.com`
- [ ] Vercel vai gerar um CNAME ou registros
- [ ] Vá ao seu registrador DNS de `solucoesdeia.com`
- [ ] Configure o CNAME conforme indicado pelo Vercel
- [ ] Aguarde propagação DNS (até 24h)

### 7. Testar

```
https://multiplicacaosp.solucoesdeia.com
- Login com: lider@test.com / senha123
```

## ⚠️ Importante

- `DATABASE_URL` deve usar PostgreSQL do Supabase (não SQLite)
- `JWT_SECRET` deve ser único e seguro em produção
- Nunca commite `.env.local` (já está em `.gitignore`)

## Troubleshooting

**Erro: "Database connection failed"**
- Verifica se `DATABASE_URL` está correto no Vercel
- Verifica IP whitelist do Supabase (deve incluir Vercel IPs)

**Erro: "DNS não aponta para Vercel"**
- Aguarda propagação (pode levar até 24h)
- Usa https://mxtoolbox.com/dnslookup.aspx para verificar

**App carrega mas sem dados**
- Rode migrations: `npx prisma migrate deploy`
- Rode seed: `npx prisma db seed`
