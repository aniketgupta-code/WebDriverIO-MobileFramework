export default async function globalTeardown(
	exitCode: number,
	config: WebdriverIO.Config,
	capabilities: WebdriverIO.Capabilities[],
	results: Record<string, { passed: number; failed: number }>,
) {
	console.log(`🧹 Global Teardown: Finished with exit code ${exitCode}`);
	console.log("WebdriverIO Config:", config);
	console.log("WebdriverIO Capabilities:", capabilities);
	console.log("Test Results:", results);
}
