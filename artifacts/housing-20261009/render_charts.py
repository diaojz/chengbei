from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import json
root=Path(__file__).resolve().parents[2]/'assets/img/posts/buying-vs-renting-fangshan'
s=json.loads((root/'scenario.json').read_text())
fonts=Path.home()/'Library/Fonts'
body=str(fonts/'Alibaba-PuHuiTi-Medium.otf');heavy=str(fonts/'SourceHanSansCN-Heavy.otf')
BG='#F6F2E9';INK='#242F2C';MUTED='#596860';GREEN='#326654';ORANGE='#C65B35';PALE='#E5DED1'
def canvas(k,title,sub):
    im=Image.new('RGB',(1600,1160),BG);d=ImageDraw.Draw(im)
    d.rectangle((80,76,1520,83),fill=ORANGE)
    text(d,(80,120),title,78,heavy)
    text(d,(80,230),sub,47,body,MUTED)
    text(d,(80,1080),'城北 · 买房与租房' if k=='zh' else 'CHENGBEI · BUYING & RENTING',42,body,MUTED)
    return im,d
def text(d,xy,txt,size=60,font=body,fill=INK,maxw=1440):
    f=ImageFont.truetype(font,size)
    while d.textlength(txt,font=f)>maxw:
        size-=1;f=ImageFont.truetype(font,size)
    assert size>=38,(txt,size)
    d.text(xy,txt,font=f,fill=fill)
def bar(d,y,label,val,maxval,color,display):
    text(d,(80,y),label,58)
    text(d,(1020,y),display,64,heavy,color,maxw=500)
    d.rounded_rectangle((80,y+92,1520,y+156),radius=10,fill=PALE)
    d.rounded_rectangle((80,y+92,80+1440*val/maxval,y+156),radius=10,fill=color)
for lang in ['zh','en']:
    zh=lang=='zh'
    im,d=canvas(lang,'410 万买入，270 万报价' if zh else 'Bought for 4.10m. Quoted at 2.70m.', '价格由作者提供；截至 2026-09-27，尚未成交。' if zh else 'Author-provided prices · 27 Sep 2026 · Not a completed sale')
    bar(d,350,'买入价格' if zh else 'Purchase price',410,410,GREEN,'410 万' if zh else 'RMB 4.10m')
    bar(d,600,'当前报价' if zh else 'Current quote',270,410,ORANGE,'270 万' if zh else 'RMB 2.70m')
    text(d,(80,900),'价差 140 万  /  跌幅 34.15%' if zh else 'Price gap: RMB 1.40m  /  −34.15%',66,heavy,ORANGE)
    im.save(root/f'01-price-{lang}.png',optimize=True)
    im,d=canvas(lang,'176 万月供，钱去了哪里？' if zh else 'Where do the mortgage payments go?', '固定利率情景 · 20 年等额本息 · 已还 93 期' if zh else 'Constant-rate scenario · 20-year term · 93 installments')
    bar(d,340,'归还本金' if zh else 'Principal repaid',float(s['repaid_principal']),float(s['paid']),GREEN,'79.51 万' if zh else 'RMB 795,118')
    bar(d,580,'支付利息' if zh else 'Interest paid',float(s['interest']),float(s['paid']),ORANGE,'96.63 万' if zh else 'RMB 966,310')
    text(d,(80,850),'合计 176.14 万；利息占 54.86%。' if zh else 'Total: RMB 1,761,428 · Interest: 54.86%',60,heavy)
    text(d,(80,950),'公积金 3.25% / 商贷 5.88%，不代表实际账单。' if zh else 'Rates: 3.25% / 5.88% · Model, not bank statements',47,body,MUTED)
    im.save(root/f'02-payments-{lang}.png',optimize=True)
    im,d=canvas(lang,'买与租，比较的是净支出' if zh else 'Buying vs. renting: compare net costs', '同一 93 个月 · 买房为固定利率情景，租金为假设' if zh else 'Same 93 months · Modeled mortgage and assumed rent')
    bar(d,330,'买房：价差＋利息' if zh else 'Buy: price loss + interest',float(s['net_cost']),float(s['net_cost']),ORANGE,'236.63 万' if zh else 'RMB 2.366m')
    bar(d,580,'租房：每月 4,000 元' if zh else 'Rent: RMB 4,000 / month',372000,float(s['net_cost']),GREEN,'37.20 万' if zh else 'RMB 372,000')
    text(d,(80,850),'两者相差约 199.43 万。' if zh else 'Difference: about RMB 1.994m',67,heavy)
    text(d,(80,950),'未计税费、装修、租金收入及资金投资收益。' if zh else 'Excludes fees, renovation, rental income and investment gains',47,body,MUTED)
    im.save(root/f'03-comparison-{lang}.png',optimize=True)
print('Generated six 1600 × 1160 PNG charts; label widths checked.')
