import { env } from '@/env/index.js'
import { PrismaClient } from '@prisma/client'

// Criar uma instância do PrismaClient e exportá-la para ser usada em outras partes da aplicação
// Configura o log de consultas apenas em ambiente de desenvolvimento
export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
