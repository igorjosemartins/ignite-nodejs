import http from 'node:http'
import { json } from './middlewares/json'

const users = []

const server = http.createServer(async (req, res) => {
  // Desestruturação :
  //   é o mesmo que 
  //      - const method = req.method
  //      - const url = req.url
  //   já que estamos usando o nome da constante igual a propriedade da requisição, podemos escrever assim:
  const { method, url } = req

  json(req, res)

  if (method === 'GET' && url === '/users') {
    return res
      .end(JSON.stringify(users))
  }

  if (method === 'POST' && url === '/users') {
    const { name, email } = req.body
    
    users.push({
      "id": 1,
      "name": name,
      "email": email
    })

    return res.writeHead(201).end()
  }

  return res.writeHead(404).end()
})

server.listen(3333);
