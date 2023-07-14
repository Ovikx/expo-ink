/**
 * Tag to ensure that arbitrary migration SQL statements are formatted correctly during the migration process
 * @param strs String to validate
 * @returns Migration-ready SQL statement
 */
export function sql(strs: TemplateStringsArray, ...values: any[]) {
  let res = '';
  strs.forEach((str, i) => {
    res += str + (values[i] != undefined ? values[i] : '');
  });
  const trimmed = res.trim();
  return trimmed.slice(-1) == ';' ? trimmed : trimmed + ';';
}
