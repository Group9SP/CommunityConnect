import { uploadData } from "aws-amplify/storage";

const BUCKET = "communityconnect8111b1a6740d4d859252ffd81115f007a86e-dev";
const REGION = "us-east-2";

export async function uploadBusinessImage(file: File, userId: string): Promise<string> {
  const safeName = file.name.replace(/[^\w.-]+/g, "_");
  const path = `public/business-images/${userId}/${Date.now()}-${safeName}`;

  await uploadData({
    path,
    data: file,
    options: { contentType: file.type || undefined },
  }).result;

  // Permanent public URL — works as long as the bucket has public read on the public/ prefix
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${path}`;
}
