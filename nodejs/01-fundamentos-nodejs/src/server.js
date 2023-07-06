import http from 'node:http'

const users = []

const server = http.createServer((req, res) => {
  // Desestruturação :
  //   é o mesmo que 
  //      - const method = req.method
  //      - const url = req.url
  //   já que estamos usando o nome da constante igual a propriedade da requisição, podemos escrever assim:
  const { method, url } = req

  if (method === 'GET' && url === '/users') {
    return res
      .setHeader('Content-Type', 'application/json')
      .end(JSON.stringify(users))
  }

  if (method === 'POST' && url === '/users') {
    
    users.push({
      "id": 1,
      "name": "Igor",
      "email": "igor.martins@ibridge.com.br"
    })

    return res.writeHead(201).end()
  }

  return res.writeHead(404).end()
})

server.listen(3333);
