import { prisma } from '@/lib/prisma.js'
import 'dotenv/config'
import { execSync } from 'node:child_process'

import { randomUUID } from 'node:crypto'
import type { Environment } from 'vitest/environments'

// Pega o url no .env que cria a schema no docker
// e troca o schema no final do URl para a nossa que vamos usar
function generateDatabaseUrl(schema: string) {
  // caso não tenha um URL válida, retornamos um erro.
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL environment variable is not set. Please unset it before running the tests.',
    )
  }

  // Trazemos a url que está no nosso .env
  const url = new URL(process.env.DATABASE_URL!)

  // Definimos um novo valor na parte de schema do nosso url,
  // passando um novo valor pra ele
  url.searchParams.set('schema', schema)

  // Retorna a url em forma de string
  return url.toString()
}

export default <Environment>{
  // configuração da ciração do banco
  name: 'prisma',
  transformMode: 'ssr',
  // Vamos criar um novo banco.
  async setup() {
    const schema = randomUUID()
    const databaseUrl = generateDatabaseUrl(schema)

    process.env.DATABASE_URL = databaseUrl

    execSync('npx prisma db push')

    // Quando terminar o teste deletamos o banco
    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )

        await prisma.$disconnect()
      },
    }
  },
}
