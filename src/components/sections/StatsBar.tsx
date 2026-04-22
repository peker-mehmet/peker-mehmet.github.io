import { type Locale } from '@/lib/i18n';

type StatsBarDict = {
  home: {
    stat_publications: string;
    stat_scales: string;
    stat_years_experience: string;
    stat_active_projects: string;
  };
};

type StatsBarProps = {
  lang: Locale;
  dict: StatsBarDict;
  publicationCount: number;
  scaleCount: number;
  activeProjectCount: number;
  experienceStartYear?: number;
};

function StatItem({
  value,
  label,
  isLast,
}: {
  value: number;
  label: string;
  isLast: boolean;
}) {
  return (
    <div className={`
      flex-1 flex flex-col items-center justify-center py-6 px-4
      ${!isLast ? 'border-r border-warm-200' : ''}
    `}>
      <span className="font-display text-3xl sm:text-4xl font-bold text-navy-700 leading-none tabular-nums">
        {value}
      </span>
      <span className="mt-1.5 font-body text-xs font-medium text-slate-400 tracking-widest uppercase">
        {label}
      </span>
    </div>
  );
}

export default function StatsBar({
  dict,
  publicationCount,
  scaleCount,
  activeProjectCount,
  experienceStartYear = 2014,
}: StatsBarProps) {
  const yearsExperience = new Date().getFullYear() - experienceStartYear;

  const stats = [
    { value: publicationCount,    label: dict.home.stat_publications },
    { value: scaleCount,          label: dict.home.stat_scales },
    { value: yearsExperience,     label: dict.home.stat_years_experience },
    { value: activeProjectCount,  label: dict.home.stat_active_projects },
  ];

  return (
    <div className="bg-white border-y border-warm-200 shadow-card">
      <div className="container-main">
        <div className="flex divide-x divide-warm-200">
          {stats.map((stat, i) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              label={stat.label}
              isLast={i === stats.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
