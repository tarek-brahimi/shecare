import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { SheCard } from "@/ui/Card";
import { SheInput } from "@/ui/Input";
import { SheButton } from "@/ui/Button";

interface LocationState {
  from?: string;
}

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = ((location.state as LocationState | null)?.from) || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginUser({ email, password });
      toast.success("Welcome back.");
      navigate(redirectTo, { replace: true });
    } catch {
      toast.error("Login failed. Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background grid place-items-center px-4">
      <SheCard className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-foreground mb-2">Sign In</h1>
        <p className="text-sm text-muted-foreground mb-6">Access your SheCare dashboard and tools.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <SheInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <SheInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <SheButton type="submit" className="w-full" disabled={loading || !email || !password}>
            {loading ? "Signing in..." : "Sign In"}
          </SheButton>
        </form>

        <p className="text-sm text-muted-foreground mt-4">
          No account yet? <Link className="text-primary hover:underline" to="/register">Create one</Link>
        </p>
      </SheCard>
    </div>
  );
}
