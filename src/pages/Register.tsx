import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { SheCard } from "@/ui/Card";
import { SheInput } from "@/ui/Input";
import { SheButton } from "@/ui/Button";

export default function Register() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser({ name, email, password });
      toast.success("Your account has been created.");
      navigate("/dashboard", { replace: true });
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background grid place-items-center px-4">
      <SheCard className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-foreground mb-2">Create Account</h1>
        <p className="text-sm text-muted-foreground mb-6">Start your personalized SheCare journey.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <SheInput
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            minLength={6}
          />
          <SheButton type="submit" className="w-full" disabled={loading || !name || !email || !password}>
            {loading ? "Creating account..." : "Create Account"}
          </SheButton>
        </form>

        <p className="text-sm text-muted-foreground mt-4">
          Already have an account? <Link className="text-primary hover:underline" to="/login">Sign in</Link>
        </p>
      </SheCard>
    </div>
  );
}
