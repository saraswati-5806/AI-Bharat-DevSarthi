import { S3Client, ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = "devsathi-student-notes-2026";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fileKey = searchParams.get("key");

  try {
    // 🔵 CASE 1: Fetch content for the Code Editor (Panel 2)
    if (fileKey) {
      const getCommand = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
      });
      const response = await s3Client.send(getCommand);
      const content = await response.Body.transformToString();
      return NextResponse.json({ content });
    }

    // 🟢 CASE 2: List all files for the Sidebar Explorer
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
    });

    const { Contents } = await s3Client.send(listCommand);

    const files = await Promise.all((Contents || []).map(async (obj) => {
      let url = "";
      const isPdf = obj.Key.toLowerCase().endsWith('.pdf');
      
      // Generate a temporary Signed URL for PDFs so Panel 1 can display them
      if (isPdf) {
        const getCommand = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: obj.Key,
        });
        url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
      }

      return {
        id: obj.ETag?.replace(/"/g, "") || obj.Key,
        key: obj.Key,
        name: obj.Key.split('/').filter(Boolean).pop() || obj.Key,
        url: url, // This goes to the Source Reader
        type: obj.Key.endsWith('/') ? 'folder' : (isPdf ? 'pdf' : 'code'),
      };
    }));

    return NextResponse.json({ files });
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { key, content = "" } = await request.json();
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME, 
      Key: key, 
      Body: content,
      ContentType: key.endsWith('/') ? 'application/x-directory' : (key.endsWith('.pdf') ? 'application/pdf' : 'text/plain'),
    });

    await s3Client.send(command);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("S3 API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { key } = await request.json();
    
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}