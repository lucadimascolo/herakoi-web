// We bring commitlint into our workflow so every commit message carries conventional metadata for changelog tooling.
// By extending the conventional ruleset we ensure contributors share the same language for type, scope, and intent.
export default {
  extends: ["@commitlint/config-conventional"],
};
