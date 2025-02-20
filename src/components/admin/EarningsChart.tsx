
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
      const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);
      const { data: earnings, error } = await supabase
        .from('platform_earnings')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Créer un objet pour stocker les gains par jour
      const stats = earnings.reduce((acc: Record<string, number>, earning) => {
        const date = format(new Date(earning.created_at), 'dd/MM/yyyy');
        acc[date] = (acc[date] || 0) + Number(earning.amount);
        return acc;
      }, {});

      // Remplir les jours manquants avec des zéros
      const data = [];
      let currentDate = startDate;
      while (currentDate <= new Date()) {
        const dateStr = format(currentDate, 'dd/MM/yyyy');
        data.push({
          date: dateStr,
          amount: stats[dateStr] || 0,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return {
        byDate: data,
        total: earnings.reduce((sum, earning) => sum + Number(earning.amount), 0),
      };
    },
  });

  return (
    <div className="h-[300px] w-full">
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={earningsStats?.byDate}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              angle={-45}
              textAnchor="end"
              height={60}
            />
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
