
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2 } from "lucide-react";

interface EarningsChartProps {
  period: string;
}

const EarningsChart = ({ period }: EarningsChartProps) => {
  const { data: earningsStats, isLoading } = useQuery({
    queryKey: ['earnings-stats', period],
    queryFn: async () => {
      const { data: earnings, error } = await supabase
        .from('platform_earnings')
        .select('*')
        .gte('created_at', new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      const stats = earnings.reduce((acc: Record<string, number>, earning) => {
        const date = format(new Date(earning.created_at), 'dd/MM/yyyy');
        acc[date] = (acc[date] || 0) + Number(earning.amount);
        return acc;
      }, {});

      return {
        byDate: Object.entries(stats).map(([date, amount]) => ({
          date,
          amount,
        })),
        total: earnings.reduce((sum, earning) => sum + Number(earning.amount), 0),
      };
    },
  });

  return (
    <div className="h-[300px]">
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={earningsStats?.byDate}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" name="Crédits gagnés" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default EarningsChart;
