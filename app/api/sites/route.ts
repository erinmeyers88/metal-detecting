import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { randomUUID } from 'crypto';
import { siteCreateSchema, userIdSchema } from '@/app/lib/validation/site';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (userId) {
    const userIdResult = userIdSchema.safeParse(userId);
    if (!userIdResult.success) {
      return NextResponse.json({ error: 'Invalid userId.' }, { status: 400 });
    }
  }

  const rows = userId
    ? await prisma.$queryRaw<
        Array<{
          id: string;
          userId: string;
          name: string;
          notes: string | null;
          geojson: string | null;
          createdAt: Date;
          updatedAt: Date;
        }>
      >`
        SELECT
          "id",
          "userId",
          "name",
          "notes",
          ST_AsGeoJSON("geom") AS "geojson",
          "createdAt",
          "updatedAt"
        FROM "Site"
        WHERE "userId" = ${userId}
        ORDER BY "createdAt" DESC
      `
    : await prisma.$queryRaw<
        Array<{
          id: string;
          userId: string;
          name: string;
          notes: string | null;
          geojson: string | null;
          createdAt: Date;
          updatedAt: Date;
        }>
      >`
        SELECT
          "id",
          "userId",
          "name",
          "notes",
          ST_AsGeoJSON("geom") AS "geojson",
          "createdAt",
          "updatedAt"
        FROM "Site"
        ORDER BY "createdAt" DESC
      `;

  const data = rows.map((row) => ({
    ...row,
    geojson: row.geojson ? JSON.parse(row.geojson) : null,
  }));

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const body = (await request.json()) as unknown;
  const parsed = siteCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request body.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const id = randomUUID();
  const geojson = JSON.stringify(parsed.data.geojson);

  await prisma.$executeRaw`
    INSERT INTO "Site" ("id", "userId", "name", "notes", "geom", "createdAt", "updatedAt")
    VALUES (
      ${id},
      ${parsed.data.userId},
      ${parsed.data.name},
      ${parsed.data.notes ?? null},
      ST_SetSRID(ST_GeomFromGeoJSON(${geojson}), 4326),
      now(),
      now()
    )
  `;

  const created = await prisma.site.findUnique({
    where: { id },
  });

  return NextResponse.json({ data: created }, { status: 201 });
}
