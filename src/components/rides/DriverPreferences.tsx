
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

type DriverPreferencesProps = {
  preferences: string[];
};

const DriverPreferences = ({ preferences }: DriverPreferencesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Préférences du conducteur</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {preferences.map((preference, index) => (
            <li key={index} className="flex items-center space-x-2 text-gray-600">
              <span>• {preference}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default DriverPreferences;
