# OpenIMIS Claims Management System - MVP

A healthcare claims management application built for TestARQ demo purposes. Every UI element includes `data-testid`, `aria-label`, and `id` attributes for perfect test automation compatibility.

## Features

- **Login** - 4 user roles (Admin, Enrollment Officer, Claims Administrator, Claims Reviewer)
- **Dashboard** - Statistics, recent claims overview
- **Family/Member Enrollment** - Search, add family with full demographics
- **Claims Submission** - ICD-10, CPT codes, facility selection
- **Claims Review** - Filter, search, status updates

## Demo Credentials

| Username | Password | Role |
|----------|----------|------|
| Admin | admin123 | System Administrator |
| EOFF001 | officer123 | Enrollment Officer |
| CLRK001 | clerk123 | Claims Administrator |
| RVWR001 | review123 | Claims Reviewer |

## Test Automation Selectors

Every element has three selector strategies:

```html
<input 
  id="last-name"
  data-testid="input-last-name"
  aria-label="Last Name"
  name="last-name"
/>
```

### Key Test IDs

| Page | Element | data-testid |
|------|---------|-------------|
| Login | Username | `input-username` |
| Login | Password | `input-password` |
| Login | Login Button | `btn-login` |
| Enrollment | Search | `input-search-families` |
| Enrollment | Add Family Button | `btn-add-family` |
| Enrollment | Last Name | `input-last-name` |
| Enrollment | Given Names | `input-given-names` |
| Enrollment | Birth Date | `input-birth-date` |
| Enrollment | Gender | `select-gender` |
| Enrollment | Save Button | `btn-save-family` |
| Claims | New Claim Button | `btn-new-claim` |
| Claims | Insurance No | `select-insurance-no` |
| Claims | Diagnosis Code | `select-diagnosis-code` |
| Claims | Submit Button | `btn-submit-claim` |
| Review | Search | `input-search-claims` |
| Review | Status Filter | `select-filter-status` |
| Review | Date From | `input-filter-date-from` |

## Deploy on Render

### Option 1: Blueprint (render.yaml)
1. Push to GitHub
2. Go to Render Dashboard > New > Blueprint
3. Connect repo - it will auto-detect `render.yaml`

### Option 2: Manual Static Site
1. Go to Render Dashboard > New > Static Site
2. Connect repo
3. **Build Command:** `npm install && npm run build`
4. **Publish Directory:** `dist`

## Local Development

```bash
npm install
npm run dev
```

Opens at http://localhost:5173
