# Bought for RMB 4.1 million, now quoted at 2.7 million: buying versus renting, on paper

In January 2019, I bought a home in Fangshan, Beijing, for RMB 4.1 million. I put down 30% and took out a 20-year mortgage. By September 2026, I was considering selling it, with a market quote of RMB 2.7 million.

That is a RMB 1.4 million gap. But the price change alone does not answer the question I wanted to understand: what happened to the down payment and all those mortgage payments? How much would renting have cost instead?

“Rent pays someone else's mortgage; buying builds your own wealth” leaves quite a lot out.

![Author-provided purchase price of RMB 4.10 million versus a quote of RMB 2.70 million as of 27 September 2026. The gap is RMB 1.40 million, or 34.15%. No sale has been completed.](/assets/img/posts/buying-vs-renting-fangshan/01-price-en.png)

## Don't count the down payment twice

The down payment was RMB 1.23 million, leaving RMB 2.87 million to borrow. If the home sells for RMB 2.7 million, its price loss is RMB 1.4 million.

Adding the down payment and every mortgage payment to that loss would double-count principal. The down payment is already part of the purchase price. Mortgage payments have two components: principal reduces debt; interest pays for borrowing.

To separate them, I built a reproducible calculation.

> **This is a scenario, not my bank statements.** It assumes a RMB 1 million housing provident fund loan at 3.25% and a RMB 1.87 million commercial mortgage at 5.88%, both amortized through equal monthly payments over 240 months. It includes 93 payments starting in January 2019, no prepayment and no rate changes. Actual repricing and payment dates have not been reconstructed.

The RMB 1 million allocation is an assumption, not a claim about Beijing's maximum provident fund loan. Likewise, 5.88% is a selected scenario rate, not a verified historical maximum mortgage rate.

The resulting monthly payment is about RMB 18,940. Over 93 months, payments total RMB 1,761,428.

![Under the constant-rate model, RMB 795,118 repays principal and RMB 966,310 pays interest. Interest accounts for 54.86% of total payments. This is not an actual mortgage statement.](/assets/img/posts/buying-vs-renting-fangshan/02-payments-en.png)

Only about RMB 795,118 reduces the loan balance. Roughly RMB 966,310 pays interest. Having my name on the property does not turn that borrowing cost into savings.

## A RMB 2.7 million sale would not put RMB 2.7 million in my pocket

The model leaves RMB 2,074,882 in principal outstanding. That debt comes out of the sale proceeds first.

| Cash flow | RMB |
|---|---:|
| Down payment | 1,230,000 |
| Mortgage payments over 93 months | 1,761,428 |
| **Total cash paid** | **2,991,428** |
| Assumed sale proceeds | 2,700,000 |
| Outstanding principal to repay | 2,074,882 |
| **Cash recovered before fees** | **625,118** |
| **Cash paid minus cash recovered** | **2,366,310** |

That net cost also equals the **RMB 1.4 million price loss plus RMB 966,310 in modeled interest**. The two calculations agree without counting principal twice.

Transaction taxes, agent fees, renovation and other ownership costs are not included. Rental income, if any, would offset costs. Without actual amounts, those entries should remain blank.

Leverage explains why a roughly one-third decline in the property's price can consume much more than one-third of the owner's contributed principal. The down payment plus repaid principal totals about RMB 2,025,118. Subtract the RMB 1.4 million price loss, and RMB 625,118 remains. The lender's principal claim does not shrink in proportion to the property's market value.

## What would renting have cost?

A home provides somewhere to live. For an owner-occupied comparison, that service cannot be valued at zero.

I do not have a verified historical rent series for this property. Instead, consider four assumed average monthly rents for comparable accommodation over the same 93 months.

| Assumed average monthly rent | Total rent | Less than modeled buying cost by |
|---|---:|---:|
| RMB 3,000 | RMB 279,000 | RMB 2,087,310 |
| RMB 4,000 | RMB 372,000 | RMB 1,994,310 |
| RMB 5,000 | RMB 465,000 | RMB 1,901,310 |
| RMB 6,000 | RMB 558,000 | RMB 1,808,310 |

![For the same 93 months, modeled net buying cost is about RMB 2.366 million. Assumed rent of RMB 4,000 a month totals RMB 372,000. The gap is about RMB 1.994 million, before omitted costs and investment returns.](/assets/img/posts/buying-vs-renting-fangshan/03-comparison-en.png)

At RMB 4,000 a month, rent totals RMB 372,000, about RMB 1.994 million below the modeled buying cost.

This comparison does not put gross mortgage payments against rent. It already credits the buyer with the equity recovered on sale. The time period and housing quality also need to be comparable.

Renting would leave the initial down payment available for other uses, along with the monthly difference between mortgage payments and rent. Those funds might earn returns or suffer investment losses. Without a specified investment path, I have not assigned them an attractive annual yield.

## Ownership buys something the spreadsheet cannot fully price

For this price path and these assumptions, renting comes out ahead financially. That does not establish a rule for every home or every buyer.

Ownership can provide greater residential stability, freedom to renovate and less exposure to an unwanted move. Someone planning to stay for twenty years may value those benefits highly. Someone expecting to change cities within three years may value liquidity and flexibility more.

Renting has its own uncertainty: renewals, rent increases and moving costs. Lower financial cost does not mean an identical experience.

Buying a home combines two decisions: choosing a long-term place to live and committing substantial capital to an asset. Enjoying the home does not prove the investment worked. A disappointing investment does not erase the years of life spent there.

The useful questions are: **What am I willing to pay for residential stability? If prices stagnate or fall, will the mortgage crowd out other choices?**

## Past losses and today's selling decision are different questions

A purchase price can become a psychological finish line: wait until the market returns to RMB 4.1 million, and call that breaking even.

But interest, maintenance and holding costs continue. A decision today should compare future housing needs, borrowing costs, potential rent and possible prices. The original purchase price is not a promise from the market.

Rent buys accommodation. Interest buys the use of borrowed money. Both are costs. Principal repayments build equity, but the value of that equity still depends on the property's eventual sale price.

**A home can be a good place to live. Whether it is a good investment deserves a separate calculation.**

---

### Data and reproduction notes

Published in October 2026; the quote and calculation cutoff remain **27 September 2026**, not a fresh October valuation.

- **Author-provided facts:** January 2019 purchase in Fangshan, RMB 4.1 million price, 30% down payment, 20-year loan term and RMB 2.7 million quote as of the cutoff. Contracts and statements are not published or independently verified. A quote is not a completed sale and this case is not an estimate of Fangshan's overall market.
- **Model assumptions:** RMB 1 million provident fund loan at 3.25%, RMB 1.87 million commercial mortgage at 5.88%, 240-month equal-payment amortization, 93 payments, constant rates and no prepayment. A January purchase does not establish January as the first repayment month.
- **Rent assumptions:** RMB 3,000–6,000 a month is sensitivity analysis, not surveyed local transaction data. The comparison assumes owner occupation and no rental income; shared living expenses must be treated consistently.
- **Exclusions:** transaction taxes, agent fees, renovation, differential holding costs, rental income, inflation and investment returns. This is a nominal cash comparison, not a complete investment-return analysis.
- **Formula:** monthly payment `A = P × r / [1 − (1 + r)^(-n)]`, with initial principal `P`, monthly rate `r` and `n = 240`. Monthly interest equals opening balance times monthly rate; principal repaid equals payment minus interest. A separate closed-form balance calculation checks the monthly schedule. Displayed numbers are rounded; totals use unrounded values.

[Parameters and results (JSON)](/assets/img/posts/buying-vs-renting-fangshan/scenario.json) · [Monthly schedule for both loans (CSV)](/assets/img/posts/buying-vs-renting-fangshan/repayment-scenario.csv) · [Calculation script](https://github.com/diaojz/chengbei/blob/main/artifacts/housing-20261009/reproduce.py)
