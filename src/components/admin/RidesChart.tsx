
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface RidesChartProps {
  period: string;
}

const RidesChart = ({ period }: RidesChartProps) => {
  const { data: ridesStats, isLoading } = useQuery({
    queryKey: ['rides-stats', period],
    queryFn: async () => {
      const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);
      const { data: rides, error } = await supabase
        .from('rides')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Créer un objet pour stocker les comptages par jour
      const stats = rides.reduce((acc: Record<string, number>, ride) => {
        const date = format(new Date(ride.created_at), 'dd/MM/yyyy');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      // Remplir les jours manquants avec des zéros
      const data = [];
      let currentDate = startDate;
      while (currentDate <= new Date()) {
        const dateStr = format(currentDate, 'dd/MM/yyyy');
        data.push({
          date: dateStr,
          count: stats[dateStr] || 0,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return data;
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
          <BarChart data={ridesStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Nombre de trajets" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RidesChart;
