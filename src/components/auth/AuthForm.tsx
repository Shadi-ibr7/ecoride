
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AuthForm = () => {
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    await signIn.mutateAsync({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    await signUp.mutateAsync({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      username: formData.get('username') as string,
      fullName: formData.get('fullName') as string,
    });
    setIsLoading(false);
  };

  return (
    <Card className="w-[400px]">
      <Tabs defaultValue="signin">
        <CardHeader>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input id="signin-email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Mot de passe</Label>
                <Input id="signin-password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-username">Nom d'utilisateur</Label>
                <Input id="signup-username" name="username" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-fullname">Nom complet</Label>
                <Input id="signup-fullname" name="fullName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Mot de passe</Label>
                <Input id="signup-password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Création..." : "Créer un compte"}
              </Button>
            </form>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
