import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'

// Query Parameters: URL Stateful => Filtros, paginação, não-obrigatórios
  // http://localhost:3333/users?userId=1&name=Diego

// Route Parameters: Identificação de recurso
  // GET http://localhost:3333/users/1
  // DELETE http://localhost:3333/users/1
  // POST http://localhost:3333/users

// Request Body: Envio de informações de um formulário (HTTPs)
  // Edição e remoção

const server = http.createServer(async (req, res) => {
  // Desestruturação :
  //   é o mesmo que 
  //      - const method = req.method
  //      - const url = req.url
  //   já que estamos usando o nome da constante igual a propriedade da requisição, podemos escrever assim:
  const { method, url } = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333);
