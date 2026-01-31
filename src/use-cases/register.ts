import { prisma } from '@/lib/prisma.js'
import { hash } from 'bcryptjs'

// Definindo a interface para o request do caso de uso
interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: any) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    // Hashing da senha antes de salvar
    const password_hash = await hash(password, 6)

    // Verificando se o e-mail já está registrado
    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    // Se o e-mail já estiver registrado, lançar um erro
    if (userWithSameEmail) {
      throw new Error('E-mail already registered.')
    }

    // Criando o novo usuário no banco de dados
    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
