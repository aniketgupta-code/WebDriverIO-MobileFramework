export type Credentials = {
	user: string;
	password: string;
	token?: string;
};

export type credentialKey = "EXTERNAL" | "INTERNAL" | "TEST";

export function getUserCredentials(key: credentialKey): Credentials {
	return {
		user: process.env[`${key.toUpperCase()}_USER`] || "",
		password: process.env[`${key.toUpperCase()}_PASSWORD`] || "",
		token: process.env[`${key.toUpperCase()}_TOKEN`] || "",
	};
}
