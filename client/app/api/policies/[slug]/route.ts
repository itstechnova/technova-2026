import { POLICIES, isPolicySlug } from "@/lib/application/policies";

// The Markdown of one of the known policy documents, for the popup in the application form.
// Only slugs listed in POLICIES are fetched, and the result is cached for a day.
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isPolicySlug(slug)) return new Response("Not found", { status: 404 });

  try {
    const upstream = await fetch(POLICIES[slug].source, { next: { revalidate: 86400 } });
    if (!upstream.ok) throw new Error(`upstream responded ${upstream.status}`);
    return new Response(await upstream.text(), {
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  } catch (error) {
    console.error(`policies/${slug}: could not load the document`, error);
    return new Response("Could not load this document.", { status: 502 });
  }
}
