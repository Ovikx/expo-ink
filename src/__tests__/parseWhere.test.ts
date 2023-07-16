import type { WhereOptions } from '../types/types';
import { _parseWhere } from '../utils';

interface Student {
  name: string;
  age: number;
  gpa: number;
  sat: number;
  money: number;
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Runs a jest test given the actual and expected values
 * @param actual Actual value
 * @param expected Expected value
 */
function runTest<T extends ReturnType<typeof _parseWhere>>(
  actual: T,
  expected: T
) {
  // expect(actual).toBe(expected);
  const escaped = escapeRegExp(expected[0]);
  expect(actual[0]).toMatch(new RegExp(`^\\(*${escaped}\\)*$`));
  expect(actual[1]).toEqual(expected[1]);
}

/**
 * Wrapper function to simplify the testing process
 * @param where Where options
 * @param expected Expected parsed SQL
 */
function runParseTest<T extends ReturnType<typeof _parseWhere>>(
  where: WhereOptions<Student>,
  expected: T
) {
  runTest(_parseWhere(where), expected);
}

describe('where parser', () => {
  // simple AND/OR
  test('simple AND', () => {
    runParseTest(
      {
        age: 18,
        gpa: 4,
      },
      ['age = ? AND gpa = ?', [18, 4]]
    );
  });

  test('simple OR', () => {
    runParseTest(
      {
        $or: [{ age: 18 }, { gpa: 4 }, { sat: 1600 }],
      },
      ['(age = ?) OR (gpa = ?) OR (sat = ?)', [18, 4, 1600]]
    );
  });

  // Comparison operators
  test('1 comparison operators for 1 column', () => {
    runParseTest(
      {
        age: { $gte: 17 },
      },
      ['age >= ?', [17]]
    );
  });

  test('n comparison operators for 1 column', () => {
    runParseTest(
      {
        age: {
          $gte: 17,
          $lt: 23,
        },
      },
      ['age >= ? AND age < ?', [17, 23]]
    );
  });

  test('n comparison operators for n columns', () => {
    runParseTest(
      {
        age: {
          $gte: 17,
          $lt: 23,
        },
        money: {
          $gte: 1000,
        },
        sat: {
          $gte: 1500,
          $lt: 1600,
        },
      },
      [
        'age >= ? AND age < ? AND money >= ? AND sat >= ? AND sat < ?',
        [17, 23, 1000, 1500, 1600],
      ]
    );
  });

  test('simple NOT', () => {
    runParseTest(
      {
        age: { $not: { $lt: 17 } },
      },
      ['NOT (age < ?)', [17]]
    );
  });

  test('nested NOT', () => {
    runParseTest(
      {
        age: { $not: { $not: { $gte: 17 } } },
      },
      ['NOT (NOT (age >= ?))', [17]]
    );
  });

  test('nested NOT with all operators (AND, OR, comparison ops)', () => {
    runParseTest(
      {
        age: { $gte: 17, $lt: 23 },
        $or: [
          {
            money: {
              $not: { $not: { $gte: 1000 } },
            },
          },
          {
            name: { $neq: 'John Doe' },
          },
        ],
      },
      [
        'age >= ? AND age < ? AND ((NOT (NOT (money >= ?))) OR (name != ?))',
        [17, 23, 1000, 'John Doe'],
      ]
    );
  });

  test('string equivalence', () => {
    runParseTest(
      {
        name: 'Jeff Bezos',
      },
      ['name = ?', ['Jeff Bezos']]
    );
  });
});
