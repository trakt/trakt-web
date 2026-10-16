type SmartListRecipeItem = {
  key: string;
  label: string;
};

export type SmartListRecipe = {
  source: string;
  mediaType: string;
  includes: ReadonlyArray<{
    key: string;
    label: string;
    values: ReadonlyArray<SmartListRecipeItem & { isExcluded: boolean }>;
    details: ReadonlyArray<string>;
  }>;
  limits: ReadonlyArray<SmartListRecipeItem>;
  hidden: ReadonlyArray<SmartListRecipeItem>;
};
