import * as vscode from "vscode";

export class Utility {
    public static getUriOfActiveEditor() {
        const fileName = vscode.window.activeTextEditor.document.fileName;
        const relativePath = vscode.workspace.asRelativePath(fileName);
        const port = vscode.workspace.getConfiguration("previewServer").get("port") as number;
        const proxy = vscode.workspace.getConfiguration("previewServer").get("proxy") as string;

        if (proxy === "") {
            return vscode.Uri.parse(`http://localhost:${port}/${relativePath}`);
        }

        let uri = vscode.Uri.parse(`http://${proxy}`);
        let host = uri.authority.split(":")[0];
        return vscode.Uri.parse(`http://${host}:3000/${uri.path}`);
    }
}
