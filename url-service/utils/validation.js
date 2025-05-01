const aliasRegex = /^[a-zA-Z0-9_-]{4,30}$/;

function validateAlias(alias) {
  return aliasRegex.test(alias);
}

module.exports = { validateAlias };
