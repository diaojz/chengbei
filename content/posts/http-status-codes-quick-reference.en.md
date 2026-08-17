# HTTP Status Codes Quick Reference: Where Should You Look First?

Vibe coding makes implementation faster, but errors have not disappeared. When `401`, `404`, or `500` suddenly appears, many people paste the entire codebase into an AI and wait for a guess.

An HTTP status code is not a final diagnosis. It is a road sign. The first digit already tells you whether to look at successful processing, redirects and caching, the request side, or the server side.

This guide puts the codes you will use most at the top and the detailed reference later, so you can search the page by number when something breaks.

> Verified against the IANA HTTP Status Code Registry and RFC 9110. Products may add their own business meaning, so always read the response body and that product's documentation too.

## Start here: the first digit points to the layer

| Range | Meaning | First place to investigate |
| --- | --- | --- |
| `1xx` | Processing continues | Protocol negotiation and long-lived connections |
| `2xx` | Success | The response body and business result |
| `3xx` | Redirect or cache | `Location`, cache, domain, and routing rules |
| `4xx` | Request requirements were not met | URL, parameters, authentication, permissions, method |
| `5xx` | The service did not complete the request | Service logs, gateway, database, upstream dependencies |

Two important boundaries:

- `4xx` does not automatically mean the end user made a mistake. A broken frontend, stale SDK, or gateway rewrite can create it.
- `5xx` does not prove the current service's code is defective. Databases, DNS, TLS, proxies, and third-party APIs can all be the cause.

## The high-frequency ten

### 400 Bad Request: the request is malformed or unacceptable

Check JSON syntax, field names and types, required fields, query encoding, and whether a client or gateway changed the body.

### 401 Unauthorized: authentication did not succeed

Despite the name, this usually means “I cannot verify who you are yet.” Check the Token, Cookie, session, signature, expiry time, and whether the request actually contains `Authorization`.

### 403 Forbidden: identity is known, access is denied

Check roles, permissions, ownership, IP or region restrictions, CSRF protection, firewall rules, and the WAF.

The short version: `401` means “I did not identify you”; `403` means “I identified you and still will not allow this.”

### 404 Not Found: the path or resource cannot be found

Check the URL, frontend and backend routes, resource ID, API prefix, deployed version, and proxy configuration.

Some systems intentionally return `404` instead of `403` to avoid revealing that a protected resource exists.

### 429 Too Many Requests: you hit a rate limit

Read `Retry-After`, reduce concurrency, and use exponential backoff. Starting more immediate retry loops usually makes the problem worse.

### 500 Internal Server Error: an internal failure escaped

Start with logs, stack traces, and the Request ID from the same time window. Then inspect the database, environment, disk, memory, and external dependencies.

### 502 Bad Gateway: the gateway received an invalid upstream response

The gateway is alive, but the service behind it did not answer correctly. Check the upstream process, port, DNS, TLS, proxy target, and truncated responses.

### 503 Service Unavailable: the service cannot take work right now

Common causes include overload, maintenance, instances that are not ready, and failed health checks.

### 504 Gateway Timeout: the gateway waited too long

Check slow queries, deadlocks, blocked jobs, third-party calls, and timeout settings at both the gateway and application layers.

In one line: `502` means the upstream answered badly, `504` means it did not answer in time, and `503` means the service currently cannot accept the request.

### 200 OK: HTTP success is not always business success

This is still a failure at the business layer:

```json
{
  "success": false,
  "code": 500,
  "message": "insufficient balance"
}
```

Always inspect both the HTTP status and the response body.

## Useful 2xx codes

| Code | Meaning | Practical implication |
| --- | --- | --- |
| `200 OK` | Request succeeded | Verify business fields and returned data |
| `201 Created` | Resource created | Look for the new ID or `Location` |
| `202 Accepted` | Request accepted | An asynchronous job may still be running |
| `204 No Content` | Success with no body | Do not force an empty response through JSON parsing |
| `206 Partial Content` | Partial response | Common for video seeking and resumable downloads |

## Useful 3xx codes

| Code | Meaning | Watch for |
| --- | --- | --- |
| `301 Moved Permanently` | Permanent redirect | Long-lived browser and search-engine caching |
| `302 Found` | Temporary redirect | Login and temporary gateway flows |
| `303 See Other` | Fetch the result elsewhere | The follow-up is normally `GET` |
| `304 Not Modified` | Cached copy is still valid | Not an error |
| `307 Temporary Redirect` | Temporary redirect | Preserves method and body |
| `308 Permanent Redirect` | Permanent redirect | Preserves method and body |

For APIs, verify whether a redirected `POST` became `GET` and whether its body survived.

## Other useful 4xx codes

| Code | Meaning | First check |
| --- | --- | --- |
| `405 Method Not Allowed` | Method is not supported | `GET`, `POST`, `PUT`, or `DELETE` mismatch |
| `408 Request Timeout` | Server timed out waiting for the request | Network, upload speed, timeout settings |
| `409 Conflict` | Current resource state conflicts | Duplicate creation, versions, concurrent writes |
| `410 Gone` | Resource is permanently gone | Do not treat it as a temporary `404` |
| `413 Content Too Large` | Request body is too large | App and gateway upload limits |
| `414 URI Too Long` | URL is too long | Move large parameters into the request body |
| `415 Unsupported Media Type` | Content type is unsupported | `Content-Type` and file format |
| `422 Unprocessable Content` | Syntax is readable, validation fails | Field rules and business validation |
| `425 Too Early` | Request was sent too early | Replay risk and TLS early data |
| `428 Precondition Required` | A conditional request is required | `If-Match` and overwrite protection |
| `431 Request Header Fields Too Large` | Headers are too large | Excessive Cookies, Tokens, or custom headers |
| `451 Unavailable For Legal Reasons` | Blocked for legal reasons | Regulation, copyright, or regional restriction |

### 402 and 418 are commonly misrepresented

`402 Payment Required` remains reserved for future use in the standard. Some APIs use it for balance or subscription problems, but that business meaning is not universal.

RFC 9110 marks `418` as `Unused`. “I'm a teapot” survives as a developer joke, not as a dependable general-purpose business status.

## Useful 5xx codes

| Code | Meaning | First check |
| --- | --- | --- |
| `500 Internal Server Error` | Internal service failure | Logs, stack trace, database |
| `501 Not Implemented` | Feature or method is unsupported | Service capability and protocol version |
| `502 Bad Gateway` | Invalid upstream response | Proxy, upstream process, DNS, TLS |
| `503 Service Unavailable` | Service temporarily unavailable | Load, maintenance, instance health |
| `504 Gateway Timeout` | Upstream response timed out | Slow work, blocked dependencies, timeouts |
| `505 HTTP Version Not Supported` | HTTP version is unsupported | Client, proxy, protocol negotiation |
| `507 Insufficient Storage` | Server storage is insufficient | WebDAV, disk, storage quota |
| `508 Loop Detected` | A loop was detected | WebDAV, proxy, dependency loop |
| `511 Network Authentication Required` | Network login is required | Public Wi-Fi captive portals |

## What about 499, 520, 522, and 524?

They are not general codes in the IANA registry. They are server or platform extensions:

- Nginx commonly uses `499` when the client disconnects before the response.
- Cloudflare commonly uses `520`, `521`, `522`, and `524` to classify origin and connection failures.

Use the relevant vendor documentation instead of a generic HTTP table.

## A debugging sequence that works

### 1. Identify the family

Decide whether you are dealing with `2xx`, `3xx`, `4xx`, or `5xx` before changing code.

### 2. Inspect the full request

Verify the URL, Method, Query, Headers, and Body. Browser DevTools often reveals the mistake immediately.

### 3. Inspect the full response

Keep the error body, response headers, Request ID, `Location`, and `Retry-After`. A three-digit number alone is weak evidence.

### 4. Build a minimal reproduction

Use `curl` or Postman to remove UI state and browser cache from the equation:

```bash
curl -i "https://api.example.com/users/123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Redact Tokens, Cookies, and personal data before sharing logs.

### 5. Give the evidence to the AI

Instead of “the API failed,” provide a compact incident packet:

```text
Request: POST /api/orders
Status: 409
Response: {"message":"version conflict"}
Request ID: abc-123
Confirmed: the order button was not clicked twice
```

The more evidence you provide, the less the AI has to invent.

## The one sentence to remember

A status code tells you what one layer observed. It does not prove the final root cause.

Classify the family, inspect the request and response, then close the loop with logs and a minimal reproduction. That is the difference between asking AI to guess and debugging with AI.

## References

- [IANA HTTP Status Code Registry](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml)
- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
- [RFC 6585 — Additional HTTP Status Codes](https://www.rfc-editor.org/rfc/rfc6585)
- [RFC 7725 — 451 Unavailable For Legal Reasons](https://www.rfc-editor.org/rfc/rfc7725)
