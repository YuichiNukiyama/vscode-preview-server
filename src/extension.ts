import * as vscode from "vscode";
import { BrowserContentProvider } from "./browserContentProvider";
import { Utility } from "./Utility";

export function activate(context: vscode.ExtensionContext) {
    Utility.startWebServer();

    const provider = new BrowserContentProvider();
    const registration = vscode.workspace.registerTextDocumentContentProvider("http", provider);
    let previewUri = vscode.Uri.parse("http://localhost");

    vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
        if (e.document === vscode.window.activeTextEditor.document) {
            provider.update(previewUri);
        }
    });

    let disposable: any = vscode.commands.registerCommand("extension.preview", () => {
        // set ViewColumn
        let viewColumn: vscode.ViewColumn;
        if (vscode.window.activeTextEditor.viewColumn < 3) {
            viewColumn = vscode.window.activeTextEditor.viewColumn + 1;
        } else {
            viewColumn = 1;
        }

        return vscode.commands.executeCommand("vscode.previewHtml", previewUri, viewColumn, "Preview with WebServer").then(() => {
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    });

    let disposable2: any = vscode.commands.registerCommand("extension.launch", () => {
        const uri = Utility.getUriOfActiveEditor();
        return vscode.commands.executeCommand("vscode.open", uri);
    });


    context.subscriptions.push(disposable, disposable2, registration);
}

export function deactivate() {
}
