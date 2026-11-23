import { InfoCard, textLink } from "@/components/portal/PortalPage";
import { SUPPORT_EMAIL } from "@/lib/application/config";

/** The guide beside the form (Figma frame 05), on screens wide enough to keep the form at full width. */
export function FormAside() {
  return (
    <aside className="hidden w-[260px] shrink-0 flex-col gap-2 2xl:flex">
      <InfoCard eyebrow="Application guide" title="Save and return later">
        Your draft is saved on this device until you submit it.
      </InfoCard>
      <InfoCard eyebrow="Need support?" title="Need help?">
        <a href={`mailto:${SUPPORT_EMAIL}`} className={textLink}>
          {SUPPORT_EMAIL}
        </a>
      </InfoCard>
    </aside>
  );
}
