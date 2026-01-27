"use client";

import { useState } from "react";

type Props = {
  token: string;
};

export function AdminResetPasswordForm({ token }: Props) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirm) {
      setError("Sifreler eslesmiyor.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Islem basarisiz.");
      }
      setMessage("Sifre guncellendi. Giris yapabilirsiniz.");
      setPassword("");
      setConfirm("");
    } catch (err: any) {
      setError(err.message || "Islem basarisiz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Yeni Sifre
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Yeni sifrenizi belirleyin.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Sifre
            </label>
            <input
              type="password"
              name="new-password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="En az 8 karakter"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Sifre (tekrar)
            </label>
            <input
              type="password"
              name="confirm-password"
              autoComplete="new-password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Sifrenizi tekrar girin"
            />
          </div>
          {message && <p className="text-sm text-green-600">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary-500 text-white py-2 font-medium hover:bg-primary-600 transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Guncelleniyor..." : "Sifreyi Guncelle"}
          </button>
        </form>
        <div className="mt-4 text-sm text-slate-500">
          <a href="/admin/login" className="text-primary-600 hover:underline">
            Girise don
          </a>
        </div>
      </div>
    </div>
  );
}
