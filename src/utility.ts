import * as vscode from "vscode";
import * as http from "http";
import * as net from "net";
import { Server } from "node-static";

export class Utility {
    private static server: net.Server;

    public static getUriOfActiveEditor() {
        const fileName = vscode.window.activeTextEditor.document.fileName;
        const relativePath = vscode.workspace.asRelativePath(fileName);
        const port = vscode.workspace.getConfiguration("previewServer").get("port");
        return vscode.Uri.parse(`http://localhost:${port}/${relativePath}`);
    }

    public static startWebServer() {
        const rootPath = vscode.workspace.rootPath || vscode.window.activeTextEditor.document.fileName;
        const fileServer = new Server(rootPath, { cache: -1, serverInfo: "preview-on-webserver" });
        const options = vscode.workspace.getConfiguration("previewServer");

        this.server = http.createServer((req, res) => {
            req.addListener("end", () => {
                fileServer.serve(req, res, (err) => {
                    if (err) {
                        console.error("Error serving " + req.url + " - " + err.message);
                        res.writeHead(err.status, err.headers);
                        res.end();
                    } else {
                        res.end();
                    }
                });
            }).resume();
        }).listen(options.get("port"));
    }
}
