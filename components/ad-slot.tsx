import { integrations } from "@/lib/env";

interface Props {
  /** Logical placement, used for analytics and for reserving layout space. */
  placement: "below-result" | "end-of-article";
  className?: string;
}

/**
 * Reserved advertising slot.
 *
 * Nothing renders unless NEXT_PUBLIC_ADSENSE_CLIENT is configured and an
 * account has been approved, so there are no empty "advertisement" boxes and no
 * layout shift from a late-loading banner. The slot keeps a fixed height when
 * enabled, which is the main defence against cumulative layout shift.
 */
export function AdSlot({ placement, className }: Props) {
  if (!integrations.adsenseClient) return null;

  return (
    <aside
      aria-label="Advertisement"
      data-placement={placement}
      className={`min-h-[100px] overflow-hidden rounded-xl border border-line bg-paper-deep/40 ${className ?? ""}`}
    >
      <span className="block px-2 pt-1 text-[0.6rem] uppercase tracking-wider text-muted">Advertisement</span>
      {/* The AdSense unit is inserted here once the publisher ID is live. */}
    </aside>
  );
}
