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

        return `<style>iframe { background-color: white } </style>
                <iframe src="${uri}" frameBorder="0" width="100%" height="1000px" />`;
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public update(uri: vscode.Uri) {
        this._onDidChange.fire(uri);
    }
}
