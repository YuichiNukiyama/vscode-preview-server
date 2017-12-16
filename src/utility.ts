import { window, workspace, Uri } from "vscode";

const opener = require("opener");

export class Utility {
    public static getUriOfActiveEditor() {
        const fileName = window.activeTextEditor.document.fileName;
        const options = workspace.getConfiguration("previewServer");
        const port = options.get("port") as number;
        const proxy = options.get("proxy") as string;
        const space = this.checkSpace();
        let relativePath = workspace.asRelativePath(fileName);

        if (space === Space.File) {
            let paths = relativePath.split("\\");
            relativePath = paths[paths.length - 1];
        } else if (space === Space.Workspace) {
            relativePath = workspace.asRelativePath(fileName, false);
        }

        if (proxy === "") {
            return Uri.parse(`http://localhost:${port}/${relativePath}`);
        }

        let uri = Uri.parse(`http://${proxy}`);
        let host = uri.authority.split(":")[0];
        return Uri.parse(`http://${host}:3000/${uri.path}`);
    }

    public static setRandomPort() {
        const options = workspace.getConfiguration("previewServer");
        let port = options.get("port") as number;
        if (!port) {
            // dynamic ports (49152–65535)
            port = Math.floor(Math.random() * 16383 + 49152);
            options.update("port", port, false)
                .then(() => {
                    window.showInformationMessage(`change previewServer.port setting to ${port}`);
                });
        }
    }

    public static openBrowser(browsers: string[]) {

        const url = decodeURIComponent(Utility.getUriOfActiveEditor().toString());
        browsers.forEach((browser) => {
            opener([browser, url]);
        });
    }

    /**
     * When vscode.workspace.rootPath is undefined (When we use `open file`, this value will be undefined),
     * we use filepath without file name.
     * @param relativePath
     */
    public static getOpenFilePath(relativePath: string) {
        let paths = relativePath.split("\\");
        // remove file name.
        paths.pop();
        return paths.join("\\");
    }

    public static checkSpace() {
        const folders = workspace.workspaceFolders;
        if (folders === undefined) {
            return Space.File;
        } else if (folders.length === 1) {
            return Space.Folder;
        } else {
            return Space.Workspace;
        }
    }
}

export interface UiOption {
    port: number;
    weinrePort: number;
}

export enum Space {
    File,
    Folder,
    Workspace
}
