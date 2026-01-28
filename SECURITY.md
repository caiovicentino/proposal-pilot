# Security Policy - ProposalPilot AI

## Overview

ProposalPilot is committed to protecting user data and maintaining secure operations. This document outlines our security practices aligned with OWASP Top 10 guidelines.

## OWASP Top 10 Compliance

### 1. Broken Access Control ✅
- **Implementation**: Stack Auth handles authentication with secure session management
- **Authorization**: All API routes verify user ownership before returning data
- **Data isolation**: Proposals are filtered by userId, preventing cross-user access
- **Code example**: `prisma.proposal.findMany({ where: { userId: dbUser.id } })`

### 2. Cryptographic Failures ✅
- **Data in transit**: All communications over HTTPS (enforced by Railway)
- **Data at rest**: Neon PostgreSQL encrypts data at rest with AES-256
- **Secrets management**: Environment variables stored securely, never committed to git
- **Password handling**: Delegated to Stack Auth (bcrypt hashing)

### 3. Injection ✅
- **SQL Injection**: Prevented by Prisma ORM parameterized queries
- **XSS**: React's automatic escaping + Next.js security headers
- **AI Prompt Injection**: User input is contextualized, not directly executed

### 4. Insecure Design ✅
- **Threat modeling**: Considered during development
- **Principle of least privilege**: Users can only access their own proposals
- **Defense in depth**: Multiple layers of security (auth, DB, API)

### 5. Security Misconfiguration ✅
- **Default configs**: Changed from Next.js defaults where needed
- **Error handling**: Generic error messages in production
- **Security headers**: Configured via Next.js middleware

### 6. Vulnerable and Outdated Components ✅
- **Dependency management**: npm audit run before deployment
- **Updates**: Using latest stable versions of all packages
- **Monitoring**: Dependabot alerts enabled (when on GitHub)

### 7. Identification and Authentication Failures ✅
- **Authentication**: Handled by Stack Auth (OAuth + Magic Link)
- **Session management**: Secure, HttpOnly cookies
- **MFA**: Available through Stack Auth
- **Rate limiting**: Implemented at API level

### 8. Software and Data Integrity Failures ✅
- **CI/CD security**: Environment variables protected
- **Code signing**: Using verified npm packages
- **Data validation**: Zod/manual validation on all inputs

### 9. Security Logging and Monitoring ✅
- **Logging**: Console logs for errors (production logs via Railway)
- **Audit trail**: createdAt/updatedAt timestamps on all records
- **Alerting**: Railway provides deployment and error alerts

### 10. Server-Side Request Forgery (SSRF) ✅
- **External requests**: Only to trusted APIs (OpenAI)
- **Input validation**: URLs and external references validated
- **Allowlisting**: Only known API endpoints accessed

## Data Handling

### Personal Data Collected
- Email address (authentication)
- Display name (optional)
- Business information (proposals)
- Client information (within proposals)

### Data Retention
- Active accounts: Data retained indefinitely
- Deleted accounts: Data purged within 30 days
- Backups: Retained for 7 days (Neon default)

### Third-Party Services
| Service | Purpose | Data Shared |
|---------|---------|-------------|
| Stack Auth | Authentication | Email, name |
| Neon | Database | All user data (encrypted) |
| OpenAI | AI generation | Brief text (no PII) |
| Railway | Hosting | Application logs |

## Incident Response

### Reporting Vulnerabilities
Email: security@proposalpilot.io (placeholder)

### Response Timeline
- **Critical**: Patch within 24 hours
- **High**: Patch within 72 hours
- **Medium**: Patch within 1 week
- **Low**: Next scheduled release

## Compliance

### GDPR (EU)
- Right to access: Users can view all their data
- Right to deletion: Users can delete their account
- Data portability: Export functionality planned

### CCPA (California)
- Do not sell: We never sell personal data
- Disclosure: Privacy policy outlines data collection
- Deletion: Account deletion removes all data

## Security Headers

Configured via Next.js middleware:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';
```

## Best Practices for Users

1. **Use strong passwords** (if not using OAuth)
2. **Enable MFA** when available
3. **Don't share account credentials**
4. **Report suspicious activity immediately**
5. **Keep browser updated**

## Audit Log

| Date | Action | Result |
|------|--------|--------|
| 2026-01-28 | Initial security review | Pass |
| 2026-01-28 | OWASP Top 10 compliance check | Pass |
| 2026-01-28 | npm audit | 0 critical vulnerabilities |

---

*Last updated: January 28, 2026*
*Document version: 1.0*
