"use client";

import { useState } from "react";

export function AdminForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Islem basarisiz.");
      }
      setMessage("Eger e-posta sistemde varsa sifirlama baglantisi gonderildi.");
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
          Sifre Sifirlama
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          E-posta adresinizi girin, sifirlama baglantisi gonderelim.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              E-posta
            </label>
            <input
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="ornek@email.com"
            />
          </div>
          {message && <p className="text-sm text-green-600">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary-500 text-white py-2 font-medium hover:bg-primary-600 transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Gonderiliyor..." : "Baglanti Gonder"}
          </button>
        </form>
        <div className="mt-4 text-sm text-slate-500">
          <a href="/admin/login" className="text-primary-600 hover:underline">
            Geri don
          </a>
        </div>
      </div>
    </div>
  );
}
