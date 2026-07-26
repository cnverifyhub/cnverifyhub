# DNS for AI Discovery (DNS-AID) & Agent Discovery Configuration Guide

This document outlines the DNS records required for DNS-AID (RFC 9460 / `draft-mozleywilliams-dnsop-dnsaid`) agent discovery for `cnverifyhub.com`.

## 1. Required DNS Records (SVCB/HTTPS)

Publish the following `SVCB` / `HTTPS` records under your domain DNS manager (Cloudflare, DNSPod, Route53, or Aliyun DNS):

```dns
; Primary AI Agent Index Record
_index._agents.cnverifyhub.com. 3600 IN HTTPS 1 . (
    alpn="h2,h3"
    port="443"
    ipv4hint=104.21.55.2
    key65535="/.well-known/api-catalog"
)

; Agent-to-Agent (A2A) Endpoint Record
_a2a._agents.cnverifyhub.com. 3600 IN HTTPS 1 . (
    alpn="h2,h3"
    port="443"
    ipv4hint=104.21.55.2
    key65535="/llms.txt"
)
```

## 2. DNSSEC Signing Requirement

Ensure your domain `cnverifyhub.com` has **DNSSEC** enabled so validating resolvers return authenticated `AD` (Authenticated Data) flags.

- **Cloudflare**: DNS -> Settings -> Enable DNSSEC -> Add DS record to registrar.
- **DNSPod / Aliyun**: Enable DNSSEC -> Copy Key Tag, Algorithm, Digest -> Update Registrar.

## 3. Verification

Verify DNS-AID record publication:
```bash
dig +dnssec HTTPS _index._agents.cnverifyhub.com
dig +dnssec HTTPS _a2a._agents.cnverifyhub.com
```
