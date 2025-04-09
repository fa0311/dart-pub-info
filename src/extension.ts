import * as vscode from "vscode";
import * as yamlAstParser from "yaml-ast-parser";
import { generateMarkdown } from "./formatters/markdown-formatter";
import { fetchPackageInfo } from "./services/package-service";
import { findPackageAtPosition } from "./utils/yaml-utils";

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "dart-pub-info" is now active!');

  // Register hover provider
  const hoverProvider = vscode.languages.registerHoverProvider(
    { language: "yaml", pattern: "**/pubspec.yaml" },
    {
      async provideHover(document, position, token) {
        try {
          // Parse YAML
          const text = document.getText();
          const rootNode = yamlAstParser.load(text);

          // Get package info at cursor position
          const packageInfo = findPackageAtPosition(
            document,
            position,
            rootNode,
          );
          if (!packageInfo) {
            return null;
          }

          // Fetch package information
          const { packageName, range } = packageInfo;
          const pubPackageInfo = await fetchPackageInfo(packageName);

          if (!pubPackageInfo) {
            return new vscode.Hover(
              `Package "${packageName}" information not found.`,
              range,
            );
          }

          // Generate markdown
          const markdown = generateMarkdown(pubPackageInfo);
          return new vscode.Hover(new vscode.MarkdownString(markdown), range);
        } catch (error) {
          console.error(`Error providing hover information: ${error}`);
          return null;
        }
      },
    },
  );

  context.subscriptions.push(hoverProvider);
}

export function deactivate() {}
