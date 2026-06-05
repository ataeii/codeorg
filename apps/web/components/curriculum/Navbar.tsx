import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./SignOutButton";

export default async function Navbar() {
  const t = await getTranslations();
  const session = await auth();
  const role = session?.user?.role;

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          {t("common.appName")}
        </Link>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <Link href="/courses" className="text-sm text-gray-600 hover:text-blue-600">
                {t("nav.courses")}
              </Link>
              <Link href="/progress" className="text-sm text-gray-600 hover:text-blue-600">
                {t("nav.progress")}
              </Link>
              {(role === "TEACHER" || role === "ADMIN") && (
                <Link href="/classroom" className="text-sm text-gray-600 hover:text-blue-600">
                  {t("nav.classroom")}
                </Link>
              )}
              {role === "ADMIN" && (
                <Link href="/admin" className="text-sm text-gray-600 hover:text-blue-600">
                  {t("nav.admin")}
                </Link>
              )}
              <span className="text-sm text-gray-500">{session.user.name}</span>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                {t("common.login")}
              </Link>
              <Link
                href="/register"
                className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
              >
                {t("common.register")}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
