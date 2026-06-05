import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, password, grade, school } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "رمز عبور باید حداقل ۸ کاراکتر باشد" },
      { status: 400 }
    );
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "این ایمیل قبلاً ثبت شده است" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.user.create({
    data: {
      name,
      email,
      passwordHash,
      grade: grade ?? null,
      school: school ?? null,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
