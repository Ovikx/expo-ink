import { Table } from '../table';
import { ColumnType, type Columns, type WhereOptions } from '../types/types';

interface Student {
    name: string;
    age: number;
    gpa: number;
    sat: number;
    money: number;
}

const studentCols: Columns<Student> = {
    name: { dataType: ColumnType.TEXT },
    age: { dataType: ColumnType.INTEGER },
    gpa: { dataType: ColumnType.REAL },
    sat: { dataType: ColumnType.INTEGER },
    money: { dataType: ColumnType.INTEGER },
};

class TestTable<T extends object> extends Table<T> {
    constructor(columns: Columns<T>) {
        super(undefined as any, 'test', columns);
    }

    testParseWhere(where: WhereOptions<T>) {
        return this.parseWhere(where);
    }
}

const table = new TestTable(studentCols);

function escapeRegExp(str: string) {
    return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Runs a jest test given the actual and expected values
 * @param actual Actual value
 * @param expected Expected value
 */
function runTest<T>(actual: T, expected: string) {
    // expect(actual).toBe(expected);
    const escaped = escapeRegExp(expected);
    expect(actual).toMatch(new RegExp(`^\\(*${escaped}\\)*$`));
}

/**
 * Wrapper function to simplify the testing process
 * @param where Where options
 * @param expected Expected parsed SQL
 */
function runParseTest(where: WhereOptions<Student>, expected: string) {
    runTest(table.testParseWhere(where), expected);
}

describe('where parser', () => {
    // simple AND/OR
    test('simple AND', () => {
        runParseTest(
            {
                age: 18,
                gpa: 4,
            },
            'age = 18 AND gpa = 4'
        );
    });

    test('simple OR', () => {
        runParseTest(
            {
                $or: [{ age: 18 }, { gpa: 4 }, { sat: 1600 }],
            },
            '(age = 18) OR (gpa = 4) OR (sat = 1600)'
        );
    });

    // Comparison operators
    test('1 comparison operators for 1 column', () => {
        runParseTest(
            {
                age: { $gte: 17 },
            },
            'age >= 17'
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
            'age >= 17 AND age < 23'
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
            'age >= 17 AND age < 23 AND money >= 1000 AND sat >= 1500 AND sat < 1600'
        );
    });

    test('simple NOT', () => {
        runParseTest(
            {
                age: { $not: { $lt: 17 } },
            },
            'NOT (age < 17)'
        );
    });

    test('nested NOT', () => {
        runParseTest(
            {
                age: { $not: { $not: { $gte: 17 } } },
            },
            'NOT (NOT (age >= 17))'
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
            "age >= 17 AND age < 23 AND ((NOT (NOT (money >= 1000))) OR (name != 'John Doe'))"
        );
    });

    test('string equivalence', () => {
        runParseTest(
            {
                name: 'Jeff Bezos',
            },
            "name = 'Jeff Bezos'"
        );
    });
});
