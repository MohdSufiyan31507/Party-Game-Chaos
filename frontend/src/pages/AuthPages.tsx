import { LogIn, PartyPopper, UserPlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { useAuth } from "../contexts/AuthContext";

function formValue(form: HTMLFormElement, name: string) {
  const value = new FormData(form).get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({
        email: formValue(event.currentTarget, "email"),
        password: formValue(event.currentTarget, "password"),
      });
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Welcome back, chaos makers." subtitle="Login with your Chaos Ka Adda account.">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Field label="Email" name="email" type="email" placeholder="you@chaos.test" required />
        <Field label="Password" name="password" type="password" placeholder="Your password" required />
        {error ? <p className="text-sm font-bold text-punch">{error}</p> : null}
        <Button icon={LogIn} tone="cyan" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging In" : "Login"}
        </Button>
        <p className="text-center text-sm font-bold text-white/56">
          New here?{" "}
          <Link className="text-surge hover:text-white" to="/signup">
            Create an account
          </Link>{" "}
          or{" "}
          <Link className="text-flare hover:text-white" to="/guest">
            continue as guest
          </Link>
          .
        </p>
      </form>
    </AuthLayout>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await signup({
        username: formValue(event.currentTarget, "username"),
        email: formValue(event.currentTarget, "email"),
        password: formValue(event.currentTarget, "password"),
      });
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Claim your chaos name." subtitle="Create an account with JWT authentication.">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Field label="Username" name="username" placeholder="MainCharacter99" required />
        <Field label="Email" name="email" type="email" placeholder="you@chaos.test" required />
        <Field label="Password" name="password" type="password" placeholder="At least 8 characters" minLength={8} required />
        {error ? <p className="text-sm font-bold text-punch">{error}</p> : null}
        <Button icon={UserPlus} tone="pink" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating" : "Create Account"}
        </Button>
        <p className="text-center text-sm font-bold text-white/56">
          Already have an account?{" "}
          <Link className="text-surge hover:text-white" to="/login">
            Login
          </Link>{" "}
          or{" "}
          <Link className="text-flare hover:text-white" to="/guest">
            play as guest
          </Link>
          .
        </p>
      </form>
    </AuthLayout>
  );
}

export function GuestLoginPage() {
  const navigate = useNavigate();
  const { guestLogin } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await guestLogin({ username: formValue(event.currentTarget, "username") });
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Guest login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Enter without paperwork." subtitle="Guest profiles are stored in MongoDB too.">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Field label="Guest Name" name="username" placeholder="Chaos Intern" />
        {error ? <p className="text-sm font-bold text-punch">{error}</p> : null}
        <Button icon={PartyPopper} tone="orange" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Starting" : "Start Guest Run"}
        </Button>
        <p className="text-center text-sm font-bold text-white/56">
          Want progress saved properly?{" "}
          <Link className="text-surge hover:text-white" to="/signup">
            Signup
          </Link>{" "}
          or{" "}
          <Link className="text-punch hover:text-white" to="/login">
            login
          </Link>
          .
        </p>
      </form>
    </AuthLayout>
  );
}
