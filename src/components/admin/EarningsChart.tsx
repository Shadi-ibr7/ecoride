
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const EarningsChart = () => {
  const { data: earningsStats, isLoading } = useQuery({
    queryKey: ['earnings-stats'],
    queryFn: async () => {
      const { data: earnings, error } = await supabase
        .from('platform_earnings')
        .select('*')
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
    <Card>
      <CardHeader>
        <CardTitle>Gains de la plateforme</CardTitle>
        <CardDescription>
          Total des gains : {earningsStats?.total || 0} crédits
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
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
      </CardContent>
    </Card>
  );
};

export default EarningsChart;
