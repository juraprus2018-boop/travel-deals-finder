import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, User, Key, Globe, Save, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Wachtwoorden komen niet overeen",
        description: "Controleer of beide wachtwoorden hetzelfde zijn.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Wachtwoord te kort",
        description: "Het wachtwoord moet minimaal 6 tekens bevatten.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Wachtwoord bijgewerkt",
        description: "Je wachtwoord is succesvol gewijzigd.",
      });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Fout bij bijwerken",
        description: "Er ging iets mis bij het bijwerken van je wachtwoord.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Instellingen</h1>
        <p className="text-muted-foreground">
          Beheer je account en site-instellingen
        </p>
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account
          </CardTitle>
          <CardDescription>
            Beheer je accountgegevens en wachtwoord
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>E-mailadres</Label>
            <Input value={user?.email || ""} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">
              Je e-mailadres kan niet worden gewijzigd.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-medium">
              <Key className="h-4 w-4" />
              Wachtwoord Wijzigen
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nieuw wachtwoord</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Bevestig wachtwoord</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <Button
              onClick={handlePasswordUpdate}
              disabled={isUpdatingPassword || !newPassword || !confirmPassword}
            >
              <Save className="mr-2 h-4 w-4" />
              {isUpdatingPassword ? "Bijwerken..." : "Wachtwoord Bijwerken"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Site Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Site Instellingen
          </CardTitle>
          <CardDescription>
            Algemene instellingen voor de website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-secondary/30 p-4">
            <h4 className="font-medium">Affiliate Integraties</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              De volgende affiliate partners zijn actief:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                ✓ Partnerize/KLM (Vliegtickets)
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                ○ Stay22 (Hotels) - Gepland
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                ○ GetYourGuide (Tours) - Gepland
              </span>
            </div>
          </div>

          <div className="rounded-lg border bg-secondary/30 p-4">
            <h4 className="font-medium">AI Content Generator</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Gebruikt Google Gemini 2.5 Flash voor het genereren van SEO-geoptimaliseerde content.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-travel-forest" />
              <span className="text-sm text-travel-forest">Actief</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Settings className="h-5 w-5" />
            Sessie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div>
              <p className="font-medium">Uitloggen</p>
              <p className="text-sm text-muted-foreground">
                Beëindig je huidige sessie en ga terug naar de login pagina.
              </p>
            </div>
            <Button variant="destructive" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Uitloggen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
