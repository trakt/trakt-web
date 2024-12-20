<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import { useUser } from "$lib/features/auth/stores/useUser";
  import { shuffle } from "$lib/utils/array/shuffle";

  const { current } = useUser();

  const ABOUT_MESSAGES = [
    m.about_placeholder_1(),
    m.about_placeholder_2(),
    m.about_placeholder_3(),
    m.about_placeholder_4(),
    m.about_placeholder_5(),
    m.about_placeholder_6(),
    m.about_placeholder_7(),
    m.about_placeholder_8(),
    m.about_placeholder_9(),
    m.about_placeholder_10(),
    m.about_placeholder_11(),
    m.about_placeholder_12(),
    m.about_placeholder_13(),
    m.about_placeholder_14(),
    m.about_placeholder_15(),
  ];
</script>

<p class="large secondary">
  {current().about ?? shuffle(ABOUT_MESSAGES).at(0)}
</p>
