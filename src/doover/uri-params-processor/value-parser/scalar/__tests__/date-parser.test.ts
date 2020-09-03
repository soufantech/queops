import { dateParser } from '../../scalar';

describe('dateParser', () => {
  it.each`
    input                                         | output
    ${'2020'}                                     | ${'2020-01-01T00:00:00.000Z'}
    ${'2020-08'}                                  | ${'2020-08-01T00:00:00.000Z'}
    ${'2020-08-10'}                               | ${'2020-08-10T00:00:00.000Z'}
    ${'2020-08-10T21:37:29Z'}                     | ${'2020-08-10T21:37:29.000Z'}
    ${'2020-08-10T21:37:29.813Z'}                 | ${'2020-08-10T21:37:29.813Z'}
    ${'2020-08-10t21:37:29.813z'}                 | ${'2020-08-10T21:37:29.813Z'}
    ${'2020-08-10T21:37:29.813-03:00'}            | ${'2020-08-11T00:37:29.813Z'}
    ${'Mon, 10 Aug 2020 21:37:29 UTC-0300 (-03)'} | ${'2020-08-11T00:37:29.000Z'}
    ${'mon, 10 aug 2020 21:37:29 utc-0300 (-03)'} | ${'2020-08-11T00:37:29.000Z'}
  `(
    'returns a date object for any valid date string representation.',
    ({ input, output }) => {
      const parseDate = dateParser();

      const parsed = parseDate(input);

      expect(parsed.value).toBeInstanceOf(Date);
      expect(parsed.value?.toISOString()).toBe(output);
      expect(parsed.opcode).toBeUndefined();
    },
  );

  it.each`
    input
    ${'20200222T155523,813Z'}
    ${'2020-W08-6T15:55:23,813Z'}
    ${'1597106249000'}
    ${'24'}
    ${'20:23:33'}
    ${''}
  `(
    'returns an undefined value for invalid date string representations.',
    ({ input }) => {
      const parseDate = dateParser();

      const parsed = parseDate(input);

      expect(parsed.value).toBeUndefined();
      expect(parsed.opcode).toBeUndefined();
    },
  );
});
