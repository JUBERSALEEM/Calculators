import Link from "next/link";

export interface Crumb {
  href: string;
  label: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="pt-6 text-xs text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-ink hover:underline">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-1.5">
            <span aria-hidden="true" className="text-line-strong">
              /
            </span>
            {index === items.length - 1 ? (
              <span aria-current="page" className="text-ink-soft">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-ink hover:underline">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
