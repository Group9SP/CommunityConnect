/**
 * Amplify Gen 1 — copy this file to `src/aws-exports.js` (gitignored) and replace placeholders
 * with values from your teammate’s `amplify pull` / Amplify Console output.
 * Do not commit real `aws-exports.js` or `amplify_outputs.json`.
 */
const awsmobile = {
  aws_project_region: "us-east-1",
  aws_cognito_identity_pool_id: "us-east-1:00000000-0000-0000-0000-000000000000",
  aws_cognito_region: "us-east-1",
  aws_user_pools_id: "us-east-1_XXXXXXXXX",
  aws_user_pools_web_client_id: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
  aws_cloud_logic_custom: [
    {
      name: "equityspotapi",
      endpoint: "https://example.execute-api.us-east-1.amazonaws.com/prod",
      region: "us-east-1",
    },
  ],
  aws_user_files_s3_bucket: "your-s3-bucket",
  aws_user_files_s3_bucket_region: "us-east-1",
};

export default awsmobile;
