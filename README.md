# vscode-preview-server

## Features

This extension provide preview of HTML which execute on web server.
When you save files, this extension automatically reload browser or side panel (live preview feature).
You can call these features from the context menu or editor menu.
The main features are as follows.

* `Preview on side panel`: Open preview of HTML on side panel. With this feature, you can easely check the operation of HTML, CSS and JavaScript
* `Launch on default browser`: Open Web Page on default browser. You can check all operation with web page.
* `Stop the web server`: Stop the web server. This feature can be used only from command palette.
* `Resume the web server`: Resume the web server. This feature can be used only from command palette.

![feature](images/feature.gif)

## Extension Settings

This extension contributes the following settings:

* `previewServer.port`: Port number of the Web Server. Default setting is *8080*.
* `previewServer.sync`: Whether synchronized or not. Default setting is *true*.

## Known Issues

`Preview on side panel` somethimes don't work with CDN, Link etc.

## Lisence
[MIT](https://github.com/YuichiNukiyama/vscode-preview-server/blob/master/LICENSE)
