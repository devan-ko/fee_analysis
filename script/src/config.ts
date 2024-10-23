import { config } from "dotenv";

// Load variables from .env file
const envConfig = config({ path: '.env' });

// Define variables from .env
export const SIGNER_PHRASE = envConfig.parsed?.SIGNER_PHRASE!;

export const SUI_NETWORK = envConfig.parsed?.SUI_NETWORK!;
export const PACKAGE_ID = envConfig.parsed?.PACKAGE_ID!;
export const ONE_SHARED_OBJECT_ID = envConfig.parsed?.ONE_SHARED_OBJECT_ID!;
export const EACH_USER_SHARED_OBJECT_ID = envConfig.parsed?.EACH_USER_SHARED_OBJECT_ID!;
