/**
 * Interface for package information from pub.dev API
 */
export interface PackageInfo {
  name: string;
  latest: {
    version: string;
    pubspec: {
      description?: string;
      homepage?: string;
      repository?: string;
    };
  };
}

/**
 * Interface for package and range information found in pubspec.yaml
 */
export interface PackageAtPosition {
  packageName: string;
  range: import('vscode').Range;
}
