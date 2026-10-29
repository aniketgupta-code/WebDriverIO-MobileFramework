import { getUserCredentials } from "../helpers/credentials";
import { PlatformPage } from "../pages/platformPage";

describe("Login Tests", function () {
	const userCred = getUserCredentials("EXTERNAL");
	beforeEach(async function () {
		// Setup code before each test, e.g., navigate to the login page
	});

	it("@smoke should log in successfully", async function () {
		await PlatformPage.login(userCred.user, userCred.password, userCred.token);
	});

	afterEach(async function () {
		if (this.currentTest?.state?.toLowerCase() === "failed") {
			await driver.saveScreenshot(
				`./screenshots/${this.currentTest.title}.png`,
			);
		}
	});
});
