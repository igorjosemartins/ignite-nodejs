// conceito de Streams:
//   -> ler arquivos aos poucos
//   -> processando o arquivo enquanto esta sendo carregado
//   -> não é preciso esperar todo o upload para poder manipular os dados

// importando as classes Streams
import { Readable, Writable, Transform } from 'node:stream'

// criando uma stream de leitura
// contador => a cada 1s ele conta de 1 até 100
class OneToHundredStream extends Readable {
  index = 1

  // metodo obrigatorio
  _read() {
    const i = this.index++

    setTimeout(() => {
      if (i > 100) {
        this.push(null)
      
      } else {
        // streams não podem receber dados primitivos
        // logo vamos transformar o dado para 'Buffer'
        // o conversor para Buffer só aceita dados do tipo 'String'
        const buf = Buffer.from(String(i))
        this.push(buf)
      }
    }, 1000);
  }
}

// criando uma stream de transformação
// transforma os números em negativos
class InverseNumberStream extends Transform {

  // metodo obrigatorio
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1

    // callback da stream de transformação recebe 2 parâmetros:
    //    -> erro (caso haja)
    //    -> conversão (dado transformado)
    callback(null, Buffer.from(String(transformed)))
  }
}

// criando uma stream de escrita
// escreve os números multiplicados por 10
class MultiplyByTenStream extends Writable {
  // streams de escrita não retornam nada, apenas processam o dado

  // metodo obrigatorio
  _write(chunk, encoding, callback) {
    // chunk = pedaço que lemos da stream de leitura
    // encoding = como a informação está codificada
    // callback = função de escrita dps que a stream terminou de ler
    console.log(Number(chunk.toString()) * 10)
    callback()
  }
}

new OneToHundredStream()
  .pipe(new InverseNumberStream())
  .pipe(new MultiplyByTenStream())
