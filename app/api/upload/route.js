import { PutObjectCommand, S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { extractText } from "unpdf";

// 🎯 INITIALIZING WITH SATHI PREFIX
const s3Client = new S3Client({
  region: process.env.SATHI_AWS_REGION || "us-east-1", 
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_SATHI_AWS_ACCESS_KEY_ID?.trim() || "",
    secretAccessKey: process.env.NEXT_PUBLIC_SATHI_AWS_SECRET_ACCESS_KEY?.trim() || "",
  },
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. Prepare Buffers
    const arrayBuffer = await file.arrayBuffer();
    const bufferForS3 = Buffer.from(arrayBuffer.slice(0));
    const bufferForAI = arrayBuffer.slice(0);

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const bucketName = process.env.SATHI_AWS_BUCKET_NAME || "devsathi-student-notes-2026";

    // 2. 📤 Upload to S3
    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: bufferForS3,
      ContentType: file.type,
    }));

    // 3. 🔗 Generate Presigned URL for Preview (Valid for 1 hour)
    const getCommand = new GetObjectCommand({ Bucket: bucketName, Key: fileName });
    const viewUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });

    // 4. 🧠 Extract Text for AI Context
    let extractedText = "";
    if (file.type === "application/pdf") {
      try {
        const { text } = await extractText(bufferForAI);
        extractedText = text.join("\n\n");
      } catch (e) {
        extractedText = "Error parsing PDF text.";
      }
    } else {
      extractedText = Buffer.from(bufferForAI).toString('utf-8');
    }

    return NextResponse.json({ 
      success: true, 
      fileName, 
      viewUrl, 
      extractedText: extractedText.substring(0, 15000) 
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}