-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'REGIONAL',
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "cadastros" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nomeConsultor" TEXT NOT NULL,
    "dataCadastro" DATETIME NOT NULL,
    "comprovacaoCadastro" TEXT,
    "regionalId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cadastros_regionalId_fkey" FOREIGN KEY ("regionalId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vendas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dataVenda" DATETIME NOT NULL,
    "comprovacaoVenda" TEXT,
    "cadastroId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "vendas_cadastroId_fkey" FOREIGN KEY ("cadastroId") REFERENCES "cadastros" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "validacoes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cadastroId" TEXT,
    "vendaId" TEXT,
    "validadorId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "comentario" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "validacoes_cadastroId_fkey" FOREIGN KEY ("cadastroId") REFERENCES "cadastros" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "validacoes_vendaId_fkey" FOREIGN KEY ("vendaId") REFERENCES "vendas" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "validacoes_validadorId_fkey" FOREIGN KEY ("validadorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vendas_cadastroId_key" ON "vendas"("cadastroId");
