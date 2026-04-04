import { getUrl, uploadData } from "aws-amplify/storage";

/**
 * Upload a business logo to S3 (Amplify Storage Gen 1 bucket).
 * Uses the `public/` prefix so URLs can be read without per-object auth when your bucket policy allows it.
 */
export async function uploadBusinessImage(file: File, userId: string): Promise<string> {
  const safeName = file.name.replace(/[^\w.-]+/g, "_");
  const path = `public/business-images/${userId}/${Date.now()}-${safeName}`;

  await uploadData({
    path,
    data: file,
    options: {
      contentType: file.type || undefined,
    },
  }).result;

  const { url } = await getUrl({ path });
  return url.toString();
}
