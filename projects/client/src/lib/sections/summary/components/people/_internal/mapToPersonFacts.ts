import { getLocale } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { PersonSummary } from '$lib/requests/models/PersonSummary.ts';
import { getYearsDifference } from '$lib/utils/date/getYearsDifference.ts';
import { toHumanDay } from '$lib/utils/formatting/date/toHumanDay.ts';
import { toMeasurement } from '$lib/utils/formatting/number/toMeasurement.ts';
import type { SummaryHeaderFact } from '../../header-kit/SummaryHeaderFact.ts';

type MapToPersonFactsProps = {
  person: PersonSummary;
  now: Date;
};

/**
 * A person's facts in the summary header's own fact shape, so the masthead
 * renders them through the same component the media headers use rather than
 * restating the type scale.
 *
 * Both forms matter here. `value` is the bare figure for the labelled layout;
 * `inlineValue` has to stand alone, because the single-row layout drops the
 * labels. Only what is genuinely ambiguous gets a qualifier: height is carried by
 * its unit and a birth date by being a date, but "51" on its own says nothing, and
 * a death date needs distinguishing from the birth date beside it.
 *
 * Age is omitted once someone has died: their age at death is not the same fact
 * as a living person's age, and showing a number that keeps counting up would be
 * wrong.
 */
export function mapToPersonFacts(
  { person, now }: MapToPersonFactsProps,
): ReadonlyArray<SummaryHeaderFact> {
  const locale = getLocale();
  const facts: SummaryHeaderFact[] = [];

  if (person.height) {
    const height = toMeasurement(person.height / 100, locale);
    facts.push({
      key: 'height',
      label: m.header_height(),
      value: height,
      inlineValue: height,
    });
  }

  if (person.birthday) {
    const birthday = toHumanDay({ date: person.birthday, locale });
    facts.push({
      key: 'birthday',
      label: m.header_birthday(),
      value: birthday,
      /*
        Bare, unlike the other dated facts: a date sitting beside a height and an
        age is legibly a birth date without being told. The death date keeps its
        qualifier, because for someone who has died two bare dates in a row would
        be genuinely ambiguous.
      */
      inlineValue: birthday,
    });
  }

  if (person.deathDate) {
    const deathDate = toHumanDay({ date: person.deathDate, locale });
    facts.push({
      key: 'death-date',
      label: m.header_date_of_death(),
      value: deathDate,
      inlineValue: `${m.header_date_of_death()} ${deathDate}`,
    });

    return facts;
  }

  if (person.birthday) {
    const age = getYearsDifference(person.birthday, now).toString();
    facts.push({
      key: 'age',
      label: m.header_age(),
      value: age,
      inlineValue: `${m.header_age()} ${age}`,
    });
  }

  return facts;
}
