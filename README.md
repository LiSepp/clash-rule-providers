# Clash Rule Providers

Static Clash rule-provider files for separating node subscriptions from routing policy.

## URLs

- `/rules/direct.yaml`: enterprise and China-direct rules.
- `/rules/ai.yaml`: OpenAI, Claude, and Grok rules.
- `/rules/proxy.yaml`: common global/proxy rules.

## Clash Example

```yaml
rule-providers:
  direct:
    type: http
    behavior: classical
    url: https://clash-rule-providers.pages.dev/rules/direct.yaml
    path: ./ruleset/direct.yaml
    interval: 86400
  ai:
    type: http
    behavior: classical
    url: https://clash-rule-providers.pages.dev/rules/ai.yaml
    path: ./ruleset/ai.yaml
    interval: 86400
  proxy:
    type: http
    behavior: classical
    url: https://clash-rule-providers.pages.dev/rules/proxy.yaml
    path: ./ruleset/proxy.yaml
    interval: 86400

rules:
  - RULE-SET,direct,DIRECT
  - RULE-SET,ai,🤖 AI
  - RULE-SET,proxy,🚀 节点选择
  - GEOIP,CN,DIRECT
  - MATCH,🐟 漏网之鱼
```

## Verify

```powershell
npm test
```
