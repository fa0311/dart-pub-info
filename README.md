# Dart Pub Info

Dart Pub Info は、Dart プロジェクトの`pubspec.yaml`ファイル内のパッケージ名にホバーすると、そのパッケージの情報を表示する VSCode 拡張機能です。

## 機能

この拡張機能は以下の機能を提供します：

- `pubspec.yaml`ファイル内のパッケージ名を検出
- パッケージ名にホバーすると、pub.dev API からパッケージ情報を取得
- パッケージの最新バージョン、説明、ホームページ、リポジトリ、pub.dev へのリンクを表示

### 使用例

1. Dart プロジェクトの`pubspec.yaml`ファイルを開きます
2. `dependencies`または`dev_dependencies`セクション内のパッケージ名にマウスカーソルを合わせます
3. ホバー表示でパッケージの詳細情報が表示されます

## 要件

この拡張機能を使用するには以下が必要です：

- Visual Studio Code 1.98.0 以上
- インターネット接続（パッケージ情報の取得に必要）

## 拡張機能の設定

現在、この拡張機能には特別な設定はありません。

## 既知の問題

- パッケージ情報の取得に失敗した場合、エラーメッセージが表示されます
- 一部のパッケージでは、pub.dev API から完全な情報が取得できない場合があります

## リリースノート

### 0.0.1

- 初期リリース
- `pubspec.yaml`ファイル内のパッケージ名にホバーすると情報を表示する機能

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
- Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
- Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
