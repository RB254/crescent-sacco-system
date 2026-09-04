# Crescent Takaful SACCO Member Management System

A full-stack web application designed for Crescent Takaful SACCO to manage member profiles, handle savings deposits and withdrawals with strict overdraft safeguards, enforce 3x savings loan qualification rules, and dynamically generate accurate annualized flat-interest repayment schedules.

---

##  System Features & Business Logic Rules

### 1. Member Profile & Account Lifecycle
* Full CRUD management for SACCO members.
* Automatic assignment of dedicated savings accounts upon member creation.

### 2. Savings Ledger & Overdraft Safeguard
* Atomic processing for deposits and withdrawals.
* Strict validation preventing non-positive transaction amounts ($\le 0$).
* Balance integrity checks ensuring savings accounts cannot be overdrawn ($\text{Balance} \ge 0$).

### 3. 3x Savings Loan Qualification Cap
* Dynamic server-side validation capping requested loan principals at 300% of a member's total savings balance:
  $$\text{Maximum Eligible Loan} = 3 \times \text{Current Savings Balance}$$

### 4. Annualized Flat Interest Loan Engine
* Correct flat interest calculation using the term-fraction annualized formula:
  $$\text{Total Interest} = \text{Principal} \times 0.10 \times \left(\frac{\text{Term}}{12}\right)$$
  $$\text{Total Repayable} = \text{Principal} + \text{Total Interest}$$
  $$\text{Monthly Payment} = \frac{\text{Total Repayable}}{\text{Term}}$$
* *Example (Principal: KES 3,600,000 | Term: 10 Months):*
  * **Total Interest:** KES 300,000
  * **Total Repayable:** KES 3,900,000
  * **Monthly Installment:** KES 390,000
  * **Final Month (#10) Remaining Balance:** Exactly KES 0.

---

##  Tech Stack

* **Frontend:** React, Tailwind CSS, Lucide React
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas with Mongoose ODM
* **Testing:** Jest / Supertest

---

##  Local Setup Instructions

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
