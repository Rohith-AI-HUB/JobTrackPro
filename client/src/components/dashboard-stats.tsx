import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, UserCheck, Trophy, TrendingUp } from "lucide-react";

interface DashboardStats {
  total: number;
  applied: number;
  interviewing: number;
  offers: number;
  rejected: number;
  responseRate: number;
}

export default function DashboardStats() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-dark mb-6">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-dark mb-6">Dashboard Overview</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Failed to load statistics</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Applications",
      value: stats.total,
      icon: FileText,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Interviewing",
      value: stats.interviewing,
      icon: UserCheck,
      bgColor: "bg-orange-100",
      iconColor: "text-warning",
    },
    {
      title: "Offers",
      value: stats.offers,
      icon: Trophy,
      bgColor: "bg-green-100",
      iconColor: "text-success",
    },
    {
      title: "Response Rate",
      value: `${stats.responseRate}%`,
      icon: TrendingUp,
      bgColor: "bg-emerald-100",
      iconColor: "text-secondary",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-text-dark mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-text-dark mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
