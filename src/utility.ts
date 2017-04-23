import * as vscode from "vscode";

export class Utility {
    public static getUriOfActiveEditor() {
        const fileName = vscode.window.activeTextEditor.document.fileName;
        const relativePath = vscode.workspace.asRelativePath(fileName);
        const options = vscode.workspace.getConfiguration("previewServer");
        const port = options.get("port") as number;
        const proxy = options.get("proxy") as string;

        if (proxy === "") {
            return vscode.Uri.parse(`http://localhost:${port}/${relativePath}`);
        }

        let uri = vscode.Uri.parse(`http://${proxy}`);
        let host = uri.authority.split(":")[0];
        return vscode.Uri.parse(`http://${host}:3000/${uri.path}`);
    }

    public static setRandomPort() {
        const options = vscode.workspace.getConfiguration("previewServer");
        let port = options.get("port") as number;
        if (!port) {
            // dynamic ports (49152–65535)
            port = Math.floor(Math.random() * 16383 + 49152);
            options.update("port", port, false)
            .then(() => {
                vscode.window.showInformationMessage(`change previewServer.port setting to ${port}`);
            });
        }
    }
}
