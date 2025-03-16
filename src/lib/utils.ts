import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) throw new Error("El tamaño del chunk debe ser mayor a 0");

  return array.reduce<T[][]>((acc, _, index) => {
    if (index % size === 0) {
      acc.push(array.slice(index, index + size));
    }
    return acc;
  }, []);
}