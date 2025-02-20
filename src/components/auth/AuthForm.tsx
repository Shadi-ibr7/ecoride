
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "sonner";

type AuthFormProps = {
  type: 'login' | 'register';
};

const AuthForm = ({ type }: AuthFormProps) => {
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    }
    if (!hasUpperCase || !hasLowerCase) {
      return "Le mot de passe doit contenir des lettres majuscules et minuscules";
    }
    if (!hasNumbers) {
      return "Le mot de passe doit contenir au moins un chiffre";
    }
    if (!hasSpecialChar) {
      return "Le mot de passe doit contenir au moins un caractère spécial";
    }
    return "";
  };

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
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('password') as string;
    
    const passwordValidationError = validatePassword(newPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    setIsLoading(true);
    try {
      await signUp.mutateAsync({
        email: formData.get('email') as string,
        password: newPassword,
        username: formData.get('username') as string,
        fullName: formData.get('fullName') as string,
      });
      toast.success("Bienvenue sur EcoRide !", {
        description: "Nous vous offrons 20 crédits pour commencer votre aventure !",
      });
    } catch (error) {
      // L'erreur est déjà gérée par le hook useAuth
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  return (
    <Card className="w-[400px]">
      <Tabs defaultValue={type}>
        <CardHeader>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="login">
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

          <TabsContent value="register">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-username">Pseudo</Label>
                <Input id="signup-username" name="username" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-fullname">Nom complet</Label>
                <Input id="signup-fullname" name="fullName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Mot de passe</Label>
                <Input 
                  id="signup-password" 
                  name="password" 
                  type="password" 
                  value={password}
                  onChange={handlePasswordChange}
                  required 
                />
                {passwordError && (
                  <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Le mot de passe doit contenir au moins 8 caractères, incluant des majuscules, 
                  des minuscules, des chiffres et des caractères spéciaux.
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !!passwordError}>
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
