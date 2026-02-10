// Importando a classe de erro personalizada para recurso não encontrado
export class ResourceNotFoundError extends Error {
  constructor() {
    super('Resource not found')
  }
}
