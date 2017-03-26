import * as assert from "assert";
import * as browserSync from "browser-sync";
import { Server } from "../src/server";


suite("Server Tests", () => {
    test("start server", () => {
        Server.start(".", 8888, true);
        assert.ok(browserSync.has("vscode-preview-server"));
        Server.stop();
    });
});
