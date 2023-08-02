import { config } from 'dotenv'
import { z } from 'zod'

// caso seja um ambiente de teste:
if (process.env.NODE_ENV === 'test') {
    // utilizamos as variáveis de ambiente de teste (.env.test)
    config({ path: '.env.test' })

} else {
    // senão, utilizamos as variáveis de ambiente padrão do sistema (.env)
    config()
}

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
    DATABASE_URL: z.string(),
    PORT: z.number().default(3333)
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
    console.error('⚠ Invalid environment variable!', _env.error.format())

    throw new Error('Invalid environment variables.')
}

// exportação das variáveis de ambiente
export const env = _env.data
