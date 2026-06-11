# BrimStone Brokers Implementation Handoff

Use this file as the single source of truth for implementing the platform.

## Objective

Transform the current BrimStone Brokers project into a production-ready financial platform with:

- Public marketing site
- User login and signup
- Investor dashboard
- Admin dashboard
- Portfolio, deposits, investments, loans, support, and compliance modules

The design language must match the company preset:

- Institutional
- Trusted
- Wealth-management focused
- Clean and premium
- Navy, gold, slate, and white color system

## Important Scope Rules

1. Do not rebuild the public site unless needed for login/signup links.
2. Connect only the login and signup flows from the public site to the dashboard app.
3. Keep the dashboard as the main application layer.
4. Remove crypto/trading-bot style language from the UI and replace it with BrimStone financial language.
5. Prefer a minimal, safe deployment path that can be hosted locally or on a PHP server.

## Current Context Preset

The dashboard must present these core investor metrics prominently:

- Portfolio Value
- Total Deposits
- Active Investments
- Investment Returns
- Pending Transactions
- Loan Applications
- Recent Activity

These should be the main dashboard cards and visual anchors.

## Tech Direction

Use the existing Laravel dashboard app as the backend and UI engine.

Recommended stack:

- Frontend: Blade templates, HTML, CSS, JavaScript
- Backend: PHP / Laravel
- Database: MySQL
- Auth: Laravel sessions, password hashing, middleware-based protection
- Storage: local filesystem first, later S3-compatible storage if needed

## Branding Direction

Replace the current violet/indigo crypto look with a BrimStone financial identity.

Use:

- Deep navy
- Gold / amber accents
- Slate surfaces
- White text and cards

Tone of text:

- Secure
- Institutional
- Advisory-led
- Professional

Avoid:

- Crypto jargon
- Trading bot language
- Speculative hype
- Overly futuristic styling

## Files That Must Be Refined

### Public site

- `index.html`
- `about/index.html`
- `financial-planning/index.html`
- `wealth-management/index.html`

Goal:

- Add login/signup entry points only
- Keep the rest of the marketing content intact

### Dashboard auth

- `dashboard/resources/views/templates/bento/blades/layouts/auth.blade.php`
- `dashboard/resources/views/templates/bento/blades/user/auth/login.blade.php`
- `dashboard/resources/views/templates/bento/blades/user/auth/register.blade.php`
- `dashboard/resources/views/templates/bento/blades/admin/auth/login.blade.php`

Goal:

- Rebrand the login and signup screens
- Replace copy with BrimStone language
- Match the company preset

### Dashboard UI shell

- `dashboard/resources/views/templates/bento/blades/admin/layouts/admin.blade.php`
- `dashboard/resources/views/templates/bento/blades/layouts/user.blade.php`
- `dashboard/resources/views/templates/bento/brand.css`
- `dashboard/resources/views/templates/bento/css/app.css`

Goal:

- Update global colors, typography, spacing, shadows, cards, and buttons
- Make the app look like a premium financial client portal

### Installer / requirement checks

- `dashboard/public/install/index.php`
- `dashboard/app/Http/Controllers/Admin/Update/PrecheckController.php`
- `dashboard/app/Http/Controllers/Admin/Settings/OveriewController.php`

Goal:

- Accept local PHP 8.2.x or 8.3.x depending on the environment
- Make requirement checks practical for local development
- Keep extension checks for `gmp`, `zip`, and `gd`

## Dashboard Layout Plan

### User Dashboard

Top cards:

- Portfolio Value
- Total Deposits
- Active Investments
- Investment Returns
- Pending Transactions
- Loan Applications
- Recent Activity

Secondary sections:

- Portfolio performance chart
- Asset allocation chart
- Holdings table
- Transactions table
- Loan status widget
- KYC status widget
- Support ticket widget

### Admin Dashboard

Top cards:

- Total Investors
- AUM
- Active Investments
- Pending Requests
- Loan Requests
- Revenue Metrics

Operational sections:

- Users
- Investments
- Loans
- Transactions
- KYC / AML
- Support
- CMS
- Reports
- Settings

## Folder-by-Folder Merge Map

### Keep and re-skin

- `dashboard/resources/views/templates/bento/blades/admin/layouts/admin.blade.php`
- `dashboard/resources/views/templates/bento/blades/layouts/auth.blade.php`
- `dashboard/resources/views/templates/bento/blades/layouts/user.blade.php`
- `dashboard/resources/views/templates/bento/brand.css`

### Connect only login/signup

- Public site login links should route into the dashboard auth pages.
- Public site signup links should route into the dashboard registration page.
- Do not expose admin or user app pages from the public site yet.

### Keep isolated for now

- Investment management screens
- Loan processing screens
- Support/ticket screens
- Admin settings screens
- CMS screens

## Required UI Copy Changes

Replace these phrases across the dashboard:

- "Welcome Back" -> "Client Portal"
- "Sign In to Admin" -> "Secure Admin Sign In"
- "Create Account" -> "Create Investor Account"
- "Join the future of wealth management" -> "Access your portfolio and client services securely"
- "Continue with Email" -> "Continue with Email"
- "Forgot password?" -> "Reset password"

## Security and Compliance Expectations

Include:

- Password hashing
- Session protection
- Role-aware access
- MFA-ready structure
- Audit log support
- KYC-ready workflow
- AML-ready review states
- Document upload handling

## Build Order

1. Rebrand UI colors and text
2. Connect login and signup routes
3. Confirm installer works locally
4. Confirm PHP extension checks pass
5. Confirm database setup flow works
6. Confirm user dashboard shell loads
7. Confirm admin dashboard shell loads
8. Polish dashboard metric cards and charts
9. Prepare deployment bundle

## Deployment Goal

The final deliverable should be easy to host on a standard PHP server:

- Apache
- PHP
- MySQL
- Laravel app files

## Important Output Requirement

When the implementation is complete, create a separate `done` folder containing only the files needed for deployment and upload.

## Done Folder Guidance

Create a folder named:

- `done/`

Place only the essential deliverables there, such as:

- `public/`
- `app/`
- `bootstrap/`
- `config/`
- `database/`
- `resources/`
- `routes/`
- `storage/` if required for deployment
- `artisan`
- `composer.json`
- `composer.lock`
- `.env.example`
- `.htaccess`
- any required public assets

If the deployment target only needs the web app and not the full source history, keep the folder lean and exclude:

- `node_modules`
- `.git`
- test artifacts
- build caches
- temporary files

## Final Instruction to Claude

Make the platform feel like BrimStone Brokers from top to bottom. Match the company preset, keep the app secure, connect only login/signup from the public site, and produce a clean deployment-ready `done/` folder at the end.
