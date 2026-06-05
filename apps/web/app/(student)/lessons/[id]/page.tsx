import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import LessonClient from "./LessonClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) redirect("/login");

  const lesson = await db.lesson.findUnique({
    where: { id },
    include: { hints: { orderBy: { order: "asc" } } },
  });

  if (!lesson) notFound();

  const progress = session.user.id
    ? await db.progress.findUnique({
        where: { userId_lessonId: { userId: session.user.id, lessonId: id } },
      })
    : null;

  const { remark } = await import("remark");
  const { default: remarkHtml } = await import("remark-html");
  const processed = await remark().use(remarkHtml).process(lesson.instructions);
  const instructionsHtml = processed.toString();

  return (
    <LessonClient
      lesson={lesson}
      initialProgress={progress}
      instructionsHtml={instructionsHtml}
    />
  );
}
