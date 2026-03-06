export function validatePassword(
  value: string,
  form: { password?: string },
): string | true {
  return value === form.password ? true : 'Пароли не совпадают';
}

export function validateNotLaterThanNow(
  date: Date | undefined,
  _?: object,
  customMessage?: string,
): string | true {
  if (!date) {
    return true;
  }
  return date < new Date()
    ? true
    : (customMessage ?? 'Дата должна быть не позднее текущей');
}
