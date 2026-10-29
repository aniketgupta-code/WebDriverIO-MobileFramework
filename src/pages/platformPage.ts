import { PlatFormPageLocators } from "../locators/platformLocators";
import { PLATFORM } from "../../wdio.config";

export class PlatformPage {
	static async login(username: string, password: string, secret?: string) {
		await $(PlatFormPageLocators.loginNowButton[PLATFORM]).click();
	}
}
