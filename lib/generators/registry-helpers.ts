import { getGenerator } from "./registry";

export function getDefaultParams(id: string): unknown {
  const g = getGenerator(id);
  return g ? structuredClone(g.schema.defaults) : {};
}
