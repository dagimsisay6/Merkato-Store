import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password — Merkato Store",
  description: "Reset your password and regain access to your account.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 lg:py-20">
      <ForgotPasswordForm />
    </div>
  );
}

