module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'chore', 'test', 'perf', 'content', 'docs', 'refactor', 'style', 'ci']],
  },
}
