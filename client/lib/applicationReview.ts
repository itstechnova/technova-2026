export const STATUS_STYLES = {
  Accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
  Waitlisted: "bg-blue-50 text-blue-700 border-blue-200",
};

export function filterAndSortApplications<T extends { acceptanceStatus: string; applicationDate: string }>(
  applications: T[],
  status: string,
  newestFirst: boolean,
): T[] {
  const rows = status === "All"
    ? applications
    : applications.filter((application) => application.acceptanceStatus === status);

  return [...rows].sort((a, b) => {
    const difference = new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
    return newestFirst ? difference : -difference;
  });
}
