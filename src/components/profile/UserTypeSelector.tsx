
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Database } from '@/types/database.types';

type UserType = NonNullable<Database['public']['Tables']['profiles']['Row']['user_type']>;

interface UserTypeSelectorProps {
  userType: UserType;
  onUserTypeChange: (value: UserType) => void;
}

const UserTypeSelector = ({ userType, onUserTypeChange }: UserTypeSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Type d'utilisateur</CardTitle>
        <CardDescription>
          Choisissez votre rôle sur la plateforme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={userType} onValueChange={onUserTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez votre type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="passenger">Passager</SelectItem>
            <SelectItem value="driver">Conducteur</SelectItem>
            <SelectItem value="both">Les deux</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default UserTypeSelector;

