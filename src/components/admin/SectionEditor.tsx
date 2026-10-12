"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import type { FieldDef } from "@/lib/siteSectionSchemas";
import { ICON_NAMES, getIcon } from "@/lib/iconRegistry";

type Obj = Record<string, unknown>;

const inputClass =
  "w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red";
const labelClass = "block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5";

async function uploadImage(file: File): Promise<string> {
  const data = new FormData();
  data.append("file", file);
  data.append("fileName", file.name.replace(/\.[^/.]+$/, ""));
  data.append("folder", "/afs-cms/sections");
  const res = await fetch("/api/imagekit/upload", { method: "POST", body: data });
  if (!res.ok) throw new Error("Upload failed");
  return (await res.json()).url as string;
}

function ImageField({
  value,
  onChange,
  aspect,
}: {
  value: string;
  onChange: (v: string) => void;
  aspect?: "square";
}) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      onChange(await uploadImage(file));
      toast.success("Image uploaded. Click Save to publish.");
    } catch {
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
      <div
        className={`relative rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 ${
          aspect === "square" ? "w-40 aspect-square" : "w-full sm:w-40 aspect-[16/10]"
        }`}
      >
        {value ? (
          <Image key={value} src={value} alt="Preview" fill className="object-cover" sizes="(max-width: 640px) 100vw, 160px" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-[11px] text-slate-400 font-semibold">No image</span>
        )}
      </div>
      <div className="flex-1 space-y-2 min-w-0">
        <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer shadow-sm transition-colors">
          <Upload className="w-3.5 h-3.5" />
          {uploading ? "Uploading..." : "Upload Image"}
          <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="hidden" />
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL"
          className={`${inputClass} font-mono text-xs`}
        />
      </div>
    </div>
  );
}

function IconField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const Icon = getIcon(value);
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 h-10 rounded-xl bg-red-50 text-brand-red border border-red-100 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        {ICON_NAMES.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleField({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2.5 h-[42px] px-3 rounded-xl border text-sm font-bold transition-colors cursor-pointer ${
        checked ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-50 border-slate-300 text-slate-500"
      }`}
    >
      <span className={`relative w-9 h-5 rounded-full transition-colors ${checked ? "bg-emerald-500" : "bg-slate-300"}`}>
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </span>
      {checked ? "Yes" : "No"}
    </button>
  );
}

function ListField({
  field,
  value,
  onChange,
}: {
  field: Extract<FieldDef, { type: "list" }>;
  value: Obj[];
  onChange: (v: Obj[]) => void;
}) {
  const update = (index: number, item: Obj) => onChange(value.map((v, i) => (i === index ? item : v)));
  const move = (index: number, dir: -1 | 1) => {
    const next = [...value];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {value.map((item, index) => (
        <div key={index} className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold text-slate-900 truncate min-w-0">
              <span className="text-brand-red">
                {field.itemLabel} {index + 1}
              </span>
              {String(item[field.titleKey] ?? "") && <span className="text-slate-500"> · {String(item[field.titleKey])}</span>}
            </p>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
                className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 flex items-center justify-center cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === value.length - 1}
                aria-label="Move down"
                className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 flex items-center justify-center cursor-pointer"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                aria-label={`Remove ${field.itemLabel}`}
                className="w-8 h-8 rounded-lg border border-red-200 bg-red-50 text-brand-red hover:bg-brand-red hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <FieldGrid fields={field.fields} value={item} onChange={(v) => update(index, v)} />
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...value, { ...field.newItem }])}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-brand-red text-slate-700 hover:text-brand-red text-xs font-bold transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add {field.itemLabel}
      </button>
    </div>
  );
}

function FieldGrid({ fields, value, onChange }: { fields: FieldDef[]; value: Obj; onChange: (v: Obj) => void }) {
  const set = (key: string, v: unknown) => onChange({ ...value, [key]: v });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fields.map((field) => {
        const wide = field.type !== "text" && field.type !== "icon" && field.type !== "toggle";
        const raw = value[field.key];
        return (
          <div key={field.key} className={wide ? "sm:col-span-2" : ""}>
            {field.type === "group" ? (
              <fieldset className="bg-slate-50/70 border border-slate-200 rounded-2xl p-3 sm:p-4">
                <legend className="px-2 text-xs font-black text-slate-900">{field.label}</legend>
                <FieldGrid fields={field.fields} value={(raw as Obj) || {}} onChange={(v) => set(field.key, v)} />
              </fieldset>
            ) : (
              <>
                <label className={labelClass}>{field.label}</label>
                {field.type === "text" && (
                  <input
                    type="text"
                    value={String(raw ?? "")}
                    placeholder={field.placeholder}
                    onChange={(e) => set(field.key, e.target.value)}
                    className={inputClass}
                  />
                )}
                {field.type === "textarea" && (
                  <textarea
                    rows={field.rows ?? 3}
                    value={String(raw ?? "")}
                    onChange={(e) => set(field.key, e.target.value)}
                    className={`${inputClass} resize-y`}
                  />
                )}
                {field.type === "image" && (
                  <ImageField value={String(raw ?? "")} onChange={(v) => set(field.key, v)} aspect={field.aspect} />
                )}
                {field.type === "icon" && <IconField value={String(raw ?? "")} onChange={(v) => set(field.key, v)} />}
                {field.type === "toggle" && (
                  <ToggleField
                    checked={raw === undefined ? field.defaultValue ?? false : Boolean(raw)}
                    onChange={(v) => set(field.key, v)}
                  />
                )}
                {field.type === "list" && (
                  <ListField field={field} value={Array.isArray(raw) ? (raw as Obj[]) : []} onChange={(v) => set(field.key, v)} />
                )}
                {"help" in field && field.help && (
                  <p className="text-[11px] text-slate-500 font-medium mt-1">{field.help}</p>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Card with a schema-driven form for one homepage section. */
export function SectionEditor({
  title,
  description,
  fields,
  value,
  onChange,
}: {
  title: string;
  description: string;
  fields: FieldDef[];
  value: Obj;
  onChange: (v: Obj) => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5 shadow-xs">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">{title}</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">{description}</p>
      </div>
      <FieldGrid fields={fields} value={value} onChange={onChange} />
    </div>
  );
}
