---
name: SaaS Automation Suite
description: Unified interface for 100+ SaaS automations via Rube MCP (Composio). Handles CRM, Marketing, DevTools, and Productivity integrations with standardized patterns.
risk: safe
source: community
---

# SaaS Automation Suite

This omnibus skill provides a unified interface for interacting with and automating over 100 SaaS platforms using specialized tools. Instead of fragmented skills for each service, this suite standardizes the workflow for discovery, manipulation, and orchestration of cloud services.

## When to Use

- Use when you need to automate tasks in platforms like **Airtable, Jira, HubSpot, Slack, GitHub, Stripe**, and many others.
- Activate this when the user requires cross-platform syncs or multi-service workflows.
- Use when you need to manage CRM contacts, project management tasks, or marketing campaigns across disparate tools.

## Supported Platforms (Partial List)

| Category | Platforms |
| :--- | :--- |
| **CRM & Sales** | HubSpot, Salesforce, Pipedrive, Close, Zoho CRM |
| **Project Mgmt** | Jira, Asana, Trello, Linear, Monday, Basecamp, ClickUp |
| **Communication** | Slack, Discord, Microsoft Teams, WhatsApp, Telegram |
| **Development** | GitHub, GitLab, Bitbucket, CircleCI, Sentry, Vercel |
| **Marketing** | Mailchimp, ActiveCampaign, Klaviyo, Brevo, ConvertKit |
| **Data & Storage** | Airtable, Google Sheets, Dropbox, Box, Google Drive, Notion |
| **Ops & Finance** | Stripe, Billing, PagerDuty, Datadog, Mixpanel, Amplitude |

## Core Patterns

### 1. Tool Discovery
Before performing any action, always search the tool directory for the current schema of the target service.
```bash
# Example for HubSpot
search_tools "hubspot"
```

### 2. Standardized CRUD
Most SaaS integrations follow a standard Create, Read, Update, Delete pattern.
- **Search**: Find entities (contacts, tasks, records).
- **Retrieve**: Get specific details by ID.
- **Update**: Modify existing entities.
- **Create**: Add new data points.

### 3. Workflow Orchestration
Combining multiple services into a single logical chain:
1. **Trigger**: Detect event (e.g., New GitHub Issue).
2. **Transform**: Process data.
3. **Action**: Push to another service (e.g., Create Jira Task).

## Related Skills
- `browser-automation`: For platforms without dedicated API tools.
- `api-patterns`: For custom API integrations not covered by this suite.
