import { AdminResetPasswordForm } from "./reset-password-form";

type Props = {
  params: { token: string };
};

export default function AdminResetPasswordPage({ params }: Props) {
  return <AdminResetPasswordForm token={params.token} />;
}
