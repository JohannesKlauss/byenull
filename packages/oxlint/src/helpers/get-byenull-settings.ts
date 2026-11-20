import type { Context } from "@oxlint/plugins";

export type ByenullSettings = {
  module: string[];
  namespace: string[];
};

const DEFAULT_SETTINGS: ByenullSettings = {
  module: ["byenull"],
  namespace: ["Option", "O"],
};

const toStringArray = (value: unknown, fallback: string[]): string[] => {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  return fallback;
};

export const getByenullSettings = (context: Context): ByenullSettings => {
  const settings = context.settings["byenull"];
  if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
    return DEFAULT_SETTINGS;
  }

  return {
    module: toStringArray(settings["module"], DEFAULT_SETTINGS.module),
    namespace: toStringArray(settings["namespace"], DEFAULT_SETTINGS.namespace),
  };
};
