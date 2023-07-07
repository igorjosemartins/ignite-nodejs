//  para trabalhar com arquivos físicos, usamos o módulo FileSystem do Node
import fs from 'node:fs/promises'

// vamos criar o caminho do database baseado neste arquivo, e não no local que estamos inicializando o servidor
// import.meta.url = caminho completo até este arquivo
// classe URL = retorna vários atributos do caminho do arquivo
//    ao colocar '../' no parâmetro pathname, estamos voltando um diretório, que no caso é a pasta root, onde sempre deve ser criado o database
const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  
  // # = private
  #database = {}

  // método para o database persistir mesmo com a reinicialização do servidor
  constructor() {
    // ler o database salvo
    fs.readFile(databasePath, "utf8")
      // escrever o conteúdo do database novamente
      .then((data) => {
        this.#database = JSON.parse(data)
      })
      // caso o arquivo do database não exista, ele cria um vazio
      .catch(() => {
        this.#persist()
      })
  }

  // método para persistir os dados do BD
  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table) {
    const data = this.#database[table] ?? []

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist();

    return data;
  }
}
