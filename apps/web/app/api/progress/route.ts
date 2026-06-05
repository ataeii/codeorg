import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get("lessonId");

  if (lessonId) {
    const progress = await db.progress.findUnique({
      where: { userId_lessonId: { userId: session.user.id, lessonId } },
    });
    return NextResponse.json(progress);
  }

  const allProgress = await db.progress.findMany({
    where: { userId: session.user.id },
    include: { lesson: { select: { title: true, courseId: true } } },
  });

  return NextResponse.json(allProgress);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { lessonId, savedXml, completed } = body;

  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  const existing = await db.progress.findUnique({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
  });

  const isCompleted = completed ?? existing?.completed ?? false;

  const progress = await db.progress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
    update: {
      savedXml: savedXml ?? existing?.savedXml,
      attempts: { increment: 1 },
      completed: isCompleted,
      completedAt: isCompleted && !existing?.completed ? new Date() : existing?.completedAt,
    },
    create: {
      userId: session.user.id,
      lessonId,
      savedXml,
      attempts: 1,
      completed: isCompleted,
      completedAt: isCompleted ? new Date() : null,
    },
  });

  return NextResponse.json(progress);
}
