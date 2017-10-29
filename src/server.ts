import * as browserSync from "browser-sync";
import { UiOption } from "./utility";

export class Server {

    public static start(rootPath: string, port: number, isSync: boolean, proxy = "", ui: UiOption = null) {
        // get browserSync instance.
        let bs: browserSync.BrowserSyncInstance;
        if (!browserSync.has("vscode-preview-server")) {
            bs = browserSync.create("vscode-preview-server");
        } else {
            bs = browserSync.get("vscode-preview-server");
        }

        let options: browserSync.Options;

        if (proxy === "") {
            options = {
                server: {
                    baseDir: rootPath,
                    directory: true
                },
                open: false,
                port: port,
                codeSync: isSync
            };
        } else {
            options = {
                proxy: proxy,
                serveStatic: ["."]
            };
        }

        if (ui.port && ui.weinrePort) {
            options.ui = {
                port: ui.port,
                weinre: {
                    port: ui.weinrePort
                }
            };
        }


        bs.init(options, (err) => {
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
