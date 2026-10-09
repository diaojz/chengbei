from decimal import Decimal as D, getcontext
from pathlib import Path
import csv,json
getcontext().prec=40
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'assets/img/posts/buying-vs-renting-fangshan'
OUT.mkdir(parents=True,exist_ok=True)
rows=[]
for name,p,rate in [('provident',1000000,'0.0325'),('commercial',1870000,'0.0588')]:
    principal=D(p);r=D(rate)/12;n=240;k=93
    payment=principal*r/(1-(1+r)**(-n));balance=principal
    for m in range(1,k+1):
        interest=balance*r;repaid=payment-interest;balance-=repaid
        rows.append(dict(loan=name,month=m,payment=payment,principal=repaid,interest=interest,balance=balance))
    closed=principal*(1+r)**k-payment*((1+r)**k-1)/r
    assert abs(balance-closed)<D('0.00000001')
paid=sum(t['payment'] for t in rows);interest=sum(t['interest'] for t in rows)
repaid=sum(t['principal'] for t in rows);balance=D(2870000)-repaid
net=D(2700000)-balance;cash=D(1230000)+paid;loss=D(1400000)+interest
assert abs(cash-net-loss)<D('0.00000001')
with (OUT/'repayment-scenario.csv').open('w') as f:
    w=csv.DictWriter(f,fieldnames=rows[0].keys());w.writeheader()
    for t in rows:w.writerow({k:(str(v.quantize(D('.01'))) if isinstance(v,D) else v) for k,v in t.items()})
summary={'basis':'Scenario only; constant rates; equal monthly payments; 93 installments; no prepayment; excludes fees, renovation, rental income and investment returns. Purchase price and quoted sale price are author-provided, not independently verified.','as_of':'2026-09-27','purchase':4100000,'quoted_sale':2700000,'down_payment':1230000,'provident_principal':1000000,'commercial_principal':1870000,'provident_rate':.0325,'commercial_rate':.0588,'term_months':240,'installments':93,'monthly_payment':paid/93,'paid':paid,'repaid_principal':repaid,'interest':interest,'remaining_principal':balance,'sale_net_before_fees':net,'cash_out':cash,'net_cost':loss,'assumed_monthly_rent':4000,'rent_total':372000,'buy_minus_rent':loss-D(372000)}
summary={k:(str(v.quantize(D('.01'))) if isinstance(v,D) else v) for k,v in summary.items()}
(OUT/'scenario.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(summary,ensure_ascii=False,indent=2))
