export function validatePassword(
  value: string,
  form: { password?: string },
): string | true {
  return value === form.password ? true : 'Пароли не совпадают';
}
