import dataCenter from "./data-center";

function contarCaracteres(texto: string, alvo: string): number {
  let contador = 0;
  let indice = texto.indexOf(alvo);

  while (indice !== -1) {
    contador++;
    indice = texto.indexOf(alvo, indice + 1);
  }

  return contador;
}

function calc(valor1:string, valor2:string, valor3:string) {
    const valores = [valor1, valor2, valor3];
    const operadores = ["+", "-", "*", "/"];
  
    const operadorIndex = valores.findIndex((value) => operadores.includes(value));
  
    if (operadorIndex === -1) {
      return "Operador não encontrado. Insira um operador válido.";
    }
  
    const operador = valores[operadorIndex];
    valores.splice(operadorIndex,1);
    const num1 = parseFloat(valores[0]);
    const num2 = parseFloat(valores[1]);
  
    if (isNaN(num1) || isNaN(num2)) {
      return "Valores inválidos. Insira números válidos.";
    }
  
  
    switch (operador) {
      case "+":
        return {
          result: num1 + num2,
          exp: `${num1} + ${num2}`
        };
      case "-":
        return {
          result: num1 - num2,
          exp: `${num1} - ${num2}`
        };
      case "*" || "x" || ".":
        return {
          result: num1 * num2,
          exp: `${num1} * ${num2}`
        };
      case "/":
        return {
          result: num1 / num2,
          exp: `${num1} / ${num2}`
        };
      default:
        return "Operador inválido. Use +, -, * ou /.";
    }
}
  

function open(file: string): string {
    console.log("Opened: " + file);
    return "Abrindo...";
}

function verifCmd(text:string,cmd:string[]):string[]{
  const array = text.split(" ");
  if(cmd.includes(array[0])){
    array.splice(0,1);
    return verifCmd(array.join(" "),cmd);
  }
  return array;
}

export function command(index:number,text:string): string {
    const commandData = dataCenter.data[index]
    if (commandData) {
      const commandTemplate = commandData.value[0].replace("!","");
      const commandValues = contarCaracteres(commandTemplate,"$value");
      const commandArguments = verifCmd(text.toLocaleLowerCase(),commandData.key);
      if(commandArguments.length < commandValues) return `Você forneceu poucos valores`;
      let commandResult = commandTemplate;
      commandArguments.forEach((arg, index) => {
        const argumentPlaceholder = `$value${index + 1}`;
        commandResult = commandResult.replace(argumentPlaceholder, `'${arg}'`);
      });
  
      try {
        const evalResult = eval(commandResult);
        return evalResult.toString();
      } catch (error:any) {
        return `Erro ao executar o comando: ${error.message}`;
      }
    } else {
      return `Comando não reconhecido: ${text}`;
    }
}