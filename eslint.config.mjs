import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".vercel/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "tools/**",
    ],
  },
  {
    rules: {
      // Not part of this migration — flags pre-existing setState-in-effect
      // patterns in PreviewCanvas that predate this rule. Revisit separately.
      "react-hooks/set-state-in-effect": "off",
      // Not part of this migration — the pre-existing codebase predates
      // this rule being enabled and has ~50 intentional `any` usages in
      // WebGL/canvas internals. Revisit as a separate typing pass.
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
];

export default eslintConfig;
