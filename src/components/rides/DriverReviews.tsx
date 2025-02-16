
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Driver } from '@/types/ride';

type DriverReviewsProps = {
  driver: Driver;
};

const DriverReviews = ({ driver }: DriverReviewsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Avis sur {driver.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {driver.reviews.map(review => (
          <div key={review.id} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{review.author}</span>
              <div className="flex items-center text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1">{review.rating.toFixed(1)}</span>
              </div>
            </div>
            <p className="text-gray-600">{review.comment}</p>
            <p className="text-sm text-gray-500 mt-1">
              {format(new Date(review.date), 'PP', { locale: fr })}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DriverReviews;
