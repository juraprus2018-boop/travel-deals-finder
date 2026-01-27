import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Plane, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminSetupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if any admin exists
    const checkAdmin = async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("id")
        .eq("role", "admin")
        .limit(1);

      if (!error && data && data.length > 0) {
        setHasAdmin(true);
      } else {
        setHasAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hasAdmin) {
      toast.error("Er bestaat al een admin account");
      return;
    }

    setIsLoading(true);

    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Geen gebruiker aangemaakt");

      // Add admin role
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: authData.user.id,
        role: "admin",
      });

      if (roleError) throw roleError;

      toast.success("Admin account aangemaakt!", {
        description: "Je bent nu ingelogd als admin.",
      });

      navigate("/admin");
    } catch (error) {
      toast.error("Fout bij aanmaken", {
        description: error instanceof Error ? error.message : "Onbekende fout",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (hasAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (hasAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 font-heading text-2xl font-bold">Setup Voltooid</h1>
          <p className="mb-6 text-muted-foreground">
            Er is al een admin account geconfigureerd.
          </p>
          <Button asChild>
            <Link to="/admin/login">Ga naar Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Plane className="h-6 w-6" />
            </div>
            <span className="font-heading text-2xl font-bold">
              Reizen<span className="text-primary">Europa</span>
            </span>
          </Link>
          <p className="mt-2 text-muted-foreground">Eerste Admin Setup</p>
        </div>

        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <h1 className="mb-2 font-heading text-2xl font-semibold">
            Maak Admin Account
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Dit is de eerste keer dat je de admin opent. Maak een admin account aan om te beginnen.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mailadres</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@reizeneuropa.nl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Wachtwoord</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimaal 6 tekens"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              <UserPlus className="h-4 w-4" />
              {isLoading ? "Account aanmaken..." : "Admin Account Aanmaken"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSetupPage;
