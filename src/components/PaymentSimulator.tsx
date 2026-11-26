"use client";

import { useMemo, useState } from "react";
import { CreditCard, Calculator } from "lucide-react";

interface Formation {
  id: number;
  title: string;
  price: number;
  registrationFee: number;
  installmentsCount: number;
}

export function PaymentSimulator({ formations }: { formations: Formation[] }) {
  const [formationId, setFormationId] = useState<number | null>(
    formations[0]?.id ?? null
  );
  const [downPayment, setDownPayment] = useState(25000);

  const selected = formations.find((f) => f.id === formationId) || null;

  const schedule = useMemo(() => {
    if (!selected) return null;
    const total = selected.price;
    const balance = Math.max(0, total - downPayment);
    const count = Math.max(1, selected.installmentsCount);
    const perInstallment = Math.ceil(balance / count);
    const months = Array.from({ length: count }, (_, i) => ({
      n: i + 1,
      amount: i === count - 1 ? balance - perInstallment * (count - 1) : perInstallment,
    }));
    return { total, balance, count, perInstallment, months };
  }, [selected, downPayment]);

  return (
    <div className="rounded-[1.75rem] border border-[var(--color-fc-gray-light)] bg-white p-7 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-fc-primary)]/[0.08] text-[var(--color-fc-primary)]">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">Simulateur</p>
          <h3 className="font-display text-lg font-bold text-[var(--color-fc-black)]">Estime ton échéancier</h3>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[var(--color-fc-black)]">Formation</span>
          <select
            value={formationId ?? ""}
            onChange={(e) => setFormationId(Number(e.target.value))}
            className="w-full rounded-xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-fc-primary)]"
          >
            {formations.map((f) => (
              <option key={f.id} value={f.id}>{f.title}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[var(--color-fc-black)]">Apport initial (FCFA)</span>
          <input
            type="number"
            min={0}
            step={1000}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value) || 0)}
            className="w-full rounded-xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-fc-primary)]"
          />
        </label>
      </div>

      {schedule && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-[var(--color-fc-bg)] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-fc-gray-mid)]">Total</p>
              <p className="mt-1 font-display text-lg font-extrabold text-[var(--color-fc-black)]">{schedule.total.toLocaleString("fr-FR")} F</p>
            </div>
            <div className="rounded-xl bg-[var(--color-fc-bg)] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-fc-gray-mid)]">Reste à payer</p>
              <p className="mt-1 font-display text-lg font-extrabold text-[var(--color-fc-black)]">{schedule.balance.toLocaleString("fr-FR")} F</p>
            </div>
            <div className="rounded-xl bg-[var(--color-fc-bg)] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-fc-gray-mid)]">Mensualité</p>
              <p className="mt-1 font-display text-lg font-extrabold text-[var(--color-fc-primary)]">~{schedule.perInstallment.toLocaleString("fr-FR")} F</p>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)]/40 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-fc-gray-mid)]">Échéancier indicatif ({schedule.count} tranches)</p>
            <ul className="mt-3 space-y-2">
              {schedule.months.map((m) => (
                <li key={m.n} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-fc-gray-mid)]">Tranche {m.n}</span>
                  <span className="font-semibold text-[var(--color-fc-black)]">{m.amount.toLocaleString("fr-FR")} FCFA</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[11px] leading-5 text-[var(--color-fc-gray-mid)]">
            Simulation indicative. Les montants et dates réels sont fixés par l&apos;administration lors de la validation du dossier.
          </p>
        </div>
      )}
    </div>
  );
}
