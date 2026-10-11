import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const fileName = (formData.get("fileName") as string) || "product-image";
    const folder = (formData.get("folder") as string) || "/afs-catalog";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "private_cMRsnErqQwWxVhsUR5CWZGkDcnY=";
    const base64Auth = Buffer.from(`${privateKey}:`).toString("base64");

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64File = buffer.toString("base64");

    // Upload directly to ImageKit API
    const ikFormData = new FormData();
    ikFormData.append("file", `data:${file.type};base64,${base64File}`);
    ikFormData.append("fileName", file.name || `${fileName}.png`);
    ikFormData.append("folder", folder);
    ikFormData.append("useUniqueFileName", "true");

    const ikRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Basic ${base64Auth}`,
      },
      body: ikFormData,
    });

    if (!ikRes.ok) {
      const errorText = await ikRes.text();
      console.error("ImageKit upload error:", errorText);
      return NextResponse.json(
        { error: "Failed to upload image to ImageKit", details: errorText },
        { status: ikRes.status }
      );
    }

    const ikData = await ikRes.json();
    return NextResponse.json({
      success: true,
      url: ikData.url,
      fileId: ikData.fileId,
      name: ikData.name,
      thumbnailUrl: ikData.thumbnailUrl,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal upload error";
    console.error("Image upload exception:", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
