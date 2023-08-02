// npx vitest = roda os testes
import { it, test, expect, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
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

    // o ideal para testes é para cada teste, o banco ser novo
    beforeEach(() => {
        // execSync() => função para executar comandos no terminal via uma aplicação
        
        // apagamos o banco
        execSync('npm run knex migrate:rollback --all')
        // criamos o banco
        execSync('npm run knex migrate:latest')
    })

    // função test() | it() => it('should be able to create a new transaction'):
    //    -> descrição da operação
    //    -> nossa funcionalidade
    //    -> o que esperamos que aconteça = expect()
    // onde podemos utilizar os métodos:
    //   -> .skip => para pular aquele teste
    //   -> .todo => para lembrar que aquele teste deve ser feito mais tarde
    //   -> .only => para rodar apenas aquele teste

    // criar uma transação
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

    // listar todas as transações
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

    // listar uma transação por id
    it('should be able to get a specific transaction', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New Transaction',
                amount: 5000,
                type: 'credit'
            })
    
        const cookies = createTransactionResponse.get('Set-Cookie')

        const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)
        
        const transactionId = listTransactionsResponse.body.transactions[0].id

        const getTransactionResponse = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies)
            .expect(200)

        expect(getTransactionResponse.body.transaction).toEqual(
            expect.objectContaining({
                title: 'New Transaction',
                amount: 5000,
            }),
        )
    })

    // resumo da conta
    it('should be able to get the summary', async () => {
        
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'Credit Transaction',
                amount: 5000,
                type: 'credit'
            })
        
        const cookies = createTransactionResponse.get('Set-Cookie')

        await request(app.server)
            .post('/transactions')
            .set('Cookie', cookies)
            .send({
                title: 'Debit Transaction',
                amount: 2000,
                type: 'debit'
            })

        const summaryResponse = await request(app.server)
            .get('/transactions/summary')
            .set('Cookie', cookies)
            .expect(200)
        
        expect(summaryResponse.body.summary).toEqual({
            amount: 3000
        })
    })
})
