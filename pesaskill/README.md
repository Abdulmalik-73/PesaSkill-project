# PesaSkill — AI-Powered Skill Marketplace with M-Pesa Escrow

> "Empowering students to turn skills into income instantly using mobile money."

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Backend
```bash
cd backend
cp .env.example .env   # fill in your values
npm install
node seed.js           # seed demo data
npm run dev            # starts on :5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev            # starts on :5173
```

## Test Accounts (after seeding)
| Email | Password | Role |
|-------|----------|------|
| ahmed@pesaskill.com | password123 | Seller |
| buyer@pesaskill.com | password123 | Buyer |
| david@pesaskill.com | password123 | Both |

## M-Pesa Setup
1. Register at [Safaricom Developer Portal](https://developer.safaricom.co.ke)
2. Create a sandbox app → get Consumer Key & Secret
3. Add to `backend/.env`
4. Use sandbox phone: `254708374149` for testing

> If M-Pesa API is unavailable, the system auto-simulates payment (sandbox mode).

## Escrow Flow
1. Buyer pays → funds held in escrow
2. Seller works → marks "Done"
3. Buyer confirms → funds released
4. Buyer rates seller ⭐
5. Auto-release after 48h if buyer doesn't respond
