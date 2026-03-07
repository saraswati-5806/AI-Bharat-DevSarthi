import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: process.env.SATHI_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_SATHI_AWS_ACCESS_KEY_ID?.trim() || "",
    secretAccessKey: process.env.NEXT_PUBLIC_SATHI_AWS_SECRET_ACCESS_KEY?.trim() || "",
  },
});

const BUCKET_NAME = process.env.SATHI_AWS_BUCKET_NAME || "devsathi-student-notes-2026";

export async function GET(request) {
  try {
    const listCommand = new ListObjectsV2Command({ Bucket: BUCKET_NAME });
    const { Contents } = await s3Client.send(listCommand);

    const files = await Promise.all((Contents || []).map(async (obj) => {
      const isPdf = obj.Key.toLowerCase().endsWith('.pdf');
      let url = "";
      
      if (isPdf) {
        const getCommand = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: obj.Key });
        url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
      }

      return {
        id: obj.ETag?.replace(/"/g, "") || obj.Key,
        key: obj.Key,
        name: obj.Key.split('/').pop(),
        url: url,
        size: (obj.Size / 1024 / 1024).toFixed(2) + " MB",
        date: new Date(obj.LastModified).toLocaleDateString()
      };
    }));

    return NextResponse.json({ files });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}