import http from 'node:http'
// função randomUUID = Unique Universal ID 
import { randomUUID } from "node:crypto"
import { json } from './middlewares/json.js'
import { Database } from './database.js'

const database = new Database()

const server = http.createServer(async (req, res) => {
  // Desestruturação :
  //   é o mesmo que 
  //      - const method = req.method
  //      - const url = req.url
  //   já que estamos usando o nome da constante igual a propriedade da requisição, podemos escrever assim:
  const { method, url } = req

  await json(req, res)

  if (method === 'GET' && url === '/users') {
    const users = database.select('users')

    return res.end(JSON.stringify(users))
  }

  if (method === 'POST' && url === '/users') {
    const { name, email } = req.body
    
    const user = {
      "id": randomUUID(),
      "name": name,
      "email": email
    }

    database.insert('users', user)

    return res.writeHead(201).end()
  }

  return res.writeHead(404).end()
})

server.listen(3333);
