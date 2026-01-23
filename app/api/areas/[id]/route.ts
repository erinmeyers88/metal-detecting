import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { areaIdSchema, areaUpdateSchema } from '@/app/lib/validation/area';

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, { params }: Params) {
  const idResult = areaIdSchema.safeParse(params.id);
  if (!idResult.success) {
    return NextResponse.json({ error: 'Invalid area id.' }, { status: 400 });
  }

  const area = await prisma.area.findUnique({
    where: { id: idResult.data },
  });

  if (!area) {
    return NextResponse.json({ error: 'Area not found.' }, { status: 404 });
  }

  const rows = await prisma.$queryRaw<
    Array<{
      geojson: string | null;
    }>
  >`
    SELECT ST_AsGeoJSON("geom") AS "geojson"
    FROM "Area"
    WHERE "id" = ${idResult.data}
    LIMIT 1
  `;

  const geojson = rows[0]?.geojson ? JSON.parse(rows[0].geojson) : null;

  return NextResponse.json({
    data: {
      ...area,
      geojson,
    },
  });
}

export async function PATCH(request: Request, { params }: Params) {
  const idResult = areaIdSchema.safeParse(params.id);
  if (!idResult.success) {
    return NextResponse.json({ error: 'Invalid area id.' }, { status: 400 });
  }

  const body = (await request.json()) as unknown;
  const parsed = areaUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request body.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.area.findUnique({
    where: { id: idResult.data },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Area not found.' }, { status: 404 });
  }

  if (parsed.data.geojson) {
    const geojson = JSON.stringify(parsed.data.geojson);
    await prisma.$executeRaw`
      UPDATE "Area"
      SET
        "geom" = ST_SetSRID(ST_GeomFromGeoJSON(${geojson}), 4326),
        "updatedAt" = now()
      WHERE "id" = ${idResult.data}
    `;
  }

  const updated = await prisma.area.update({
    where: { id: idResult.data },
    data: {
      name: parsed.data.name ?? existing.name,
      notes: parsed.data.notes ?? existing.notes,
    },
  });

  return NextResponse.json({ data: updated });
}

export async function DELETE(_request: Request, { params }: Params) {
  const idResult = areaIdSchema.safeParse(params.id);
  if (!idResult.success) {
    return NextResponse.json({ error: 'Invalid area id.' }, { status: 400 });
  }

  const existing = await prisma.area.findUnique({
    where: { id: idResult.data },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Area not found.' }, { status: 404 });
  }

  await prisma.area.delete({
    where: { id: idResult.data },
  });

  return NextResponse.json({ data: { id: idResult.data } });
}
