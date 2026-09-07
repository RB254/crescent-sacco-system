# Crescent Takaful SACCO Member Management System

A full-stack financial platform designed for Crescent Takaful SACCO to manage member onboarding, atomic savings operations, 3x savings loan qualification rules, and flat-interest repayment schedules.

---

## Key System Features & Business Logic Rules

* **Member Account Lifecycle:** Full CRUD management for SACCO members with automatic assignment of dedicated savings accounts upon onboarding.
* **Savings Ledger & Overdraft Safeguard:** Atomic processing for deposits and withdrawals with strict validation preventing non-positive amounts (less than or equal to 0) and balance integrity checks preventing account overdrafts (Balance >= 0).
* **3x Savings Loan Qualification Cap:** Server-side validation capping requested loan principals at 300% of a member's total active savings balance:
  * Max Eligible Loan = 3 * Current Savings Balance
* **Annualized Flat Interest Loan Engine:** Standardized flat interest calculation using the term-fraction annualized formula:
  * Total Interest = Principal * 0.10 * (Term / 12)
  * Total Repayable = Principal + Total Interest
  * Monthly Payment = Total Repayable / Term
  * *Example (Principal: KES 3,600,000 | Term: 10 Months):*
    * **Total Interest:** KES 300,000
    * **Total Repayable:** KES 3,900,000
    * **Monthly Installment:** KES 390,000
    * **Final Month (#10) Remaining Balance:** KES 0

---

## Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Axios, Lucide React
* **Backend:** Node.js, Express.js (Controller-Route Architecture)
* **Database:** MongoDB Atlas with Mongoose ODM
* **Security & Middleware:** Helmet, CORS, Express Rate Limit
* **Testing:** Jest, Supertest

---

## Project Structure

* **backend/**
  * **controllers/** - Extracted controller business handlers
  * **models/** - Mongoose schemas (Member, Loan, SavingsAccount, Transaction)
  * **routes/** - Express API route declarations
  * **tests/** - Automated integration test suites
  * **.env.example** - Template for environment variables
  * **server.js** - Main Express application entry point
* **frontend/** - React single-page application (Vite + Tailwind)
* **render.yaml** - Deployment configuration for Render
* **ARCHITECTURE.md** - Financial logic & technical specs

---

## Local Setup Instructions

### 1. Clone & Install Dependencies

```bash
git clone [https://github.com/RB254/crescent-sacco-system.git](https://github.com/RB254/crescent-sacco-system.git)
cd crescent-sacco-system

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install