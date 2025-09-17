import type { Gender } from "../types/Gender";

export function calculateAge(birthdate: string | Date): number {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function translateGender(gender: Gender): string {
  return genderTranslations[gender] || gender;
}

const genderTranslations: Record<Gender, string> = {
  male: "Hombre",
  female: "Mujer",
  non_binary: "No binario",
  transgender: "Transgénero",
  genderqueer: "Género queer",
  genderfluid: "Género fluido",
  agender: "Sin género",
  bigender: "Bigénero",
  other: "Otro",
  prefer_not_to_say: "Prefiero no decirlo",
};