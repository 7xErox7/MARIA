import { BrowserWindow, nativeImage } from "electron";
import path from "path";

export default function createWindow(){
    const window = new BrowserWindow({
        title: "M.A.R.I.A.",
        icon: path.join(__dirname,"../../assets/icon.ico")
    });
    window.loadURL("http://localhost:8719/");
    return window;
}