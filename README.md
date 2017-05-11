# vscode-preview-server

## Features

This extension provide preview of HTML which execute on web server.
When you save files, this extension automatically reload browser or side panel (live preview feature).
You can call these features from the context menu or editor menu.
The main features are as follows.

* `Preview on side panel (ctrl+shift+p)`: Open preview of HTML on side panel. With this feature, you can easely check the operation of HTML, CSS and JavaScript.
* `Launch on default browser (ctrl+shift+l)`: Open Web Page on default browser. You can check all operation with web page.
* `Stop the web server (ctrl+shift+s)`: Stop the web server. This feature can be used only from command palette.
* `Resume the web server (ctrl+shift+r)`: Resume the web server. This feature can be used only from command palette.

![feature](images/feature.gif)

## Extension Settings

This extension contributes the following settings:

* `previewServer.isWatchConfiguration`: Controls whether resume the Web Server or not, when change settings. Default setting is *true*.
* `previewServer.port`: Port number of the Web Server. If you set *null*, vscode-preview-server generate random number, and set port as random number. Default setting is *8080*.
* `previewServer.proxy`: Set proxy. This is usefull when execute web app on another web server. Default setting is *""*.
* `previewServer.sync`: Controls whether synchronized or not. Default setting is *true*.

## Known Issues

`Preview on side panel` somethimes don't work with CDN, Link etc.

## Lisence
[MIT](https://github.com/YuichiNukiyama/vscode-preview-server/blob/master/LICENSE)
