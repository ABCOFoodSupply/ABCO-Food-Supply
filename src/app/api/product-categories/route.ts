import { NextRequest } from "next/server";
import { GET as handlerGET, POST as handlerPOST, PATCH as handlerPATCH, DELETE as handlerDELETE } from "../categories/route";

/**
 * Backward compatibility alias: redirects requests to unified /api/categories
 */
export async function GET(req: NextRequest) {
  return handlerGET(req);
}

export async function POST(req: NextRequest) {
  return handlerPOST(req);
}

export async function PATCH(req: NextRequest) {
  return handlerPATCH(req);
}

export async function DELETE(req: NextRequest) {
  return handlerDELETE(req);
}
