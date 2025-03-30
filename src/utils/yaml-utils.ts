import * as vscode from "vscode";
import * as yamlAstParser from "yaml-ast-parser";
import type { PackageAtPosition } from "../models/types";

/**
 * Type guard to check if a node is a YAML map
 */
export function isMapping(node: yamlAstParser.YAMLNode): node is yamlAstParser.YamlMap {
  return node.kind === yamlAstParser.Kind.MAP;
}

/**
 * Type guard to check if a node is a YAML scalar
 */
export function isScalar(node: yamlAstParser.YAMLNode): node is yamlAstParser.YAMLScalar {
  return node.kind === yamlAstParser.Kind.SCALAR;
}

/**
 * Gets a value from a YAML map by key
 * @param mapNode The YAML map node
 * @param key The key to look for
 * @returns The value node or undefined if not found
 */
export function getValueByKey(mapNode: yamlAstParser.YamlMap, key: string): yamlAstParser.YAMLNode | undefined {
  if (!isMapping(mapNode)) {
    return undefined;
  }
  
  return mapNode.mappings.find(
    mapping => isScalar(mapping.key) && mapping.key.value === key
  )?.value;
}

/**
 * Converts a character position to line and column
 * @param position Character position in the text
 * @param text The full text
 * @returns Line and character position
 */
export function getLineAndColumn(position: number, text: string): { line: number; character: number } {
  // Calculate line and column from character position
  const lines = text.substring(0, position).split("\n");
  const line = lines.length - 1;
  const character = lines[lines.length - 1].length;
  
  return { line, character };
}

/**
 * Checks if a position is within a node
 * @param position VSCode position
 * @param node YAML node
 * @param text The full text
 * @returns True if the position is within the node
 */
export function isPositionInNode(
  position: vscode.Position,
  node: yamlAstParser.YAMLNode,
  text: string
): boolean {
  const nodeStart = getLineAndColumn(node.startPosition, text);
  const nodeEnd = getLineAndColumn(node.endPosition, text);
  
  // Check if position is between start and end positions
  if (position.line < nodeStart.line || position.line > nodeEnd.line) {
    return false;
  }
  
  if (position.line === nodeStart.line && position.character < nodeStart.character) {
    return false;
  }
  
  if (position.line === nodeEnd.line && position.character > nodeEnd.character) {
    return false;
  }
  
  return true;
}

/**
 * Finds the package at the given position
 * @param document The text document
 * @param position The cursor position
 * @param rootNode The root YAML node
 * @returns Package name and range, or null if not found
 */
export function findPackageAtPosition(
  document: vscode.TextDocument,
  position: vscode.Position,
  rootNode: yamlAstParser.YAMLNode
): PackageAtPosition | null {
  if (!isMapping(rootNode)) {
    return null;
  }
  
  const text = document.getText();
  
  // Find dependencies or dev_dependencies sections
  const dependenciesNode = getValueByKey(rootNode, "dependencies");
  const devDependenciesNode = getValueByKey(rootNode, "dev_dependencies");
  
  // List of dependency sections
  const dependencySections = [
    { node: dependenciesNode, name: "dependencies" },
    { node: devDependenciesNode, name: "dev_dependencies" }
  ].filter(section => section.node !== undefined);
  
  // Find the section containing the cursor position
  const currentSection = dependencySections.find(section => 
    section.node && isPositionInNode(position, section.node, text)
  );
  
  if (!currentSection?.node || !isMapping(currentSection.node)) {
    return null;
  }
  
  // Scan packages in the dependency section
  for (const mapping of currentSection.node.mappings) {
    if (!isScalar(mapping.key)) {
      continue;
    }
    
    // Package name node
    const packageNameNode = mapping.key;
    
    // Check if cursor position is on the package name
    if (isPositionInNode(position, packageNameNode, text)) {
      const packageName = packageNameNode.value;
      
      // Create VSCode range
      const startPos = getLineAndColumn(packageNameNode.startPosition, text);
      const endPos = getLineAndColumn(packageNameNode.endPosition, text);
      
      const range = new vscode.Range(
        startPos.line,
        startPos.character,
        endPos.line,
        endPos.character
      );
      
      return { packageName, range };
    }
  }
  
  return null;
}
