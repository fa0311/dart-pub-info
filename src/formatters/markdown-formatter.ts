import type { PackageInfo } from "../models/types";

/**
 * Generates markdown content from package information
 * @param packageInfo The package information
 * @returns Markdown string
 */
export function generateMarkdown(packageInfo: PackageInfo): string {
  let markdown = `## ${packageInfo.name}\n\n`;
  
  markdown += `**Version**: ${packageInfo.latest.version}\n\n`;
  
  if (packageInfo.latest.pubspec.description) {
    markdown += `${packageInfo.latest.pubspec.description}\n\n`;
  }
  
  const links = [];
  if (packageInfo.latest.pubspec.homepage) {
    links.push(`[Homepage](${packageInfo.latest.pubspec.homepage})`);
  }
  
  if (packageInfo.latest.pubspec.repository) {
    links.push(`[Repository](${packageInfo.latest.pubspec.repository})`);
  }
  
  links.push(`[pub.dev](https://pub.dev/packages/${packageInfo.name})`);
  
  markdown += links.join(" | ");
  
  return markdown;
}
