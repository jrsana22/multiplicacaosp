import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ["error"],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;
