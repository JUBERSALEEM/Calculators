import { z, type ZodTypeAny } from "zod";

/**
 * Shared validation helpers for calculator inputs.
 * All messages are user-facing and name the violated constraint.
 */

export const requiredNumber = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .transform((val) => {
      const n = Number(val);
      return Number.isFinite(n) ? n : NaN;
    })
    .refine((n) => !Number.isNaN(n), {
      message: `${label} must be a valid number`,
    });

export const finiteNumber = (label: string) =>
  z.number().refine(Number.isFinite, {
    message: `${label} must be a finite number`,
  });

export const positive = (label: string) =>
  z.number().refine((n) => n > 0, {
    message: `${label} must be greater than zero`,
  });

export const nonNegative = (label: string) =>
  z.number().refine((n) => n >= 0, {
    message: `${label} must be zero or greater`,
  });

export const range = (label: string, min: number, max: number) =>
  z.number().refine((n) => n >= min && n <= max, {
    message: `${label} must be between ${min} and ${max}`,
  });

export const notZero = (label: string) =>
  z.number().refine((n) => n !== 0, {
    message: `${label} must not be zero`,
  });

/**
 * Normalises a locale decimal separator ("," or ".") before parsing.
 */
export const decimalString = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .transform((val) => Number(val.replace(/,/g, ".")))
    .refine((n) => Number.isFinite(n), {
      message: `${label} must be a valid number`,
    });

export type ZodShape = Record<string, ZodTypeAny>;
