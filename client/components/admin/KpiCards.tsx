"use client";

import { motion } from "motion/react";
import { Users, User, GraduationCap, HeartHandshake, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/lib/data/dashboardStats";

type StatCardProps = {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  accent?: boolean;
};

function StatCard({ label, value, sub, icon, iconBg, iconColor, accent }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex-1 rounded-xl p-5 min-w-0",
        accent ? "bg-admin-navy text-white border-transparent" : "bg-white text-foreground border-border border"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 36, height: 36, background: accent ? "rgba(255,255,255,0.08)" : iconBg }}
        >
          <span style={{ color: accent ? "#ffffff" : iconColor, display: "flex" }}>{icon}</span>
        </div>
      </div>
      <p className={cn("text-3xl font-bold leading-none mb-1", accent ? "text-white" : "text-foreground")}>{value}</p>
      <p className={cn("text-sm font-medium mb-1", accent ? "text-white/80" : "text-muted-foreground")}>{label}</p>
      {sub && <p className={cn("text-xs", accent ? "text-white/60" : "text-muted-foreground")}>{sub}</p>}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-3">{children}</p>
  );
}

function Divider() {
  return <div className="h-px bg-border my-6 w-full" />;
}

export function KpiCards({ stats }: { stats: DashboardStats }) {
  const formatCount = (count: number) => new Intl.NumberFormat().format(count);
  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div>
      <SectionHeading>Total Applications</SectionHeading>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex-1">
          <StatCard
            label="Total Applications"
            value={formatCount(stats.totalApplications)}
            icon={<Users size={17} />}
            iconBg="#eef1f6"
            iconColor="var(--color-admin-navy)"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex-1">
          <StatCard
            label="Total Hackers Applied"
            value={formatCount(stats.totalHackers)}
            icon={<User size={17} />}
            iconBg="#eff6ff"
            iconColor="#2563eb"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex-1">
          <StatCard
            label="Total Mentors Applied"
            value={formatCount(stats.totalMentors)}
            icon={<GraduationCap size={17} />}
            iconBg="#f5f3ff"
            iconColor="#7c3aed"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex-1">
          <StatCard
            label="Total Volunteers Applied"
            value={formatCount(stats.totalVolunteers)}
            icon={<HeartHandshake size={17} />}
            iconBg="#fff7ed"
            iconColor="#c2410c"
          />
        </motion.div>
      </div>

      <Divider />

      <SectionHeading>Acceptance</SectionHeading>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex-1">
          <StatCard
            label="Accepted Hackers"
            value={formatCount(stats.acceptedHackers)}
            icon={<User size={17} />}
            iconBg="#eff6ff"
            iconColor="#2563eb"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex-1">
          <StatCard
            label="Accepted Mentors"
            value={formatCount(stats.acceptedMentors)}
            icon={<GraduationCap size={17} />}
            iconBg="#f5f3ff"
            iconColor="#7c3aed"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex-1">
          <StatCard
            label="Accepted Volunteers"
            value={formatCount(stats.acceptedVolunteers)}
            icon={<HeartHandshake size={17} />}
            iconBg="#fff7ed"
            iconColor="#c2410c"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex-1">
          <StatCard
            label="Overall Acceptance Rate"
            value={formatPercent(stats.overallAcceptancePercentage)}
            icon={<TrendingUp size={17} />}
            iconBg="#f0fdf4"
            iconColor="#16a34a"
          />
        </motion.div>
      </div>
    </div>
  );
}

export default KpiCards;
