"use strict";

const got = require("got");

module.exports = opts => {
  const GH_REPO_API = `https://api.github.com/repos/${opts.name}/${opts.repo}`;
  const ghopts = {
    json: true,
    headers: {
      accept: "application/vnd.github.v3+json",
      authorization: `token ${process.env.GITHUB_TOKEN || opts.token || opts.gitub_token}`,
    },
  };

  async function merges(head, base, commit_message) {
    const res = await got.post(`${GH_REPO_API}/merges`, {
      ...ghopts,
      ...{ body: { head, base, commit_message } },
    });
    return res.statusCode;
  }

  async function pulls() {
    const res = await got(`${GH_REPO_API}/pulls`, ghopts);
    return res.body.sort((a, b) => b.number - a.number);
  }

  return { merges, pulls };
};
