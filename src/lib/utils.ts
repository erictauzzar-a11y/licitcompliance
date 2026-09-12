import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanCNPJ(value: string): string {
  // Mantém caracteres alfanuméricos (letras e números), preparando para formato atual e novo alfanumérico
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

export function isValidCNPJFormat(value: string): boolean {
  const clean = cleanCNPJ(value);
  return clean.length === 14;
}

export function formatCNPJ(value: string): string {
  const clean = cleanCNPJ(value);
  if (clean.length !== 14) return value;
  return clean.replace(/^([A-Z0-9]{2})([A-Z0-9]{3})([A-Z0-9]{3})([A-Z0-9]{4})([A-Z0-9]{2})$/, "$1.$2.$3/$4-$5");
}

export function maskCNPJInput(value: string): string {
  const clean = cleanCNPJ(value).slice(0, 14);
  return clean
    .replace(/^([A-Z0-9]{2})([A-Z0-9])/, "$1.$2")
    .replace(/^([A-Z0-9]{2})\.([A-Z0-9]{3})([A-Z0-9])/, "$1.$2.$3")
    .replace(/\.([A-Z0-9]{3})([A-Z0-9])/, ".$1/$2")
    .replace(/([A-Z0-9]{4})([A-Z0-9])/, "$1-$2");
}

export function formatCPF(value: string): string {
  const clean = value.replace(/\D/g, "");
  if (clean.length !== 11) return value;
  return clean.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

export function maskCPF(value: string): string {
  const formatted = formatCPF(value);
  return formatted.replace(/^(\d{3})\.(\d{3})\.(\d{3})-(\d{2})$/, "***.$2.$3-**");
}

export function generateHash(prefix: string = "LC"): string {
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${random}`;
}

export function generateProtocol(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const year = new Date().getFullYear();
  return `DEN-${year}-${randomPart}`;
}

export function generateAccessKey(): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!#@$%*";
  let key = "";
  for (let i = 0; i < 7; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}
