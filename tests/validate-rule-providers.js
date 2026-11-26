const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function readProvider(name) {
  const file = path.join(root, "public", "rules", `${name}.yaml`);
  const text = fs.readFileSync(file, "utf8");
  const payloadIndex = text.indexOf("payload:");
  assert.notEqual(payloadIndex, -1, `${name}.yaml must contain payload`);
  return text
    .slice(payloadIndex + "payload:".length)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).replace(/^['"]|['"]$/g, ""));
}

const direct = readProvider("direct");
const ai = readProvider("ai");
const proxy = readProvider("proxy");

assert.ok(direct.indexOf("DOMAIN-KEYWORD,chinaunicom") < direct.indexOf("DOMAIN-SUFFIX,cn"));
assert.ok(direct.includes("DOMAIN-SUFFIX,chinaunicom.cn"));
assert.ok(direct.includes("DOMAIN-SUFFIX,10010.com"));
assert.ok(direct.includes("IP-CIDR,10.0.0.0/8,no-resolve"));

assert.ok(ai.includes("DOMAIN-SUFFIX,openai.com"));
assert.ok(ai.includes("DOMAIN-SUFFIX,chatgpt.com"));
for (const domain of ["anthropic.com", "anthropic.services", "claude.ai", "claudeusercontent.com"]) {
  assert.ok(!ai.includes(`DOMAIN-SUFFIX,${domain}`), `Unexpected Claude rule: ${domain}`);
}
for (const rule of [
  "DOMAIN,gemini.google.com",
  "DOMAIN,aistudio.google.com",
  "DOMAIN,generativelanguage.googleapis.com",
  "DOMAIN,cloudcode-pa.googleapis.com",
  "DOMAIN-SUFFIX,grokusercontent.com",
  "DOMAIN-SUFFIX,grok.bot",
  "DOMAIN-SUFFIX,cursor.sh",
  "DOMAIN-SUFFIX,cursorvm.com",
  "DOMAIN,downloads.cursor.com",
]) {
  assert.ok(ai.includes(rule), `Missing AI rule: ${rule}`);
}
assert.equal(new Set(ai).size, ai.length, "AI rules must be unique");
assert.ok(ai.includes("DOMAIN-SUFFIX,x.ai"));
assert.ok(ai.includes("DOMAIN-SUFFIX,grok.com"));

assert.ok(proxy.includes("DOMAIN-SUFFIX,github.com"));
assert.ok(proxy.includes("DOMAIN-SUFFIX,google.com"));
assert.ok(proxy.includes("DOMAIN-SUFFIX,youtube.com"));

for (const rule of [...direct, ...ai, ...proxy]) {
  assert.equal(rule.includes(",DIRECT"), false, `provider rule must not include policy: ${rule}`);
  assert.equal(rule.includes(",🤖"), false, `provider rule must not include policy group: ${rule}`);
}

console.log("rule provider validation ok");
