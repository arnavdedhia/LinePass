# LinePass

## Very brief MVP outline

### Main pages/files (Next.js + TypeScript + Tailwind)
- `app/login/page.tsx` — username/password login.
- `app/pass/page.tsx` — shows today’s guest pass + **“I am the bartender or venue staff”** button.
- `app/redeem/page.tsx` — redeem flow with **Redeem** button for staff.
- `app/redeem/result/page.tsx` — success/failure result after redemption.
- `app/layout.tsx`, `app/globals.css` — shared layout + Tailwind styles.

### Basic database tables (Supabase/Postgres)
- `users` — account, password hash, device lock info (one account ↔ one browser/device).
- `passes` — one pass per user per bar day (`bar_day_date`, status, redeemed_at).
- `redemptions` (or fields on `passes`) — redemption outcome + staff action metadata.

### Main features per page
- **Login**: authenticate username/password, bind account to first browser/device, block others.
- **Pass**: compute current bar day using Chicago time with 4:00 AM reset, create/read exactly one daily pass.
- **Redeem**: staff confirms and taps Redeem; enforce one-time redemption and valid bar day.
- **Result**: show clear success/failure message and reason.

### Important backend/API files
- `lib/supabase.ts` — Supabase server/client setup.
- `lib/barDay.ts` — Chicago 4:00 AM bar-day calculation helper.
- `app/api/auth/login/route.ts` — login + device-binding checks.
- `app/api/pass/today/route.ts` — issue/fetch today’s pass (1 per user per bar day).
- `app/api/pass/redeem/route.ts` — redeem pass and return success/failure result.