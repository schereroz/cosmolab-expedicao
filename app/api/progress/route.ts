import { eq } from "drizzle-orm";
import { gameStates } from "../../../db/schema";
import { getDb } from "../../../db";

export async function GET(request: Request) {
  const familyId = request.headers.get("x-cosmolab-family");
  if (!familyId || familyId.length > 80) return Response.json({ error: "Identificador inválido" }, { status: 400 });
  const rows = await getDb().select().from(gameStates).where(eq(gameStates.familyId, familyId)).limit(1);
  return Response.json({ profile: rows[0] ? JSON.parse(rows[0].profileJson) : null });
}

export async function POST(request: Request) {
  const familyId = request.headers.get("x-cosmolab-family");
  if (!familyId || familyId.length > 80) return Response.json({ error: "Identificador inválido" }, { status: 400 });
  const payload = await request.json();
  const profileJson = JSON.stringify(payload.profile ?? {});
  if (profileJson.length > 20_000) return Response.json({ error: "Perfil excede o limite" }, { status: 413 });
  await getDb().insert(gameStates).values({ familyId, profileJson }).onConflictDoUpdate({ target: gameStates.familyId, set: { profileJson, updatedAt: new Date().toISOString() } });
  return Response.json({ saved: true });
}
