import * as vscode from "vscode";
import { BrowserContentProvider } from "./browserContentProvider";
import { Server } from "./server";
import { Utility, UiOption } from "./utility";

export function activate(context: vscode.ExtensionContext) {
    // start web server
    startServer();

    // provider settings.
    const provider = new BrowserContentProvider();
    const registration = vscode.workspace.registerTextDocumentContentProvider("http", provider);
    vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
        if (e.document === vscode.window.activeTextEditor.document) {
            const previewUri = Utility.getUriOfActiveEditor();
            provider.update(previewUri);
        }
    });

    // When configuration is changed, resume web server.
    vscode.workspace.onDidChangeConfiguration(() => {
        const settings = vscode.workspace.getConfiguration("previewServer")
                            .get("isWatchConfiguration") as boolean;
        if (settings) {
            resumeServer();
            vscode.window.showInformationMessage("Resume the Web Server.");
        }
    });

    // When file is saved, reload browser.
    vscode.workspace.onDidSaveTextDocument((e) => {
        Server.reload(e.fileName);
    });

    let disposable: any = vscode.commands.registerCommand("extension.preview", () => {
        const previewUri = Utility.getUriOfActiveEditor();

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
        const options = vscode.workspace.getConfiguration("previewServer");
        const browsers = options.get("browsers") as string[];
        const ignoreDefaultBrowser = options.get("ignoreDefaultBrowser") as boolean;

        if (browsers === null && !ignoreDefaultBrowser) {
            return vscode.commands.executeCommand("vscode.open", uri);
        } else if (browsers !== null  && !ignoreDefaultBrowser) {
            Utility.openBrowser(browsers);
            return vscode.commands.executeCommand("vscode.open", uri);
        } else if (browsers !== null && ignoreDefaultBrowser) {
            return Utility.openBrowser(browsers);
        } else {
            return vscode.window.showErrorMessage("You should set browser option or change ignoreDefultBrowser to true.");
        }
    });

    let disposable3: any = vscode.commands.registerCommand("extension.stop", () => {
        Server.stop();
        vscode.window.showInformationMessage("Stop the Web Server successfully.");
    });

    let disposable4: any = vscode.commands.registerCommand("extension.resume", () => {
        resumeServer();
        vscode.window.showInformationMessage("Resume the Web Server.");
    });

    let disposable5: any = vscode.commands.registerCommand("extension.ui", () => {
        let port = 3001;
        const ui = vscode.workspace.getConfiguration("previewServer").get("ui") as UiOption;

        if (ui.port) {
            port = ui.port;
        }

        const uri = vscode.Uri.parse(`http://localhost:${port}`);
        return vscode.commands.executeCommand("vscode.open", uri);
    });

    context.subscriptions.push(disposable, disposable2, disposable3, disposable4, disposable5, registration);
}

function startServer() {
    Utility.setRandomPort();
    const options = vscode.workspace.getConfiguration("previewServer");
    const port = options.get("port") as number;
    const proxy = options.get("proxy") as string;
    const isSync = options.get("sync") as boolean;
    const ui = options.get("ui") as UiOption;
    const rootPath = vscode.workspace.rootPath || Utility.getOpenFilePath(vscode.window.activeTextEditor.document.fileName);

    Server.start(rootPath, port, isSync, proxy, ui);
}

function resumeServer() {
    Server.stop();
    startServer();
}

export function deactivate() {
    Server.stop();
}
