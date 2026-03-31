# 🚀 Quick Start - Erivaldo Campanha System

## 1️⃣ Pré-requisitos
- Node.js 18+
- PostgreSQL (ou Docker com `docker run -d -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=erivaldo_campanha -p 5432:5432 postgres:15`)

## 2️⃣ Setup Rápido (5 minutos)

```bash
# Instalar dependências
npm install --legacy-peer-deps

# Criar banco + tabelas
npx prisma migrate dev

# Adicionar dados de teste
npx prisma db seed

# Iniciar servidor
npm run dev
```

**Abra:** http://localhost:3000

## 3️⃣ Testar Sistema

### Login (Regional)
- Email: `regional1@test.com`
- Senha: `senha123`
- ✅ Preencher formulário de cadastro
- ✅ Listar cadastros criados

### Login (Líder)
- Email: `lider@test.com`
- Senha: `senha123`
- ✅ Ver ranking de regionais
- ✅ Visualizar cadastros pendentes

## 4️⃣ Estrutura de Arquivos

```
📦 erivaldo-campanha-system/
├── 📁 src/app/
│   ├── login/              ← Página de login
│   ├── dashboard/          ← Dashboard layout
│   │   ├── regional/       ← Painel de entrada
│   │   └── lider/          ← Ranking + validação
│   └── api/
│       ├── auth/           ← Login, logout, me
│       ├── cadastros/      ← CRUD cadastros
│       └── validacoes/     ← Validar registros
├── 📁 prisma/
│   ├── schema.prisma       ← Modelo do banco
│   └── seed.ts             ← Dados de teste
└── 📄 README.md            ← Documentação completa
```

## 5️⃣ Próximas Fases

- [ ] **Phase 2:** Upload de comprovações (Vercel Blob)
- [ ] **Phase 3:** Validação com approval/rejection funcional
- [ ] **Phase 4:** Integração com Evolution API para notificações
- [ ] **Phase 5:** Deploy em Vercel + Supabase

## 🔧 Variáveis de Ambiente

Arquivo `.env.local` está pronto para desenvolvimento local com PostgreSQL.

Para Supabase (produção), ver: **SETUP_SUPABASE.md**

## 📞 Suporte

Ver: **DEPLOYMENT.md** para troubleshooting e deploy

---

**Status:** ✅ MVP Funcional - Pronto para apresentação quarta (02/04)
