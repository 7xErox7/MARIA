import { existsSync, readFileSync, writeFileSync } from 'fs';
import moment from 'moment-timezone';
import { command } from './Commands';
import { DataItem } from './types';
import { app } from 'electron';
import path from 'path';

const dataFile = path.join(app.getPath("appData")+"/Maria/data-center.json");
const dados = [
  { "key": ["qual", "seu", "nome", "?"], "value": ["$nome"] },
  { "key": ["qual", "seu", "apelido", "?"], "value": ["$apelido"] },
  {
    "key": ["como", "você", "se", "chama", "?"],
    "value": [
      "Meu nome é $apelido($nome)",
      "Me chamo $apelido",
      "Fui nomeada de $nome, mas pode me chamar de $apelido"
    ]
  },
  { "key": ["qual", "a", "que", "hora", "?"], "value": ["$hora"] },
  { "key": ["qual", "o", "que", "dia", "?"], "value": ["$dia"] },
  { "key": ["qual", "o", "que", "mês", "?"], "value": ["$mes"] },
  { "key": ["qual", "o", "que", "ano", "?"], "value": ["$ano"] },
  { "key": ["qual", "o", "que", "minuto", "?"], "value": ["$minuto"] },
  { "key": ["qual", "o", "que", "segundo", "?"], "value": ["$segundo"] },
  { "key": ["abrir", "abra"], "value": ["!open($value1)"] },
  {
    "key": ["calcular", "calcule", "quanto", "é", "?"],
    "value": [
      "!const conta = calc($value1,$value2,$value3); `A expressão \"${conta.exp}\" se resulta em ${conta.result}`"
    ]
  },
  { "key": ["olá", "oi", "ola", "eae"], "value": ["Olá!"] },
  { "key": ["olá", "como", "está", "?"], "value": ["Olá! Estou bem e você?"] }
]

if(!existsSync(dataFile)) writeFileSync(dataFile, JSON.stringify(dados))
const nome: string = "Multifuncional e Avançado Recurso de Inteligência Artificial";
const apelido: string = "M.A.R.I.A.";

function getData(){
  const rawdata: DataItem[] = JSON.parse(readFileSync(dataFile).toString());

  const formats: { name: string; value: string }[] = [
    { name: "$apelido", value: apelido },
    { name: "$nome", value: nome },
    { name: "$hora", value: moment().tz("America/Sao_Paulo").format("HH") },
    { name: "$minuto", value: moment().tz("America/Sao_Paulo").format("mm") },
    { name: "$segundo", value: moment().tz("America/Sao_Paulo").format("ss") },
    { name: "$dia", value: moment().tz("America/Sao_Paulo").format("DD") },
    { name: "$mes", value: moment().tz("America/Sao_Paulo").format("MM") },
    { name: "$ano", value: moment().tz("America/Sao_Paulo").format("YYYY") },
  ];
  return rawdata.map((item) => {
    const formattedKey = item.key.map((k) => k.toLowerCase());
    const formattedValue = item.value.map((v) => {
      let r = v;
      formats.forEach((f) => {
        r = r.replace(f.name, f.value);
      });
      return r;
    });
    return { key: formattedKey, value: formattedValue };
  });
}

let data: DataItem[] = getData();

function getValue(key: string): string {
  const d_msg = data.find((a) => a.key.includes(key.toLowerCase()));
  if (!d_msg) return "X";
  return d_msg.value[Math.floor(Math.random() * d_msg.value.length)];
}

function formatText(text: string, keys: string[]): string {
  keys.forEach((key) => {
    const regex = new RegExp(`${key.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}`, "g");
    text = text.replace(regex, ` ${key}`);
  });

  return text;
}

function get(text: string): string {
  data = getData();
  const msg = formatText(text,["!","?",",","."]);
  console.log(msg)
  let match = { key: 0, match: 0 };
  data.forEach((d, i) => {
    const matchin = msg.split(" ").filter((m) => d.key.includes(m.toLowerCase())).length;
    if (match.match < matchin) {
      match = { key: i, match: matchin };
    }
  });
  const result = data[match.key];
  if(result.value[0].startsWith("!")){
    return command(match.key,text);
  }else return result.value[Math.floor(Math.random() * result.value.length)];
}

export default {
  data,
  nome,
  apelido,
  getValue,
  get,
  dataFile
};
