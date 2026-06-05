import { PrismaClient, Role, Difficulty } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@codeorg.ir" },
    update: {},
    create: {
      name: "مدیر سیستم",
      email: "admin@codeorg.ir",
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  const teacherPassword = await bcrypt.hash("teacher123", 12);
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@codeorg.ir" },
    update: {},
    create: {
      name: "استاد علوی",
      email: "teacher@codeorg.ir",
      passwordHash: teacherPassword,
      role: Role.TEACHER,
      school: "دبستان نمونه تهران",
    },
  });

  const studentPassword = await bcrypt.hash("student123", 12);
  await prisma.user.upsert({
    where: { email: "student@codeorg.ir" },
    update: {},
    create: {
      name: "علی احمدی",
      email: "student@codeorg.ir",
      passwordHash: studentPassword,
      role: Role.STUDENT,
      grade: 5,
      school: "دبستان نمونه تهران",
    },
  });

  const course = await prisma.course.upsert({
    where: { slug: "cs-fundamentals" },
    update: {},
    create: {
      slug: "cs-fundamentals",
      title: "مبانی علوم کامپیوتر",
      description: "یادگیری مفاهیم پایه برنامه‌نویسی با بلاک‌های بصری",
      difficulty: Difficulty.BEGINNER,
      gradeMin: 3,
      gradeMax: 6,
      order: 1,
    },
  });

  const lesson1 = await prisma.lesson.upsert({
    where: { id: "lesson-sequences-1" },
    update: {},
    create: {
      id: "lesson-sequences-1",
      courseId: course.id,
      order: 1,
      title: "دنباله‌ها: مرحله‌به‌مرحله",
      instructions: `## دنباله‌ها چیستند؟

کامپیوترها دستورالعمل‌ها را یکی پس از دیگری اجرا می‌کنند.

**هدف:** کاراکتر را به ستاره برسان!

1. از بلاک **"حرکت به جلو"** استفاده کن
2. بلاک‌ها را به ترتیب مناسب بچین
3. دکمه **"اجرای کد"** را بزن`,
      starterXml: `<xml xmlns="https://developers.google.com/blockly/xml"></xml>`,
      hints: {
        create: [
          { order: 1, text: "ابتدا یک بلاک «حرکت به جلو» اضافه کن." },
          { order: 2, text: "بلاک‌ها را به ترتیب از بالا به پایین بچین." },
          { order: 3, text: "برای رسیدن به ستاره به ۳ حرکت نیاز داری." },
        ],
      },
    },
  });

  const lesson2 = await prisma.lesson.upsert({
    where: { id: "lesson-loops-1" },
    update: {},
    create: {
      id: "lesson-loops-1",
      courseId: course.id,
      order: 2,
      title: "حلقه‌ها: تکرار دستورات",
      instructions: `## حلقه‌ها چه کاری می‌کنند؟

حلقه‌ها به ما اجازه می‌دهند یک دستور را چندین بار تکرار کنیم.

**هدف:** با کمترین تعداد بلاک، ستاره را جمع‌آوری کن!

از بلاک **"تکرار ... بار"** برای ساده‌تر کردن برنامه‌ات استفاده کن.`,
      starterXml: `<xml xmlns="https://developers.google.com/blockly/xml"></xml>`,
      hints: {
        create: [
          { order: 1, text: "از بلاک «تکرار» در دسته‌بندی «حلقه‌ها» استفاده کن." },
          { order: 2, text: "داخل حلقه، بلاک حرکت را قرار بده." },
        ],
      },
    },
  });

  await prisma.class.upsert({
    where: { id: "class-demo-1" },
    update: {},
    create: {
      id: "class-demo-1",
      teacherId: teacher.id,
      name: "کلاس پنجم الف",
      joinCode: "DEMO2024",
    },
  });

  console.log("✅ Seed complete!");
  console.log(`   Admin:   admin@codeorg.ir / admin123`);
  console.log(`   Teacher: teacher@codeorg.ir / teacher123`);
  console.log(`   Student: student@codeorg.ir / student123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
