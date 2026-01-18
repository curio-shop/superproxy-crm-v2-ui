import { Icon } from '@iconify/react';
import { useState } from 'react';

interface LeaderboardEntry {
  id: string;
  member_id: string;
  member_name: string;
  member_email: string;
  member_avatar_url: string;
  total_revenue: number;
  quotations_sent: number;
  deals_won: number;
  deals_won_value: number;
  invoices_collected: number;
  success_rate: number;
  activity_streak: number;
  response_time_hours: number;
  points_scored: number;
  rank: number;
  badges: string[];
}

type PeriodType = 'week' | 'month' | 'all_time';

const mockLeaderboardData: LeaderboardEntry[] = [
  {
    id: '1',
    member_id: '2',
    member_name: 'Melwyn Arrubio',
    member_email: 'arrubiomelwyn@gmail.com',
    member_avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    total_revenue: 245000,
    quotations_sent: 28,
    deals_won: 12,
    deals_won_value: 245000,
    invoices_collected: 10,
    success_rate: 42.9,
    activity_streak: 15,
    response_time_hours: 2.5,
    points_scored: 1250,
    rank: 1,
    badges: ['revenue_king', 'hot_streak', 'deal_closer'],
  },
  {
    id: '2',
    member_id: '1',
    member_name: 'Fiamma',
    member_email: 'fiamma@company.com',
    member_avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    total_revenue: 198000,
    quotations_sent: 22,
    deals_won: 9,
    deals_won_value: 198000,
    invoices_collected: 8,
    success_rate: 40.9,
    activity_streak: 12,
    response_time_hours: 3.2,
    points_scored: 980,
    rank: 2,
    badges: ['rising_star', 'speed_demon'],
  },
  {
    id: '3',
    member_id: '3',
    member_name: 'Sarah Johnson',
    member_email: 'sarah@fiamma.com',
    member_avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
    total_revenue: 156000,
    quotations_sent: 20,
    deals_won: 7,
    deals_won_value: 156000,
    invoices_collected: 7,
    success_rate: 35.0,
    activity_streak: 8,
    response_time_hours: 4.1,
    points_scored: 750,
    rank: 3,
    badges: ['deal_closer'],
  },
  {
    id: '4',
    member_id: '4',
    member_name: 'Mike Davis',
    member_email: 'mike@fiamma.com',
    member_avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
    total_revenue: 89000,
    quotations_sent: 15,
    deals_won: 4,
    deals_won_value: 89000,
    invoices_collected: 4,
    success_rate: 26.7,
    activity_streak: 5,
    response_time_hours: 5.8,
    points_scored: 420,
    rank: 4,
    badges: [],
  },
];

const badgeConfig = {
  hot_streak: {
    icon: 'solar:fire-bold',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    label: 'Hot Streak',
    description: '15+ days active',
  },
  rising_star: {
    icon: 'solar:graph-up-bold',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    label: 'Rising Star',
    description: 'Biggest improvement',
  },
  deal_closer: {
    icon: 'solar:handshake-bold',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    label: 'Deal Closer',
    description: '35%+ success rate',
  },
  speed_demon: {
    icon: 'solar:bolt-bold',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    label: 'Speed Demon',
    description: 'Fast response time',
  },
  revenue_king: {
    icon: 'solar:crown-bold',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    label: 'Revenue King',
    description: 'Highest revenue',
  },
};

const formatCurrency = (amount: number) => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
};

export default function Leaderboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const leaderboardData = mockLeaderboardData;
  const topThree = leaderboardData.slice(0, 3);
  const remaining = leaderboardData.slice(3);

  const totalTeamRevenue = leaderboardData.reduce((sum, entry) => sum + entry.total_revenue, 0);
  const totalDealsWon = leaderboardData.reduce((sum, entry) => sum + entry.deals_won, 0);

  const getPodiumStyles = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          gradient: 'from-amber-50 to-yellow-100',
          border: 'border-amber-200',
          ring: 'ring-amber-100',
          iconBg: 'bg-gradient-to-br from-amber-400 to-yellow-500',
          icon: 'solar:cup-star-bold',
          medal: '🥇',
          shadow: 'shadow-amber-200/50',
          height: 'h-64',
        };
      case 2:
        return {
          gradient: 'from-slate-100 to-slate-200',
          border: 'border-slate-300',
          ring: 'ring-slate-200',
          iconBg: 'bg-gradient-to-br from-slate-400 to-slate-500',
          icon: 'solar:medal-star-bold',
          medal: '🥈',
          shadow: 'shadow-slate-200/50',
          height: 'h-56',
        };
      case 3:
        return {
          gradient: 'from-orange-50 to-orange-100',
          border: 'border-orange-200',
          ring: 'ring-orange-100',
          iconBg: 'bg-gradient-to-br from-orange-400 to-orange-500',
          icon: 'solar:medal-ribbons-star-bold',
          medal: '🥉',
          shadow: 'shadow-orange-200/50',
          height: 'h-52',
        };
      default:
        return {
          gradient: 'from-white to-slate-50',
          border: 'border-slate-200',
          ring: 'ring-slate-100',
          iconBg: 'bg-slate-300',
          icon: 'solar:cup-bold',
          medal: '',
          shadow: 'shadow-slate-200/50',
          height: 'h-48',
        };
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg">
              <Icon icon="solar:cup-star-bold" width="20" className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Sales Leaderboard</h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Team performance • {formatCurrency(totalTeamRevenue)} • {totalDealsWon} deals won
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              {[
                { value: 'week' as PeriodType, label: 'Week' },
                { value: 'month' as PeriodType, label: 'Month' },
                { value: 'all_time' as PeriodType, label: 'All Time' },
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedPeriod === period.value
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>

            <button
              onClick={toggleExpanded}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Icon
                icon={isExpanded ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
                width="20"
                className="text-slate-400"
              />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topThree.map((entry) => {
              const styles = getPodiumStyles(entry.rank);
              const topPerformerRevenue = topThree[0].total_revenue;
              const percentage = (entry.total_revenue / topPerformerRevenue) * 100;

              return (
                <div
                  key={entry.id}
                  className={`relative bg-gradient-to-br ${styles.gradient} border ${styles.border} rounded-2xl p-6 ${styles.shadow} hover:shadow-lg transition-all duration-300 hover:scale-105 group ${styles.height} flex flex-col`}
                >
                  <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
                    {styles.medal}
                  </div>

                  <div className="flex flex-col items-center text-center flex-1">
                    <div className="relative mb-4">
                      <div className={`absolute inset-0 rounded-full ${styles.ring} ring-4 animate-pulse`}></div>
                      <div className="relative h-20 w-20 rounded-full overflow-hidden shadow-xl ring-4 ring-white">
                        <img
                          src={entry.member_avatar_url}
                          alt={entry.member_name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div
                        className={`absolute -bottom-2 -right-2 h-10 w-10 ${styles.iconBg} rounded-full flex items-center justify-center shadow-lg ring-4 ring-white`}
                      >
                        <Icon icon={styles.icon} width="18" className="text-white" />
                      </div>
                    </div>

                    <div className="mb-3">
                      <h4 className="text-lg font-bold text-slate-900 mb-1">{entry.member_name}</h4>
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        {entry.badges.slice(0, 2).map((badge) => {
                          const config = badgeConfig[badge as keyof typeof badgeConfig];
                          return (
                            <div
                              key={badge}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${config.bg} group/badge relative`}
                            >
                              <Icon icon={config.icon} width="12" className={config.color} />
                              <span className={`text-[10px] font-bold ${config.color}`}>
                                {config.label}
                              </span>
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                {config.description}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3 flex-1 flex flex-col justify-center w-full">
                      <div>
                        <p className="text-xs font-medium text-slate-600 mb-1">Total Revenue</p>
                        <p className="text-3xl font-bold text-slate-900">{formatCurrency(entry.total_revenue)}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-xs text-slate-600">Deals</p>
                          <p className="text-lg font-bold text-slate-900">{entry.deals_won}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Success</p>
                          <p className="text-lg font-bold text-slate-900">{entry.success_rate.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Streak</p>
                          <p className="text-lg font-bold text-slate-900">{entry.activity_streak}d</p>
                        </div>
                      </div>

                      {entry.rank !== 1 && (
                        <div className="pt-2">
                          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                            <span>Performance</span>
                            <span>{percentage.toFixed(0)}%</span>
                          </div>
                          <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-slate-900 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              );
            })}
          </div>

          {remaining.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-slate-200"></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Team Rankings</span>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>

              {remaining.map((entry) => {
                const topPerformerRevenue = topThree[0].total_revenue;
                const percentage = (entry.total_revenue / topPerformerRevenue) * 100;
                const isExpanded = expandedMember === entry.id;

                return (
                  <div key={entry.id} className="border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-all">
                    <button
                      onClick={() => setExpandedMember(isExpanded ? null : entry.id)}
                      className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-100 text-slate-700 font-bold text-sm flex-shrink-0">
                        #{entry.rank}
                      </div>

                      <div className="h-10 w-10 rounded-full overflow-hidden shadow-sm flex-shrink-0 ring-2 ring-white">
                        <img
                          src={entry.member_avatar_url}
                          alt={entry.member_name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-slate-900 truncate">{entry.member_name}</span>
                          {entry.badges.length > 0 && (
                            <div className="flex items-center gap-1">
                              {entry.badges.slice(0, 2).map((badge) => {
                                const config = badgeConfig[badge as keyof typeof badgeConfig];
                                return (
                                  <div
                                    key={badge}
                                    className={`${config.bg} p-1 rounded`}
                                    title={config.label}
                                  >
                                    <Icon icon={config.icon} width="10" className={config.color} />
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-slate-600">{formatCurrency(entry.total_revenue)} revenue</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-600">{entry.deals_won} deals</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-600">{entry.success_rate.toFixed(1)}% success</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="hidden md:block w-32">
                          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                            <span>{percentage.toFixed(0)}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="text-xl font-bold text-slate-400">
                          {entry.points_scored}
                          <span className="text-xs text-slate-400 ml-1">pts</span>
                        </div>

                        <Icon
                          icon={isExpanded ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
                          width="20"
                          className="text-slate-400"
                        />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 bg-slate-50 border-t border-slate-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon icon="solar:document-text-bold" width="14" className="text-blue-500" />
                              <span className="text-xs font-medium text-slate-600">Quotations</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900">{entry.quotations_sent}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon icon="solar:bill-check-bold" width="14" className="text-emerald-500" />
                              <span className="text-xs font-medium text-slate-600">Invoices</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900">{entry.invoices_collected}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon icon="solar:fire-bold" width="14" className="text-orange-500" />
                              <span className="text-xs font-medium text-slate-600">Streak</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900">{entry.activity_streak} days</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon icon="solar:clock-circle-bold" width="14" className="text-amber-500" />
                              <span className="text-xs font-medium text-slate-600">Response</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900">{entry.response_time_hours.toFixed(1)}h</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
