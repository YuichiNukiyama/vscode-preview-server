import * as browserSync from "browser-sync";

export class Server {

    public static start(rootPath: string, port: number, isSync: boolean) {
        // get browserSync instance.
        let bs: browserSync.BrowserSyncInstance;
        if (!browserSync.has("vscode-preview-server")) {
            bs = browserSync.create("vscode-preview-server");
        } else {
            bs = browserSync.get("vscode-preview-server");
        }

        bs.init({
            server: {
                baseDir: rootPath,
                directory: true
            },
            open: false,
            port: port,
            codeSync: isSync
        }, (err) => {
            if (err) {
                console.log(err);
                bs.notify("Error is occured.");
            }
        });
    }

    public static stop() {
        if (browserSync.has("vscode-preview-server")) {
            browserSync.get("vscode-preview-server").exit();
        }
    }

    public static reload(fileName: string) {
        if (browserSync.has("vscode-preview-server")) {
            browserSync.get("vscode-preview-server").reload(fileName);
        }
    }
}
