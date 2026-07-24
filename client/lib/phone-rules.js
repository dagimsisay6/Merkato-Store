// Phone validation rules for supported countries
// Each entry: { pattern, hint, prefix, name }
export const PHONE_RULES = {
  NG: { pattern: /^(\+?234|0)[789]\d{9}$/,      prefix: "+234", name: "Nigeria",      hint: "e.g. 0801 234 5678 or +234 801 234 5678" },
  KE: { pattern: /^(\+?254|0)[17]\d{8}$/,        prefix: "+254", name: "Kenya",        hint: "e.g. 0712 345 678 or +254 712 345 678 (Safaricom: 07xx)" },
  ET: { pattern: /^(\+?251|0)[79]\d{8}$/,        prefix: "+251", name: "Ethiopia",     hint: "e.g. 0911 234 567 or +251 911 234 567 (Safaricom: +2517xx)" },
  AE: { pattern: /^(\+?971|0)5[024568]\d{7}$/,  prefix: "+971", name: "UAE",          hint: "e.g. 050 123 4567 or +971 50 123 4567" },
  SA: { pattern: /^(\+?966|0)5\d{8}$/,           prefix: "+966", name: "Saudi Arabia", hint: "e.g. 0512 345 678 or +966 512 345 678" },
  EG: { pattern: /^(\+?20|0)1[0125]\d{8}$/,     prefix: "+20",  name: "Egypt",        hint: "e.g. 0101 234 5678 or +20 101 234 5678" },
};

export function validatePhone(phone, countryCode) {
  const rule = PHONE_RULES[countryCode];
  if (!rule) return null; // no rule for this country — allow any
  const clean = phone.replace(/[\s\-()]/g, "");
  return rule.pattern.test(clean) ? null : `Invalid ${rule.name} phone number. ${rule.hint}`;
}
