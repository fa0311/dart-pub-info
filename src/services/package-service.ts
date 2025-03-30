import * as https from "node:https";
import type { PackageInfo } from "../models/types";

// Cache map for package information
const packageInfoCache = new Map<string, PackageInfo>();

/**
 * Fetches package information from pub.dev API
 * @param packageName The name of the package to fetch
 * @returns Package information or null if not found
 */
export async function fetchPackageInfo(
	packageName: string,
): Promise<PackageInfo | null> {
	// Return cached info if available
	const cachedInfo = packageInfoCache.get(packageName);
	if (cachedInfo) {
		return cachedInfo;
	}

	const url = `https://pub.dev/api/packages/${packageName}`;

	try {
		return await new Promise<PackageInfo | null>((resolve, reject) => {
			https
				.get(url, (res) => {
					if (res.statusCode === 404) {
						resolve(null);
						return;
					}

					if (res.statusCode !== 200) {
						reject(
							new Error(`Failed to fetch package info: ${res.statusCode}`),
						);
						return;
					}

					let data = "";
					res.on("data", (chunk) => {
						data += chunk;
					});

					res.on("end", () => {
						try {
							const packageInfo = JSON.parse(data) as PackageInfo;
							// Save to cache
							packageInfoCache.set(packageName, packageInfo);
							resolve(packageInfo);
						} catch (error) {
							reject(error);
						}
					});
				})
				.on("error", (error) => {
					reject(error);
				});
		});
	} catch (error) {
		console.error("Error fetching package info:", error);
		return null;
	}
}
