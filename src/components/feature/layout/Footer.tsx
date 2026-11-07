import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
    const t = useTranslations("Landing.footer");
    const tNav = useTranslations("Navbar");
    const tEnums = useTranslations("Enums");

    const linkClass = "text-sm text-muted-foreground transition-colors hover:text-foreground";

    return (
        <footer className="mt-auto border-t border-border bg-card">
            <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
                <div className="lg:col-span-2">
                    <Link href="/" className="text-xl font-bold text-primary">Dealora</Link>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{t("tagline")}</p>
                </div>

                <nav aria-label={t("explore")}>
                    <h3 className="mb-3 text-sm font-semibold text-foreground">{t("explore")}</h3>
                    <ul className="flex flex-col gap-2">
                        <li><Link href="/" className={linkClass}>{tNav("home")}</Link></li>
                        <li><Link href="/properties" className={linkClass}>{tNav("properties")}</Link></li>
                        <li><Link href={{ pathname: "/properties", query: { purpose: "sale" } }} className={linkClass}>{tEnums("purpose.sale")}</Link></li>
                        <li><Link href={{ pathname: "/properties", query: { purpose: "rent" } }} className={linkClass}>{tEnums("purpose.rent")}</Link></li>
                    </ul>
                </nav>

                <nav aria-label={t("account")}>
                    <h3 className="mb-3 text-sm font-semibold text-foreground">{t("account")}</h3>
                    <ul className="flex flex-col gap-2">
                        <li><Link href="/login" className={linkClass}>{tNav("login")}</Link></li>
                        <li><Link href="/register" className={linkClass}>{tNav("register")}</Link></li>
                    </ul>
                </nav>
            </div>

            <div className="border-t border-border py-5 text-center text-sm text-muted-foreground">
                © Dealora. {t("rights")}
            </div>
        </footer>
    );
}