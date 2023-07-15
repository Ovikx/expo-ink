import type {
  BaseQueryOptions,
  Entries,
  WhereOperators,
  WhereOptions,
} from './types/types';

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

/**
 * Parses a query model into a string
 * @param where Where options
 * @returns Parsed SQL WHERE clause (excluding the "WHERE")
 */
export function _parseWhere<T extends object>(where: WhereOptions<T>): string {
  // TODO: make private
  const comparisonOps = new Set(['$eq', '$neq', '$lt', '$lte', '$gt', '$gte']);
  const opToSQL = {
    $eq: '=',
    $neq: '!=',
    $lt: '<',
    $lte: '<=',
    $gt: '>',
    $gte: '>=',
  };

  const keyIsColumn = (key: string): boolean => {
    return !comparisonOps.has(key) && key != '$not' && key != '$or';
  };

  const processOperand = (operand: any): string => {
    if (typeof operand == 'string') {
      return `'${operand}'`;
    } else {
      return operand.toString();
    }
  };

  const parseWhereHelper = (wherePart: WhereOptions<T>): string => {
    const chunks: string[] = [];
    for (const [key, val] of Object.entries(wherePart) as Entries<
      WhereOptions<T>
    >) {
      if (keyIsColumn(key)) {
        // If the key is a column, then we know the value is either an object or a primitive
        if (typeof val != 'object') {
          // If it's not an object operator, then it's an implicit $eq
          chunks.push(`${key} = ${processOperand(val)}`);
        } else {
          // Otherwise, it's a series of operators (including $not)
          const regOpChunks: string[] = [];
          for (const [innerKey, innerVal] of Object.entries(
            val as WhereOperators<T, keyof T>
          ) as [keyof typeof opToSQL | '$not', T][]) {
            if (innerKey != '$not') {
              // Operator is not $not, so treat as comparison operator
              regOpChunks.push(
                `${String(key)} ${opToSQL[innerKey]} ${processOperand(
                  innerVal
                )}`
              );
            } else {
              // Operator is $not, so recur
              regOpChunks.push(
                `NOT ${parseWhereHelper({
                  [key]: innerVal,
                } as WhereOptions<T>)}`
              );
            }
          }

          chunks.push(regOpChunks.join(' AND '));
        }
      } else if (key == '$or') {
        // console.log(parseOr(val as WhereOptions<T>[]))
        const orChunks: string[] = [];
        for (const whereOption of val as WhereOptions<T>[]) {
          orChunks.push(parseWhereHelper(whereOption));
        }

        chunks.push(`(${orChunks.join(' OR ')})`);
      }
    }

    return `(${chunks.join(' AND ')})`;
  };

  return parseWhereHelper(where);
}

export function _parseOptions<T extends object>(
  statement: string,
  options: BaseQueryOptions<T>
) {
  // Handle WHERE option
  if (options.where != undefined && JSON.stringify(options.where) != '{}') {
    statement += ` WHERE ${_parseWhere(options.where)}`;
  }

  // Handle ORDER BY option
  if (options.orderBy != undefined) {
    statement += ' ORDER BY';
    const entries = Object.entries(options.orderBy);
    for (let i = 0; i < entries.length; i++) {
      const orderQuery = entries[i];
      statement += ` ${orderQuery[0]} ${orderQuery[1]}`;

      // To not put the comma after the last column
      if (i != entries.length - 1) {
        statement += ',';
      }
    }
  }

  // Handle LIMIT option
  if (options.limit != undefined) {
    statement += ` LIMIT ${options.limit}`;
  }

  return statement;
}
