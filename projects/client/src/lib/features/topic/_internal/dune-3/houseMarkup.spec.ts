import { describe, expect, it } from 'vitest';
import { m } from '$lib/features/i18n/messages.ts';
import { houseMarkup } from './houseMarkup.ts';

const base = { name: 'Paul', hours: null, harvests: null, seat: 'Arrakis' };

describe('util: houseMarkup', () => {
  it('should render the house name and seat', () => {
    const markup = houseMarkup(base);

    expect(markup).toContain(m.text_topic_dune_house_name({ name: 'Paul' }));
    expect(markup).toContain(`<b>Arrakis</b>`);
  });

  it('should prefer the hours record over the harvests', () => {
    const markup = houseMarkup({ ...base, hours: 1234, harvests: 56 });

    expect(markup).toContain(m.text_topic_dune_house_spice_harvested());
    expect(markup).toContain(
      m.text_topic_dune_house_hours({ hours: (1234).toLocaleString() }),
    );
    expect(markup).not.toContain(m.text_topic_dune_house_harvests());
  });

  it('should fall back to the harvests when there are no hours', () => {
    const markup = houseMarkup({ ...base, harvests: 56 });

    expect(markup).toContain(m.text_topic_dune_house_harvests());
    expect(markup).toContain('<b>56</b>');
    expect(markup).not.toContain(m.text_topic_dune_house_spice_harvested());
  });

  it('should skip the record when there are no hours and no harvests', () => {
    const markup = houseMarkup(base);

    expect(markup).not.toContain(m.text_topic_dune_house_harvests());
    expect(markup).not.toContain(m.text_topic_dune_house_spice_harvested());
  });

  it('should escape the name and the seat', () => {
    const markup = houseMarkup({
      ...base,
      name: '<img src=x>',
      seat: '<script>&',
    });

    expect(markup).not.toContain('<img');
    expect(markup).not.toContain('<script>');
    expect(markup).toContain('&lt;script&gt;&amp;');
  });
});
