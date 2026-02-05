// Classe de erro personalizada para credenciais inválidas, estendendo a classe Error
export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials provided.')
  }
}
