import { CalendarCheck, MessageCircle, Search } from "lucide-react";
import { useTranslations } from "next-intl";

const steps = [
    { key: "search", Icon: Search },
    { key: "book", Icon: CalendarCheck },
    { key: "contact", Icon: MessageCircle },
] as const;

export default function HowItWorks() {
    const t = useTranslations("Landing.how");

    return (
        <section className="bg-muted">
            <div className="mx-auto w-full max-w-7xl px-4 py-16">
                <div className="mb-10 text-center">
                    <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t("title")}</h2>
                    <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
                </div>

                <ol className="grid gap-6 md:grid-cols-3">
                    {steps.map(({ key, Icon }, i) => (
                        <li key={key} className="relative rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                            <span className="absolute start-4 top-4 text-4xl font-bold text-primary/15">{i + 1}</span>
                            <span className="mx-auto mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                                <Icon size={26} />
                            </span>
                            <h3 className="mb-2 text-lg font-bold">{t(`steps.${key}.title`)}</h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">{t(`steps.${key}.desc`)}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}