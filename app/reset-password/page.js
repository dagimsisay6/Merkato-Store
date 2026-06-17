import ResetPasswordForm from "./ResetPasswordForm";

export const metadata = {
  title: "Reset Password — Merkato Store",
  description: "Set a new password and sign back into your account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 lg:py-20">
      <ResetPasswordForm />
    </div>
  );
}
