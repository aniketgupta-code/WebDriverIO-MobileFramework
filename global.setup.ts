export default async function globalSetup(
	config: WebdriverIO.Config,
	capabilities: WebdriverIO.Capabilities[],
) {
	console.log("🔧 Global Setup: Starting test run...");
	console.log("WebdriverIO Config:", config);
	console.log("WebdriverIO Capabilities:", capabilities);
}
