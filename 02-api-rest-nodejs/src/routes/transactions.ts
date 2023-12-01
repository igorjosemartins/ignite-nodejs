import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

// Cookies : formas da gente manter contexto entre requisições
  
// Testes Automatizados
//   - Unitários: unidade da sua aplicação

//   - Integração: comunicação entre duas ou mais unidades

//   - E2E - ponta a ponta: simulam um usuário operando na nossa aplicação
//     -> front-end: abre a página de login, digita o texto email@example.com no campo email, clique no botão...
//     -> back-end: chamadas HTTP, WebSockets...

// Pirâmide de testes: E2E (não dependem de nenhuma tecnologia, não dependem de arquitetura)
//    -> poucos testes E2E
//    -> mais testes de integração
//    -> muitos testes unitários

export async function transactionsRoutes(app: FastifyInstance) {

  // ao invés de adicionar um preHandler em todas as rotas, podemos utilizar um hook global
    // app.addHook('preHandler', async (request, reply) => {
    //   console.log(`[${request.method}], ${request.url}`)
    // })

  // preHandler : funções que são executadas antes do Handler (função que lida com o funcionamento da rota)

  // rota de listagem das transações
  app.get('/', { preHandler: [checkSessionIdExists] }, async (request) => {

    const { sessionId } = request.cookies

    // filtragem das informações baseada no cookie do usuário
    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select()

    return { transactions }
  })

  // rota de listagem de uma transação única
  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request) => {

    // validação do id para uuid com zod
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    // filtrando id da requisição
    const { id } = getTransactionParamsSchema.parse(request.params)

    const { sessionId } = request.cookies

    // retorna a transação que contém o id recebido pela requisição
      // método first() serve para o retorno vir como um objeto e não como um array
    const transaction = await knex('transactions')
      .where({
        session_id: sessionId,
        id: id, 
      })
      .first()

    return { transaction }
  })

  // rota de resumo da conta
  app.get('/summary', { preHandler: [checkSessionIdExists] }, async (request) => {
    
    const { sessionId } = request.cookies

    // criando uma query para o banco de dados
      // método sum soma todos os registros de uma coluna específica
      // pode receber configurações como 2 parâmetro
    const summary = await knex('transactions')
      .where('session_id', sessionId)  
      .sum('amount', { as: 'amount' })
      .first()

    return { summary }
  })

  // rota de criação de transações
  app.post('/', async (request, reply) => {
    
    // validação de dados com zod
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })
  
    // filtrando dados da requisição
    const { title, amount, type } = createTransactionBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if(!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: ((((1000 * 60) * 60) * 24) * 7), // 7 days
      })
    }

    // inserção no banco de dados
    await knex('transactions').insert({
      id: randomUUID(),
      title: title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId
    })

    return reply.status(201).send()
  })
}