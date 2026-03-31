# 🚀 Configuração para Deploy no Vercel

## Dados de Produção

```
DATABASE_URL = postgresql://postgres:Cissafelipesamuel2@@db.ubajyjbkicstcpfxujus.supabase.co:5432/postgres

JWT_SECRET = +LzPvQqkmdc2ndMcVvCkDHkqoMUvqvhaBr46CwEcPbY=

NEXT_PUBLIC_APP_URL = https://multiplicacaosp.solucoesdeia.com
```

## ✅ Checklist de Deploy

### 1. Conectar ao Vercel
- [ ] Acesse https://vercel.com/dashboard
- [ ] Clique em **"New Project"**
- [ ] Selecione repositório: `erivaldo-campanha-system`

### 2. Configurar Project Settings
- [ ] **Framework Preset:** Next.js
- [ ] **Root Directory:** `.` (raiz)
- [ ] **Build Command:** `npm run build`
- [ ] **Output Directory:** `.next`

### 3. Adicionar Environment Variables (IMPORTANTE!)
Cole estas variáveis exatamente como estão:

| Chave | Valor |
|-------|-------|
| `DATABASE_URL` | `postgresql://postgres:Cissafelipesamuel2@@db.ubajyjbkicstcpfxujus.supabase.co:5432/postgres` |
| `JWT_SECRET` | `+LzPvQqkmdc2ndMcVvCkDHkqoMUvqvhaBr46CwEcPbY=` |
| `NEXT_PUBLIC_APP_URL` | `https://multiplicacaosp.solucoesdeia.com` |

### 4. Deploy
- [ ] Clique **"Deploy"**
- [ ] Aguarde conclusão (~3-5 min)

### 5. Configurar Domínio Personalizado
No projeto Vercel → **Settings** → **Domains**:
- [ ] Clique **"Add Domain"**
- [ ] Digite: `multiplicacaosp.solucoesdeia.com`
- [ ] Cópia o CNAME gerado
- [ ] Vá ao registrador DNS de `solucoesdeia.com`
- [ ] Crie um CNAME:
  - **Nome:** `multiplicacaosp`
  - **Valor:** (conforme gerado pelo Vercel)
- [ ] Aguarde propagação DNS (até 24h)

### 6. Testar
Acesse: https://multiplicacaosp.solucoesdeia.com

**Login de teste:**
- Email: `lider@test.com`
- Senha: `senha123`

## ⚠️ Importante

- ✅ Dados do Supabase estão corretos
- ✅ JWT_SECRET é seguro e único
- ✅ Repositório GitHub está pronto
- ⏳ Vercel fará as migrations automaticamente
- 🔒 Nunca exponha o `.env.local` em commits

## Se der erro

### "Database connection refused"
- Verifica se `DATABASE_URL` está copiado corretamente
- Verifica se a senha tem caracteres especiais (@, !, etc)

### "DNS not found"
- Pode levar até 24h de propagação
- Use https://mxtoolbox.com/dnslookup.aspx para verificar

### "Build failed"
- Verifica os logs do Vercel
- Pode ser falta de environment variables
