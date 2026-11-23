import { isListName, listEntries } from "@/lib/application/lists";

// One of the long option lists of the application form (see lib/application/lists.ts), as a JSON
// array of strings. The lists only change with a deploy, so the browser may keep its copy. Not
// "public": requests pass through the session proxy, which can attach cookies to the response.
export async function GET(_request: Request, { params }: { params: Promise<{ list: string }> }) {
  const { list } = await params;
  if (!isListName(list)) return new Response("Not found", { status: 404 });

  return Response.json(listEntries(list), {
    headers: { "Cache-Control": "private, max-age=86400" },
  });
}
