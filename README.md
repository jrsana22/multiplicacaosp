# Sistema de Rastreamento de Cadastros e Vendas - Erivaldo

Sistema web para rastreamento de cadastros de novos consultores e suas vendas, com validação em tempo real para o líder de estado.

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+

### Instalação

```bash
# 1. Instalar dependências
npm install --legacy-peer-deps

# 2. Configurar banco de dados
# Edite .env.local com suas credenciais PostgreSQL
cp .env.example .env.local

# 3. Executar migrações
npx prisma migrate dev

# 4. Popular com dados de teste
npx prisma db seed

# 5. Iniciar dev server
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📝 Credenciais de Teste

Após rodar o seed, use:

**Líder de Estado:**
- Email: `lider@test.com`
- Senha: `senha123`

**Regional 1:**
- Email: `regional1@test.com`
- Senha: `senha123`

**Regional 2:**
- Email: `regional2@test.com`
- Senha: `senha123`

## 📋 Funcionalidades

### Painel Regional
- ✅ Formulário para cadastrar novo consultor
- ✅ Marcar se fez primeira venda (com data)
- ✅ Upload de comprovação (planejado)
- ✅ Visualizar seus próprios cadastros

### Painel Líder
- ✅ Ranking em tempo real (cadastros e vendas por regional)
- ✅ Aba de validação com todos os cadastros
- ✅ Marcar como validado/rejeitado (planejado)
- ✅ Filtros por regional e período (planejado)

## 🏗️ Arquitetura

```
erivaldo-campanha-system/
├── src/
│   ├── app/
│   │   ├── login/           # Página de login
│   │   ├── dashboard/       # Dashboard layout protegido
│   │   │   ├── regional/    # Painel de entrada regional
│   │   │   └── lider/       # Painel de visualização líder
│   │   ├── api/
│   │   │   ├── auth/        # Login, logout, me
│   │   │   ├── cadastros/   # CRUD de cadastros
│   │   │   └── validacoes/  # Validação de cadastros
│   │   └── layout.tsx
│   ├── lib/
│   │   ├── auth.ts          # JWT utilities
│   │   ├── db.ts            # Prisma client
│   │   └── validations.ts   # Zod schemas
│   └── components/
├── prisma/
│   └── schema.prisma        # Database schema
└── package.json
```

## 🗄️ Modelo de Dados

- **User**: Usuário (Regional ou Líder)
- **Cadastro**: Novo consultor cadastrado
- **Venda**: Primeira venda do consultor
- **Validacao**: Histórico de validações

## 🚢 Deploy em Vercel

```bash
# 1. Criar repositório GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. Conectar com Vercel
# vercel.com → New Project → Import GitHub repo

# 3. Configurar variáveis de ambiente
# - DATABASE_URL (Supabase PostgreSQL)
# - JWT_SECRET

# 4. Deploy automático ao fazer push em main
```

## 📝 TODO

- [ ] Upload de comprovações (Vercel Blob)
- [ ] Endpoint de validação funcional
- [ ] Filtros avançados no painel líder
- [ ] Exportar ranking em CSV
- [ ] Notificações por email
- [ ] Dashboard de estatísticas
- [ ] Testes automatizados

## 🤝 Contribuindo

Pull requests são bem-vindas!

## 📄 Licença

MIT
