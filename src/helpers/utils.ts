import dataset from "../data/dataset.json";
import { JSONPath } from "jsonpath-plus";

export function currentTestData(testTitle: string, TEST_ENV: string) {
	const currentTestName = testTitle.replace(/@\w+\s*/g, "").trim();
	const currentTestData = JSONPath({
		path: `$..['${currentTestName}']`,
		json: dataset,
	});
	if (TEST_ENV) {
		return currentTestData[0]?.[TEST_ENV] || {};
	}
	return currentTestData[0] || {};
}
