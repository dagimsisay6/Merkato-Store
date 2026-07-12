import ResetPasswordForm from "../ResetPasswordForm";

export const metadata = {
  title: "Reset Password — Merkato Store",
  description: "Set a new password for your Merkato Store account.",
};

export default async function ResetPasswordTokenPage({ params }) {
  const { token } = await params;
  return (
    <div className="mx-auto max-w-md px-4 py-12 lg:py-20">
      <ResetPasswordForm token={token} />
    </div>
  );
}
