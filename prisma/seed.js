const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Delete existing data
  await prisma.validacao.deleteMany();
  await prisma.venda.deleteMany();
  await prisma.cadastro.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Dados antigos deletados");

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: "jrsana@yahoo.com.br",
      password: await bcrypt.hash("senha123", 10),
      name: "Junior Sana - Admin",
      role: "DIRETOR_DE_EXPANSAO",
    },
  });

  const diretor = await prisma.user.create({
    data: {
      email: "empreendacomerivaldo@gmail.com",
      password: await bcrypt.hash("TrocueSenha2026!", 10),
      name: "Erivaldo Filho",
      role: "DIRETOR_DE_EXPANSAO",
    },
  });

  const regional1 = await prisma.user.create({
    data: {
      email: "regional1@test.com",
      password: await bcrypt.hash("senha123", 10),
      name: "Regional 1 - Salvador",
      role: "REGIONAL",
    },
  });

  const regional2 = await prisma.user.create({
    data: {
      email: "regional2@test.com",
      password: await bcrypt.hash("senha123", 10),
      name: "Regional 2 - Feira",
      role: "REGIONAL",
    },
  });

  console.log("✅ Usuários criados");
  console.log("\n👤 Usuários criados:");
  console.log(`Admin: ${admin.email}`);
  console.log(`Diretor: ${diretor.email}`);

  // Create cadastros for regional1
  const cadastro1 = await prisma.cadastro.create({
    data: {
      nomeConsultor: "João Silva",
      dataCadastro: new Date(2026, 2, 25),
      regionalId: regional1.id,
    },
  });

  const venda1 = await prisma.venda.create({
    data: {
      dataVenda: new Date(2026, 2, 28),
      cadastroId: cadastro1.id,
      status: "PENDENTE",
    },
  });

  const cadastro2 = await prisma.cadastro.create({
    data: {
      nomeConsultor: "Maria Santos",
      dataCadastro: new Date(2026, 2, 26),
      regionalId: regional1.id,
    },
  });

  const venda2 = await prisma.venda.create({
    data: {
      dataVenda: new Date(2026, 2, 29),
      cadastroId: cadastro2.id,
      status: "PENDENTE",
    },
  });

  const cadastro3 = await prisma.cadastro.create({
    data: {
      nomeConsultor: "Pedro Costa",
      dataCadastro: new Date(2026, 2, 27),
      regionalId: regional1.id,
    },
  });

  const venda3 = await prisma.venda.create({
    data: {
      dataVenda: new Date(2026, 2, 30),
      cadastroId: cadastro3.id,
      status: "PENDENTE",
    },
  });

  // Create cadastros for regional2
  const cadastro4 = await prisma.cadastro.create({
    data: {
      nomeConsultor: "Ana Oliveira",
      dataCadastro: new Date(2026, 2, 25),
      regionalId: regional2.id,
    },
  });

  const venda4 = await prisma.venda.create({
    data: {
      dataVenda: new Date(2026, 2, 28),
      cadastroId: cadastro4.id,
      status: "PENDENTE",
    },
  });

  const cadastro5 = await prisma.cadastro.create({
    data: {
      nomeConsultor: "Carlos Mendes",
      dataCadastro: new Date(2026, 2, 26),
      regionalId: regional2.id,
    },
  });

  console.log("✅ Cadastros criados");
  console.log("\n🎉 Seed completado!");
  console.log("\n📝 Credenciais:");
  console.log("Admin: jrsana@yahoo.com.br / senha123");
  console.log("Diretor de Expansão: empreendacomerivaldo@gmail.com / TrocueSenha2026!");
  console.log("Regional 1: regional1@test.com / senha123");
  console.log("Regional 2: regional2@test.com / senha123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
