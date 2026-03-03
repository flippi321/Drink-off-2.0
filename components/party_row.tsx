export default function PartyRow({ party }: { party: Party }) {
  const archived = party.status === "archived";

  return (
    <Link
      href={`/parties/${party.party_id}`}
      className={[
        "block rounded-2xl border p-4 transition",
        "active:scale-[0.99]",
        archived
          ? "opacity-55 bg-foreground/5"
          : "hover:bg-foreground/5",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        <div
          className={[
            "h-12 w-12 rounded-xl border bg-foreground/5 overflow-hidden shrink-0",
            archived ? "grayscale" : "",
          ].join(" ")}
        >
          {party.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={party.image_url}
              alt={party.name}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold truncate">{party.name}</p>
            {archived && (
              <span className="text-[11px] px-2 py-0.5 rounded-full border bg-background/60">
                Archived
              </span>
            )}
          </div>

          <div className="mt-0.5 text-xs text-foreground/70 flex items-center gap-2">
            <span className="truncate">Code: {party.code}</span>
            <span className="opacity-60">•</span>
            <span className="truncate">
              {new Date(party.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Chevron-ish affordance */}
        <div className={["pt-1 text-foreground/60", archived ? "opacity-60" : ""].join(" ")}>
          <span aria-hidden>›</span>
        </div>
      </div>
    </Link>
  );
}