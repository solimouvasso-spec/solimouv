import Link from "next/link";

type HeroAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

export default function PageHero({
  eyebrow,
  title,
  description,
  actions = [],
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: HeroAction[];
}) {
  return (
    <header className="app-hero" data-reveal>
      <p className="app-hero__eyebrow">{eyebrow}</p>
      <h1 className="app-hero__title">{title}</h1>
      <p className="app-hero__description">{description}</p>
      {actions.length > 0 ? (
        <div className="app-hero__actions stagger-list">
          {actions.map((action, index) => (
            <Link
              key={action.href}
              href={action.href}
              className={`app-button ${
                action.variant === "secondary"
                  ? "app-button--secondary"
                  : "app-button--primary"
              }`}
              data-reveal
              style={{ ["--stagger-index" as string]: index }}
            >
              {action.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
