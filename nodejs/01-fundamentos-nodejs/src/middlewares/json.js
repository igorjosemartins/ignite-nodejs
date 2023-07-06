// Middlewares são funções que interceptam e manipulam a requisição e a resposta de uma rota
// aqui transformamos o corpo da requisição em um objeto, para que possamos manipula-lo
// setamos sempre o header de resposta como json

export async function json(req, res) {

  const buffers = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    req.body = null
  }

  res.setHeader("Content-Type", "application/json")
}