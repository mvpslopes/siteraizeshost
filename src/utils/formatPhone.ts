/**
 * Formata número de telefone para exibição no padrão brasileiro: (DDD) NNNNN-NNNN com 9 na frente para celular
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) return phone;
  const local = digits.length >= 12 ? digits.slice(-10) : digits.length === 11 ? digits.slice(-10) : digits;
  const ddd = local.slice(0, 2);
  const rest = local.slice(2); // 8 dígitos = fixo; 9 dígitos = já tem o 9
  if (rest.length === 8) return `(${ddd}) 9 ${rest.slice(0, 4)}-${rest.slice(4)}`;
  if (rest.length === 9) return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
  return phone;
}
