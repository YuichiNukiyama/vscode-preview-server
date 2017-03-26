import * as vscode from "vscode";

export class Utility {
    public static getUriOfActiveEditor() {
        const fileName = vscode.window.activeTextEditor.document.fileName;
        const relativePath = vscode.workspace.asRelativePath(fileName);
        const port = vscode.workspace.getConfiguration("previewServer").get("port");

        return vscode.Uri.parse(`http://localhost:${port}/${relativePath}`);
    }
}
