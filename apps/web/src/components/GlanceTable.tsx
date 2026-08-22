"use client";

import { localize } from "@/lib/i18n";
import { useT } from "@/lib/i18n-client";
import type { GlanceRow } from "@/lib/zone-data";

export default function GlanceTable({ rows }: { rows: GlanceRow[] }) {
  const { t, lang } = useT();

  return (
    <table className="pretty-table">
      <thead>
        <tr>
          <th style={{ width: "35%" }}>{t("home.glance.col.indicator")}</th>
          <th>{t("home.glance.col.value")}</th>
          <th>{t("home.glance.col.note")}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            <td>{localize(row.label, lang)}</td>
            <td className="val">
              {typeof row.value === "string" ? row.value : localize(row.value, lang)}
            </td>
            <td className="note">{row.note ? localize(row.note, lang) : ""}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
