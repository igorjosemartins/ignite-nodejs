import http from 'node:http'
import { Transform } from 'node:stream'

class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1

    console.log(transformed)

    callback(null, Buffer.from(String(transformed)))
  }
}

// em node, tudo são streams, logo a req e a res também são
// portanto podemos utilizar o método pipe() para enviar informações uma para as outras
const server = http.createServer(async (req, res) => {
  
  // nos casos em que queremos ler todos os dados antes de processá-los, podemos fazer o seguinte:
  // criamos um array que irá receber os dados 
  const buffers = []

  // usamos await de promises (async/await) => aguarda cada pedaço da stream ser retornado
  // para usarmos o await em uma função, precisamos que a função superior a ela tenha um async
  for await (const chunk of req) {
    buffers.push(chunk)
  }

  const fullStreamContent = Buffer.concat(buffers.toString())

  console.log(fullStreamContent)

  return res.end(fullStreamContent)

  return req
    .pipe(new InverseNumberStream())
    .pipe(res)
})

server.listen(3334)
