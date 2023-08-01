// npx vitest = roda os testes
import { it, test, expect, beforeAll, afterAll, describe } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

// categorizando os testes
describe('Transactions routes', () => {

    // por todos os plugins do fastify serem assíncronos (promises),
    // temos que esperar o servidor rodar antes de realizarmos os testes
    beforeAll(async () => {
        await app.ready()
    })

    // e após todos os testes fechamos o servidor
    afterAll(async () => {
        await app.close()
    })

    // função test() | it() => it('should be able to create a new transaction'):
    //    -> descrição da operação
    //    -> nossa funcionalidade
    //    -> o que esperamos que aconteça = expect()
    // onde podemos utilizar os métodos:
    //   -> skip() => para pular aquele teste
    //   -> todo() => para lembrar que aquele teste deve ser feito mais tarde
    //   -> only() => para rodar apenas aquele teste
    it('should be able to create a new transaction', async () => {

        await request(app.server)
            .post('/transactions')
            .send({
                title: 'New Transaction',
                amount: 5000,
                type: 'credit'
            })
            .expect(201)
    })

    it('should be able to list all transactions', async () => {
        
        // para listarmos as transações, é preciso que haja alguma, por isso vamos criar 
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New Transaction',
                amount: 5000,
                type: 'credit'
            })
        
        // para listarmos precisamos dos cookies
        const cookies = createTransactionResponse.get('Set-Cookie')

        // fazemos a requisição setando os cookies
        const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)
        
        // aqui esperamos que o objeto transactions contenha:
        expect(listTransactionsResponse.body.transactions).toEqual([
            // esperamos um objeto que contenha as propriedades title e amount
            expect.objectContaining({
                title: 'New Transaction',
                amount: 5000,
            }),
        ])
    })
})


