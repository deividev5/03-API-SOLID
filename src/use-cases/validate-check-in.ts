import { CheckInsRepository } from '@/repositories/check-ins-repository.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'
import { CheckIn } from '@prisma/client'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error.js'

// Definindo as interfaces para o request e response do caso de uso de validação de check-in
interface ValidateCheckInCaseRequest {
  id: string
}

interface ValidateCheckInCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInCase {
  // Injetando o repositório de check-ins no construtor para permitir a validação dos check-ins
  constructor(private checkInsRepository: CheckInsRepository) {}

  // Método para executar a validação do check-in, recebendo o ID do check-in a ser validado
  async execute({
    id,

    // Desestruturando os dados do request
  }: ValidateCheckInCaseRequest): Promise<ValidateCheckInCaseResponse> {
    // Buscando o check-in pelo ID fornecido
    const checkIn = await this.checkInsRepository.findById(id)

    // Se o check-in não for encontrado, lança um erro do tipo ResourceNotFoundError
    if (!checkIn) {
      throw new ResourceNotFoundError()
    }
    // Calculando a diferença em minutos entre a data atual e a data de criação do check-in para verificar se a validação está sendo feita dentro do prazo permitido
    const distanceInMinutesFromCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    // Se a diferença em minutos for maior que 20, lança um erro do tipo LateCheckInValidationError, indicando que a validação do check-in está sendo feita fora do prazo permitido
    if (distanceInMinutesFromCreation > 20) {
      throw new LateCheckInValidationError()
    }

    // Validando o check-in, ou seja, preenchendo a propriedade validated_at com a data atual
    checkIn.validated_at = new Date()

    //  Salvando o check-in validado no repositório para persistir a alteração
    await this.checkInsRepository.save(checkIn)

    // Retornando o check-in validado como resposta do caso de uso
    return {
      checkIn,
    }
  }
}
