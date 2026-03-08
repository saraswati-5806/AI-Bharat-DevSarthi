import { PutObjectCommand, S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { extractText } from "unpdf";

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

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const bufferForS3 = Buffer.from(arrayBuffer);
    
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const bucketName = process.env.SATHI_AWS_BUCKET_NAME || "devsathi-student-notes-2026";

    // 1. 📤 Upload
    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: bufferForS3,
      ContentType: file.type,
    }));

    // 2. 🔗 Preview URL
    const getCommand = new GetObjectCommand({ Bucket: bucketName, Key: fileName });
    const viewUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });

    // 3. 🧠 Better Extraction
    let extractedText = "";
    if (file.type === "application/pdf") {
      try {
        const { text } = await extractText(arrayBuffer);
        // Clean up the text: remove extra whitespace and non-ASCII junk
        extractedText = text.join(" ").replace(/\s+/g, ' ').trim();
      } catch (e) {
        extractedText = "Error parsing PDF text.";
      }
    } else {
      extractedText = Buffer.from(arrayBuffer).toString('utf-8');
    }

    return NextResponse.json({ 
      success: true, 
      fileName, 
      viewUrl, 
      // 🚀 Increased to 50k chars - Nova Lite can easily handle this
      extractedText: extractedText.substring(0, 50000) 
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}