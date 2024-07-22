import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import prisma from "@/db";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// export const currencyMapping = async (lang) => {
//   switch (lang) {
//     case "pl":
//       return { currency: "PLN", locale: "pl-PL" };
//     case "en":
//       return { currency: "GBP", locale: "en-GB" };
//     case "de":
//       return { currency: "EUR", locale: "de-DE" };
//     case "cz":
//       return { currency: "CZK", locale: "cz-CZ" };
//     case "fr":
//       return { currency: "EUR", locale: "fr-FR" };
//     case "lt":
//       return { currency: "EUR", locale: "lt-LT" };
//     case "ro":
//       return { currency: "RON", locale: "ro-RO" };
//     case "sk":
//       return { currency: "EUR", locale: "sk-SK" };
//     case "hu":
//       return { currency: "HUF", locale: "hu-HU" };
//     case "it":
//       return { currency: "EUR", locale: "it-IT" };
//     case "bg":
//       return { currency: "BGN", locale: "bg-BG" };
//     case "ua":
//       return { currency: "EUR", locale: "ua-UA" };
//     case "es":
//       return { currency: "EUR", locale: "es-ES" };
//     case "ee":
//       return { currency: "EUR", locale: "et-EE" };
//     case "hr":
//       return { currency: "EUR", locale: "hr-HR" };
//     case "lv":
//       return { currency: "EUR", locale: "lv-LV" };
//     case "nl":
//       return { currency: "EUR", locale: "nl-NL" };
//     case "me":
//       return { currency: "EUR", locale: "sr-ME" };
//     case "rs":
//       return { currency: "EUR", locale: "sr-RS" };
//     case "be":
//       return { currency: "EUR", locale: "fr-BE" };
//     case "at":
//       return { currency: "EUR", locale: "de-AT" };
//     case "ie":
//       return { currency: "EUR", locale: "en-IE" };
//     case "si":
//       return { currency: "EUR", locale: "si-SI" };
//     case "pt":
//       return { currency: "EUR", locale: "pt-PT" };
//     case "fi":
//       return { currency: "EUR", locale: "fi-FI" };
//     case "gr":
//       return { currency: "EUR", locale: "gr-GR" };
//     case "uk":
//       return { currency: "EUR", locale: "fi-FI" };
//     default:
//       return { currency: "PLN", locale: "pl-PL" };
//   }
// };
//
// export const country = (lang) => {
//   switch (lang) {
//     case "pl":
//       return "Poland";
//     case "uk":
//       return "Ukraine";
//     case "de":
//       return "Germany";
//     case "cz":
//       return "Czech";
//     case "fr":
//       return "France";
//     case "lt":
//       return "Lithuania";
//     case "ro":
//       return "Romania";
//     case "sk":
//       return "Slovakia";
//     case "hu":
//       return "Hungary";
//     case "it":
//       return "Italy";
//     case "bg":
//       return "Bulgaria";
//     case "en":
//       return "England";
//     case "es":
//       return "Spain";
//     case "ee":
//       return "Estonia";
//     case "hr":
//       return "Croatia";
//     case "lv":
//       return "Latvia";
//     case "nl":
//       return "Netherlands";
//     case "me":
//       return "Montenegro";
//     case "rs":
//       return "Serbia";
//     case "be":
//       return "Belgium";
//     case "at":
//       return "Austria";
//     case "ie":
//       return "Ireland";
//     case "si":
//       return "Slovenia";
//     case "pt":
//       return "Portuguese";
//     case "fi":
//       return "Finland";
//     case "gr":
//       return "Greece";
//     default:
//       return "Poland";
//   }
// };

export const matchPath = async (lang) => {
  const country = await prisma.country.findMany({
    where: {
      iso: lang,
    },
  });
  return country.length !== 0;
};
