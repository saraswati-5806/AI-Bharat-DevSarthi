/**
 * AWS Bedrock Runtime Client Configuration
 * 
 * This module initializes and exports the BedrockRuntimeClient for use across the application.
 * The client is configured to use the us-east-1 region and credentials from environment variables.
 * 
 * @module lib/bedrock-client
 */

import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

/**
 * Initialize the Bedrock Runtime Client
 * 
 * Configuration:
 * - Region: us-east-1
 * - Credentials: Loaded from environment variables
 *   - AWS_ACCESS_KEY_ID
 *   - AWS_SECRET_ACCESS_KEY
 */
const bedrockClient = new BedrockRuntimeClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_SATHI_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_SATHI_AWS_SECRET_ACCESS_KEY,
  },
});

export { bedrockClient };
