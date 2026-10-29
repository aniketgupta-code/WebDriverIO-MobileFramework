import dotenv from "dotenv";
import globalSetup from "./global.setup";
import globalTeardown from "./global.teardown";

dotenv.config({ path: ["./config/.env", "./config/cred.env"] });

export const TEST_ENV = process.env.TEST_ENV || "QA";
export const PLATFORM: "android" | "ios" =
	(process.env.PLATFORM?.toLowerCase() as "android" | "ios") || "android";
const isAndroid = PLATFORM === "android";

const androidCaps: WebdriverIO.Capabilities = {
	platformName: "Android",
	"appium:deviceName": process.env.ANDROID_DEVICE_NAME || "emulator-5554",
	"appium:platformVersion": process.env.ANDROID_PLATFORM_VERSION || "14.0",
	"appium:automationName": "UiAutomator2",
	"appium:app": process.env.ANDROID_APP_PATH || "./apps/android/app-debug.apk",
	"appium:appPackage": process.env.APP_PACKAGE || "com.example.myapp",
	"appium:appActivity": process.env.APP_ACTIVITY || ".MainActivity",
	"appium:noReset": JSON.parse(process.env.NO_RESET || "false"),
	...(process.env.ANDROID_UDID && { "appium:udid": process.env.ANDROID_UDID }),
};

const iosCaps: WebdriverIO.Capabilities = {
	platformName: "iOS",
	"appium:deviceName": process.env.IOS_DEVICE_NAME || "iPhone 15",
	"appium:platformVersion": process.env.IOS_PLATFORM_VERSION || "17.0",
	"appium:automationName": "XCUITest",
	"appium:app": process.env.IOS_APP_PATH || "./apps/ios/App.app",
	"appium:bundleId": process.env.BUNDLE_ID || "com.example.myapp",
	"appium:noReset": JSON.parse(process.env.NO_RESET || "false"),
	...(process.env.IOS_UDID && { "appium:udid": process.env.IOS_UDID }),
};

function buildGrepConfig(tagsEnv: string | undefined): {
	grep?: RegExp;
	grepInvert?: RegExp;
} {
	if (!tagsEnv) return {};

	const normalize = (t: string) => (t.startsWith("@") ? t : `@${t}`);
	const tags = tagsEnv
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean);

	const included = tags.filter((t) => !t.startsWith("!")).map(normalize);

	const excluded = tags
		.filter((t) => t.startsWith("!"))
		.map((t) => normalize(t.slice(1)));

	return {
		grep: included.length ? new RegExp(included.join("|")) : undefined,
		grepInvert: excluded.length ? new RegExp(excluded.join("|")) : undefined,
	};
}

const { grep, grepInvert } = buildGrepConfig(process.env.TAGS);

export const config: WebdriverIO.Config = {
	runner: "local",

	specs: ["./src/tests/**/*.spec.ts"],
	exclude: [],

	maxInstances: 1,

	capabilities: [isAndroid ? androidCaps : iosCaps],

	logLevel: fetchLogLevel(),
	bail: 0,

	waitforTimeout: 10000,
	connectionRetryTimeout: 120000,
	connectionRetryCount: 3,

	hostname: process.env.APPIUM_HOST || "127.0.0.1",
	port: parseInt(process.env.APPIUM_PORT || "4723", 10),

	services: [
		[
			"appium",
			{
				args: {
					relaxedSecurity: true,
				},
			},
		],
	],

	framework: "mocha",
	reporters: ["spec"],

	mochaOpts: {
		ui: "bdd",
		timeout: 60000,
		grep,
		grepInvert,
	},

	onPrepare: globalSetup,
	onComplete: globalTeardown,
};

function fetchLogLevel(): WebdriverIO.Config["logLevel"] {
	const logLevel = process.env.LOG_LEVEL?.toLowerCase();
	const validLogLevels = ["trace", "debug", "info", "warn", "error", "silent"];
	if (validLogLevels.includes(logLevel as string)) {
		return logLevel as WebdriverIO.Config["logLevel"];
	}
	return "info";
}
