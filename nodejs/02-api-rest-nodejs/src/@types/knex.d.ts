// definição de tipos
import { StringAsNumber } from 'fastify/types/utils'
import { Knex } from 'knex'

declare module 'knex/types/tables' {
    export interface Tables {
        transactions: {
            id: string
            title: string
            amount: number
            created_at: string
            session_id?: string
        }
    }
}