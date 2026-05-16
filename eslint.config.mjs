import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // We intentionally seed visual scenes with Math.random() in useMemo —
      // randomness on mount is the point, and the values stay stable.
      "react-hooks/purity": "off",
      // SSR-safe state hydration patterns set state from inside an effect on
      // first mount (reading localStorage / matchMedia / sessionStorage).
      // This is the correct pattern, the rule is over-eager.
      "react-hooks/set-state-in-effect": "off",
      // Allow refs to be reassigned for state-via-ref pattern in scenes
      "react-hooks/refs": "off",
      // R3F's useFrame mutates uniforms / instanceMatrix every frame — that's
      // the idiomatic pattern to avoid React re-renders. The new immutability
      // rule disallows the entire R3F mental model, so we opt out.
      "react-hooks/immutability": "off",
      // Lint config also doesn't understand that .current mutation on refs is
      // valid; effects use that to bridge scroll-driven scene state.
      "react-hooks/static-components": "off",
    },
  },
]);

export default eslintConfig;
