import * as m from '$lib/features/i18n/messages.ts';

import { normalizeTranslationKey } from './normalizeTranslationKey.ts';

const JOB_MAP = {
  action_director: m.translated_value_job_action_director,
  additional_second_assistant_director:
    m.translated_value_job_additional_second_assistant_director,
  additional_third_assistant_director:
    m.translated_value_job_additional_third_assistant_director,
  assistant_director: m.translated_value_job_assistant_director,
  assistant_director_trainee: m.translated_value_job_assistant_director_trainee,
  co_director: m.translated_value_job_co_director,
  continuity: m.translated_value_job_continuity,
  crowd_assistant_director: m.translated_value_job_crowd_assistant_director,
  director: m.translated_value_job_director,
  field_director: m.translated_value_job_field_director,
  first_assistant_director: m.translated_value_job_first_assistant_director,
  first_assistant_director_trainee_prep:
    m.translated_value_job_first_assistant_director_trainee_prep,
  first_assistant_director_trainee:
    m.translated_value_job_first_assistant_director_trainee,
  insert_unit_director: m.translated_value_job_insert_unit_director,
  insert_unit_first_assistant_director:
    m.translated_value_job_insert_unit_first_assistant_director,
  layout: m.translated_value_job_layout,
  other: m.translated_value_job_other,
  script_coordinator: m.translated_value_job_script_coordinator,
  script_supervisor: m.translated_value_job_script_supervisor,
  second_assistant_director: m.translated_value_job_second_assistant_director,
  second_assistant_director_trainee:
    m.translated_value_job_second_assistant_director_trainee,
  second_second_assistant_director:
    m.translated_value_job_second_second_assistant_director,
  second_unit_director: m.translated_value_job_second_unit_director,
  second_unit_first_assistant_director:
    m.translated_value_job_second_unit_first_assistant_director,
  series_director: m.translated_value_job_series_director,
  series_guest_director: m.translated_value_job_series_guest_director,
  stage_director: m.translated_value_job_stage_director,
  third_assistant_director: m.translated_value_job_third_assistant_director,
  adaptation: m.translated_value_job_adaptation,
  author: m.translated_value_job_author,
  book: m.translated_value_job_book,
  characters: m.translated_value_job_characters,
  co_writer: m.translated_value_job_co_writer,
  comic_book: m.translated_value_job_comic_book,
  creative_producer: m.translated_value_job_creative_producer,
  dialogue: m.translated_value_job_dialogue,
  executive_story_editor: m.translated_value_job_executive_story_editor,
  graphic_novel: m.translated_value_job_graphic_novel,
  head_of_story: m.translated_value_job_head_of_story,
  idea: m.translated_value_job_idea,
  junior_story_editor: m.translated_value_job_junior_story_editor,
  lyricist: m.translated_value_job_lyricist,
  musical: m.translated_value_job_musical,
  novel: m.translated_value_job_novel,
  opera: m.translated_value_job_opera,
  original_concept: m.translated_value_job_original_concept,
  original_film_writer: m.translated_value_job_original_film_writer,
  original_series_creator: m.translated_value_job_original_series_creator,
  original_original_story: m.translated_value_job_original_original_story,
  scenario_writer: m.translated_value_job_scenario_writer,
  screenplay: m.translated_value_job_screenplay,
  screenstory: m.translated_value_job_screenstory,
  script_consultant: m.translated_value_job_script_consultant,
  script_editor: m.translated_value_job_script_editor,
  senior_story_editor: m.translated_value_job_senior_story_editor,
  series_composition: m.translated_value_job_series_composition,
  short_story: m.translated_value_job_short_story,
  staff_writer: m.translated_value_job_staff_writer,
  story: m.translated_value_job_story,
  story_story_artist: m.translated_value_job_story_story_artist,
  story_story_consultant: m.translated_value_job_story_story_consultant,
  story_story_coordinator: m.translated_value_job_story_story_coordinator,
  story_story_developer: m.translated_value_job_story_story_developer,
  story_story_editor: m.translated_value_job_story_story_editor,
  story_story_manager: m.translated_value_job_story_story_manager,
  story_story_supervisor: m.translated_value_job_story_story_supervisor,
  storyboard: m.translated_value_job_storyboard,
  teleplay: m.translated_value_job_teleplay,
  texte: m.translated_value_job_texte,
  theatre_play: m.translated_value_job_theatre_play,
  writer: m.translated_value_job_writer,
  writers_assistant: m.translated_value_job_writers_assistant,
  writers_production: m.translated_value_job_writers_production,
  creator: m.translated_value_job_creator,
} as const;

export function toTranslatedJob(
  job: string | (keyof typeof JOB_MAP),
  data?: Record<string, unknown>,
): string {
  const translationFn =
    JOB_MAP[normalizeTranslationKey(job) as keyof typeof JOB_MAP];
  return translationFn?.(data) ?? job;
}
