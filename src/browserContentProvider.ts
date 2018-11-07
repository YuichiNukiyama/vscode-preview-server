"use strict";
import * as vscode from "vscode";
import { Utility } from "./utility";

export class BrowserContentProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    public provideTextDocumentContent() {
        const editor = vscode.window.activeTextEditor;
        const uri = Utility.getUriOfActiveEditor();

        if (editor.document.languageId !== "html") {
            return `
				<body>
					Active editor doesn't show a HTML document
				</body>`;
        }

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Preview</title>
            <style>iframe { background-color: white } </style>
        </head>
        <body>
            <iframe src="${uri}" frameBorder="0" width="100%" height="1000px" />
        </body>
        </html>`;
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public update(uri: vscode.Uri) {
        this._onDidChange.fire(uri);
    }
}
