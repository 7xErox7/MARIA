import { createServer } from 'http';
import { BrowserWindow, app } from 'electron';
import { Server } from 'socket.io';
import express from 'express';
import createWindow from './lib/createWindow';
import api from './lib/data-center';
import path from 'path';
import { readFileSync, writeFileSync } from 'fs';

const exp = express();
const http = createServer(exp);
const io = new Server(http);

let port = 8719;
let window:BrowserWindow|null = null;

exp.use(express.static("views"))

exp.get("/", async(req,res) => {
    res.sendFile(path.join(__dirname,"../views/index.html"))
}).get("/admin", async(req,res) => {
    res.sendFile(path.join(__dirname,"../views/admin.html"))
})

app.on("ready", async() => {
    window = createWindow();
    http.listen(port, async () => {
        console.log("[SERVER] Servidor rodando na porta "+port)
    });
});

app.on("window-all-closed", async() => {
    app.quit();
})

io.on("connection", async socket => {
    console.log("Conexão estabelecida: "+socket.id);
    socket.on("input", async ({data}) => {
        const result = api.get(data)
        socket.emit("out", {result})
    })
    socket.on("new", async({key,value}) => {
        const keysArray = key.replace(/\?/g, ' ?').replace(/\ /g, '\\n').split("\\n");
        const valuesArray = value.split("\\n");
        const newItem = { key: keysArray, value: valuesArray };
        const data = JSON.parse(readFileSync(api.dataFile).toString())
        data.push(newItem);
        writeFileSync(api.dataFile,JSON.stringify(data));
        socket.emit("out",{result:"Novas entradas: "+keysArray.toString()});
    })
})