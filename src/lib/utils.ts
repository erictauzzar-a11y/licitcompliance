import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanCNPJ(value: string): string {
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

/**
 * Sanitiza valores contra CSV/Formula Injection
 * Impede execução de fórmulas quando exportado para Excel/Planilhas (=, +, -, @)
 */
export function sanitizeCsvField(val: string): string {
  if (!val) return "";
  const trimmed = val.trim();
  if (["=", "+", "-", "@", "\t", "\r"].some(char => trimmed.startsWith(char))) {
    return `'${trimmed}`;
  }
  return trimmed;
}

/**
 * CSPRNG Criptograficamente Seguro para Hashes de Auditoria
 */
export function generateHash(prefix: string = "LC"): string {
  const randomHex = crypto.randomBytes(6).toString("hex").toUpperCase();
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${randomHex}`;
}

/**
 * CSPRNG Criptograficamente Seguro para Protocolos de Denúncia
 */
export function generateProtocol(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomPart = "";
  for (let i = 0; i < 8; i++) {
    const idx = crypto.randomInt(0, chars.length);
    randomPart += chars.charAt(idx);
  }
  const year = new Date().getFullYear();
  return `DEN-${year}-${randomPart}`;
}

/**
 * CSPRNG Criptograficamente Seguro para Chaves de Acesso a Denúncias (Alta Entropia)
 */
export function generateAccessKey(): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!#@$%*";
  let key = "";
  for (let i = 0; i < 16; i++) {
    const idx = crypto.randomInt(0, chars.length);
    key += chars.charAt(idx);
  }
  return key;
}

/**
 * CSPRNG Criptograficamente Seguro para Tokens de Acesso de Colaboradores (256 bits)
 */
export function generateSecureToken(prefix: string = "tok"): string {
  return `${prefix}_${crypto.randomBytes(24).toString("hex")}`;
}
