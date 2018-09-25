import * as vscode from "vscode";
import { BrowserContentProvider } from "./browserContentProvider";
import { Server } from "./server";
import { Utility, UiOption, Space } from "./utility";
import * as nls from "vscode-nls";

const localize = nls.config({locale: process.env.VSCODE_NLS_CONFIG})();

export function activate(context: vscode.ExtensionContext) {
    const options = vscode.workspace.getConfiguration("previewServer");
    const ignoreNotification = options.get("ignoreNotification") as boolean;

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
            if (!ignoreNotification){
                vscode.window.showInformationMessage(localize("resumeServer.text", "Resume the Web Server."));
            }
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
            console.error(reason);
            if (!ignoreNotification) {
                vscode.window.showErrorMessage(localize("previewError.text", "Preview failed."));
            }
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
            return vscode.window.showErrorMessage(localize("launchError.text", "You should set browser option or change ignoreDefultBrowser to true."));
        }
    });

    let disposable3: any = vscode.commands.registerCommand("extension.stop", () => {
        Server.stop();
        if (!ignoreNotification) {
            vscode.window.showInformationMessage(localize("stopServer.text", "Stop the Web Server successfully."));
        }
    });

    let disposable4: any = vscode.commands.registerCommand("extension.resume", () => {
        resumeServer();
        if (!ignoreNotification) {
            vscode.window.showInformationMessage(localize("resumeServer.text2", "Resume the Web Server."));
        }
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

    context.subscriptions.push(vscode.workspace.onDidChangeWorkspaceFolders(() => resumeServer()));
    context.subscriptions.push(disposable, disposable2, disposable3, disposable4, disposable5, registration);
}

function startServer() {
    Utility.setRandomPort();
    const options = vscode.workspace.getConfiguration("previewServer");
    const port = options.get("port") as number;
    const proxy = options.get("proxy") as string;
    const isSync = options.get("sync") as boolean;
    const ignoreNotification = options.get("ignoreNotification") as boolean;
    const ui = options.get("ui") as UiOption;
    const startupProject = options.get("startupProject") as string;
    const space = Utility.checkSpace();
    let rootPath = "";

    if (space === Space.File) {
        rootPath = Utility.getOpenFilePath(vscode.window.activeTextEditor.document.fileName);
    } else if (space === Space.Folder || (space === Space.Workspace && !startupProject)) {
        rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    } else {
        for (let folder of vscode.workspace.workspaceFolders) {
            const workspaceName = vscode.workspace.getWorkspaceFolder(folder.uri).name;
            if (workspaceName === startupProject) {
                rootPath = folder.uri.fsPath;
                break;
            }
        }

        if (rootPath === "" && !ignoreNotification) {
            vscode.window.showErrorMessage(localize("startupProjectError.text", "startupProject option is null or invalide value."));
        }
    }

    Server.start(rootPath, port, isSync, proxy, ui);
}

function resumeServer() {
    Server.stop();
    startServer();
}

export function deactivate() {
    Server.stop();
}
