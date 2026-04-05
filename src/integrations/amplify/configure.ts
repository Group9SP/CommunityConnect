import { Amplify } from "aws-amplify";

// Amplify Gen 1: copy the CLI-generated `aws-exports.js` into `src/aws-exports.js` (gitignored).
import awsconfig from "../../aws-exports.js";

Amplify.configure(awsconfig);
