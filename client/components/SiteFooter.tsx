import { LogoMark, heading } from '@/components/portal/ui'
import { SUPPORT_EMAIL } from '@/lib/application/config'

// The site footer (Figma "08 · Footer / #contact", node 125:1306). Its background is a see-through
// fade: place it over the page's artwork, not on a bare page.

/** The page's content column: at most 1080px of content, with gutters that grow with the screen. */
export const contentWidth = 'mx-auto w-full max-w-[1208px] px-6 sm:px-10 lg:px-16'

/** The top bar's backing: no solid bar, just the page darkened at the very top so the links stay legible. */
export const headerShade = 'bg-linear-to-b from-tn-bg/75 via-tn-bg/35 to-transparent'

/** The top bar's row, on the content column and the same height on every page. */
export const headerRow = `${contentWidth} flex h-[68px] items-center justify-between gap-4 lg:h-[84px]`

const LINKS = [
  { label: 'MLH Code of Conduct', href: 'https://mlh.io/code-of-conduct' },
  { label: 'MLH Privacy Policy', href: 'https://mlh.io/privacy' },
  { label: 'Contest rules', href: 'https://github.com/MLH/mlh-policies/blob/main/standard-hackathon-rules.md' },
]

const link =
  'inline-flex min-h-11 items-center rounded-sm text-tn-cyan hover:text-tn-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

export function SiteFooter() {
  return (
    // No hard top edge: the artwork fades into the footer's dark tint.
    <footer id="contact" className="bg-linear-to-b from-transparent via-tn-bg/55 via-40% to-tn-bg/85 text-tn-ink">
      <div className={`${contentWidth} flex flex-col items-start gap-5 pt-24 pb-10 lg:gap-8 lg:pt-32 lg:pb-[52px]`}>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
          <span className="flex items-center gap-7 lg:w-[600px]">
            <LogoMark size={48} />
            <span className={`${heading} text-4xl leading-[1.08]`}>TechNova</span>
          </span>
          <a href={`mailto:${SUPPORT_EMAIL}`} className={`${link} text-xl leading-[1.35]`}>
            {SUPPORT_EMAIL}
          </a>
        </div>

        <ul className="-my-2.5 flex flex-wrap gap-x-8 text-lg leading-[1.45]">
          {LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${link} underline decoration-from-font underline-offset-4`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <p className="leading-[1.45] text-tn-muted">Photography and filming will take place at TechNova.</p>
      </div>
    </footer>
  )
}
