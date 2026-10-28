/* Nội dung mở rộng – nối thêm vào DATA */

/* ---------- TỪ VỰNG (thêm) ---------- */
DATA.vocab.push(...[
 ['balance','/ˈbæləns/','số dư; cân đối','The account balance is $1,250.','fin'],
 ['bookkeeping','/ˈbʊkkiːpɪŋ/','ghi sổ kế toán','Bookkeeping records every daily transaction.','fin'],
 ['trial balance','/ˈtraɪəl ˈbæləns/','bảng cân đối thử','Run a trial balance before closing the books.','fin'],
 ['chart of accounts','/tʃɑːrt əv əˈkaʊnts/','hệ thống tài khoản','The chart of accounts lists every ledger account.','fin'],
 ['accounts payable','/əˈkaʊnts ˈpeɪəbl/','phải trả người bán','Accounts payable is due within 30 days.','fin'],
 ['accounts receivable','/əˈkaʊnts rɪˈsiːvəbl/','phải thu khách hàng','We are chasing overdue accounts receivable.','fin'],
 ['retained earnings','/rɪˈteɪnd ˈɝːnɪŋz/','lợi nhuận giữ lại','Retained earnings fund future growth.','fin'],
 ['working capital','/ˈwɝːkɪŋ ˈkæpɪtl/','vốn lưu động','Working capital is current assets minus current liabilities.','fin'],
 ['current assets','/ˈkɝːənt ˈæsets/','tài sản ngắn hạn','Cash and inventory are current assets.','fin'],
 ['fixed assets','/fɪkst ˈæsets/','tài sản cố định','Buildings and machinery are fixed assets.','fin'],
 ['intangible asset','/ɪnˈtændʒəbl ˈæset/','tài sản vô hình','A patent is an intangible asset.','fin'],
 ['goodwill','/ˌɡʊdˈwɪl/','lợi thế thương mại','Goodwill arises when a company is acquired above book value.','fin'],
 ['book value','/bʊk ˈvæljuː/','giá trị sổ sách','The book value of the machine is $10,000.','fin'],
 ['market value','/ˈmɑːrkɪt ˈvæljuː/','giá trị thị trường','Market value can differ from book value.','fin'],
 ['cost of goods sold','/kɔːst əv ɡʊdz soʊld/','giá vốn hàng bán','Cost of goods sold rose with material prices.','fin'],
 ['operating profit','/ˈɑːpəreɪtɪŋ ˈprɑːfɪt/','lợi nhuận hoạt động','Operating profit excludes interest and tax.','fin'],
 ['gross profit','/ɡroʊs ˈprɑːfɪt/','lợi nhuận gộp','Gross profit is revenue minus cost of goods sold.','fin'],
 ['break-even point','/ˈbreɪk ˈiːvn pɔɪnt/','điểm hòa vốn','We reach the break-even point in month eight.','fin'],
 ['fixed cost','/fɪkst kɔːst/','chi phí cố định','Rent is a fixed cost.','fin'],
 ['variable cost','/ˈveriəbl kɔːst/','chi phí biến đổi','Variable costs rise with production.','fin'],
 ['capital expenditure','/ˈkæpɪtl ɪkˈspendɪtʃər/','chi đầu tư vốn (CAPEX)','Capital expenditure this year includes a new warehouse.','fin'],
 ['operating expense','/ˈɑːpəreɪtɪŋ ɪkˈspens/','chi phí hoạt động (OPEX)','Operating expenses include salaries and utilities.','fin'],
 ['accrued expense','/əˈkruːd ɪkˈspens/','chi phí trích trước','Accrued expenses are recorded before payment.','fin'],
 ['prepaid expense','/ˌpriːˈpeɪd ɪkˈspens/','chi phí trả trước','Insurance paid in advance is a prepaid expense.','fin'],
 ['deferred revenue','/dɪˈfɝːd ˈrevənuː/','doanh thu chưa thực hiện','Deferred revenue is a liability until the service is delivered.','fin'],
 ['provision','/prəˈvɪʒn/','khoản dự phòng','We made a provision for doubtful debts.','fin'],
 ['bad debt','/bæd det/','nợ xấu','Bad debt was written off in December.','fin'],
 ['cash equivalent','/kæʃ ɪˈkwɪvələnt/','tương đương tiền','Short-term deposits are cash equivalents.','fin'],
 ['petty cash','/ˈpeti kæʃ/','quỹ tiền mặt nhỏ','Small purchases come from petty cash.','fin'],
 ['payroll','/ˈpeɪroʊl/','bảng lương','Payroll is processed on the 25th.','fin'],
 ['bonus','/ˈboʊnəs/','tiền thưởng','Employees received a year-end bonus.','fin'],
 ['reimbursement','/ˌriːɪmˈbɝːsmənt/','hoàn ứng, hoàn tiền chi phí','Submit receipts for reimbursement.','fin'],
 ['expense report','/ɪkˈspens rɪˈpɔːrt/','báo cáo chi phí','Please file your expense report by Friday.','fin'],
 ['purchase order','/ˈpɝːtʃəs ˈɔːrdər/','đơn đặt hàng','A purchase order was sent to the supplier.','fin'],
 ['credit note','/ˈkredɪt noʊt/','giấy báo có','We issued a credit note for the returned goods.','fin'],
 ['due date','/duː deɪt/','ngày đến hạn','The due date is the 30th.','fin'],
 ['overdue','/ˌoʊvərˈduː/','quá hạn','Your payment is ten days overdue.','fin'],
 ['remittance','/rɪˈmɪtns/','khoản chuyển tiền; thanh toán','Please send the remittance advice by email.','fin'],
 ['wire transfer','/ˈwaɪr ˈtrænsfɝː/','chuyển khoản ngân hàng','Payment was made by wire transfer.','fin'],
 ['exchange rate','/ɪksˈtʃeɪndʒ reɪt/','tỷ giá hối đoái','The exchange rate changes daily.','fin'],
 ['currency','/ˈkɝːənsi/','tiền tệ','The invoice is in US currency.','fin'],
 ['collateral','/kəˈlætərəl/','tài sản thế chấp','The loan requires collateral.','fin'],
 ['mortgage','/ˈmɔːrɡɪdʒ/','khoản vay thế chấp','They took out a mortgage to buy a house.','fin'],
 ['principal','/ˈprɪnsəpl/','tiền gốc','Each payment covers interest and principal.','fin'],
 ['maturity','/məˈtʃʊrəti/','kỳ đáo hạn','The bond reaches maturity in 2030.','fin'],
 ['bond','/bɑːnd/','trái phiếu','Governments issue bonds to raise money.','fin'],
 ['stock','/stɑːk/','cổ phiếu','He bought stock in a tech company.','fin'],
 ['equity market','/ˈekwəti ˈmɑːrkɪt/','thị trường cổ phiếu','The equity market fell sharply.','fin'],
 ['bull market','/bʊl ˈmɑːrkɪt/','thị trường tăng giá','Investors are optimistic in a bull market.','fin'],
 ['bear market','/ber ˈmɑːrkɪt/','thị trường giảm giá','A bear market lasts at least several months.','fin'],
 ['volatility','/ˌvɑːləˈtɪləti/','độ biến động','High volatility worries cautious investors.','fin'],
 ['diversify','/daɪˈvɝːsɪfaɪ/','đa dạng hóa','Diversify your investments to reduce risk.','fin'],
 ['appreciate','/əˈpriːʃieɪt/','tăng giá trị','Property tends to appreciate over time.','fin'],
 ['yield','/jiːld/','lợi suất','The bond offers a yield of 4%.','fin'],
 ['return on investment','/rɪˈtɝːn ɑːn ɪnˈvestmənt/','tỷ suất hoàn vốn (ROI)','The project delivered a strong return on investment.','fin'],
 ['profit margin','/ˈprɑːfɪt ˈmɑːrdʒɪn/','biên lợi nhuận','A thin profit margin leaves little room for error.','fin'],
 ['cost-cutting','/ˈkɔːst ˈkʌtɪŋ/','cắt giảm chi phí','Cost-cutting measures began in January.','fin'],
 ['merger','/ˈmɝːdʒər/','sáp nhập','The merger created the largest bank in the region.','fin'],
 ['acquisition','/ˌækwɪˈzɪʃn/','thâu tóm, mua lại','The acquisition was completed in May.','fin'],
 ['bankruptcy','/ˈbæŋkrʌptsi/','phá sản','The firm filed for bankruptcy.','fin'],
 ['subsidiary','/səbˈsɪdieri/','công ty con','The subsidiary reports to the parent company.','fin'],
 ['consolidate','/kənˈsɑːlɪdeɪt/','hợp nhất (báo cáo)','We consolidate the accounts of all subsidiaries.','fin'],
 ['GAAP','/ɡæp/','chuẩn mực kế toán Mỹ','The statements follow GAAP.','fin'],
 ['IFRS','/ˈaɪfrs/','chuẩn mực báo cáo tài chính quốc tế','Many countries use IFRS.','fin'],
 ['internal control','/ɪnˈtɝːnl kənˈtroʊl/','kiểm soát nội bộ','Strong internal control prevents fraud.','fin'],
 ['fraud','/frɔːd/','gian lận','The audit uncovered fraud.','fin'],
 ['discrepancy','/dɪˈskrepənsi/','sự chênh lệch','We found a discrepancy in the totals.','fin'],
 ['variance','/ˈveriəns/','chênh lệch (so với kế hoạch)','Explain the variance between budget and actual.','fin'],
 ['year-end closing','/ˈjɪr end ˈkloʊzɪŋ/','khóa sổ cuối năm','Year-end closing takes about two weeks.','fin'],
 ['tax return','/tæks rɪˈtɝːn/','tờ khai thuế','File your tax return before the deadline.','fin'],
 ['value-added tax','/ˈvæljuː ˈædɪd tæks/','thuế giá trị gia tăng (VAT)','Value-added tax is charged on most goods.','fin'],
 ['corporate tax','/ˈkɔːrpərət tæks/','thuế thu nhập doanh nghiệp','Corporate tax rates differ between countries.','fin'],
 ['tax evasion','/tæks ɪˈveɪʒn/','trốn thuế','Tax evasion is a criminal offence.','fin'],
 ['subsidy','/ˈsʌbsədi/','trợ cấp','Farmers receive a government subsidy.','ielts'],
 ['unemployment','/ˌʌnɪmˈplɔɪmənt/','thất nghiệp','Unemployment fell to 4%.','ielts'],
 ['recession','/rɪˈseʃn/','suy thoái','The recession lasted two years.','ielts'],
 ['GDP','/ˌdʒiː diː ˈpiː/','tổng sản phẩm quốc nội','GDP grew by 3% last year.','ielts'],
 ['consumption','/kənˈsʌmpʃn/','tiêu dùng','Energy consumption is rising.','ielts'],
 ['expenditure','/ɪkˈspendɪtʃər/','khoản chi tiêu','Government expenditure on health increased.','ielts'],
 ['a significant increase','/ə sɪɡˈnɪfɪkənt ˈɪnkriːs/','sự tăng đáng kể','There was a significant increase in profits.','ielts'],
 ['plummet','/ˈplʌmɪt/','giảm mạnh, lao dốc','Share prices plummeted after the news.','ielts'],
 ['soar','/sɔːr/','tăng vọt','House prices soared last year.','ielts'],
 ['stabilize','/ˈsteɪbəlaɪz/','ổn định','Prices began to stabilize in June.','ielts'],
 ['peak','/piːk/','đạt đỉnh','Sales peaked at 5 million in 2021.','ielts'],
 ['account for','/əˈkaʊnt fɔːr/','chiếm (tỷ lệ)','Housing accounts for 40% of spending.','ielts'],
 ['in terms of','/ɪn tɝːmz əv/','xét về mặt','In terms of cost, online courses are cheaper.','ielts'],
 ['on the whole','/ɑːn ðə hoʊl/','nhìn chung','On the whole, the results were positive.','ielts'],
 ['detrimental','/ˌdetrɪˈmentl/','có hại','Debt can be detrimental to mental health.','ielts'],
 ['beneficial','/ˌbenɪˈfɪʃl/','có lợi','Saving early is beneficial.','ielts'],
 ['inevitable','/ɪnˈevɪtəbl/','không thể tránh khỏi','Some price rises are inevitable.','ielts'],
 ['feasible','/ˈfiːzəbl/','khả thi','A cheaper plan is more feasible.','ielts'],
 ['scarce','/skers/','khan hiếm','Water is scarce in some regions.','ielts'],
 ['affordable','/əˈfɔːrdəbl/','vừa túi tiền','Affordable housing is in short supply.','ielts'],
 ['self-employed','/ˌself ɪmˈplɔɪd/','tự kinh doanh','She has been self-employed for five years.','ielts'],
 ['income gap','/ˈɪnkʌm ɡæp/','khoảng cách thu nhập','The income gap between rich and poor is widening.','ielts'],
 ['cost of living','/kɔːst əv ˈlɪvɪŋ/','chi phí sinh hoạt','The cost of living is higher in big cities.','ielts'],
 ['frugal','/ˈfruːɡl/','tiết kiệm, thanh đạm','He is frugal and rarely eats out.','ielts'],
 ['extravagant','/ɪkˈstrævəɡənt/','xa hoa, lãng phí','An extravagant lifestyle can lead to debt.','ielts']
].map((a,i)=>({id:'x'+i,w:a[0],ipa:a[1],vi:a[2],ex:a[3],cat:a[4]})));

/* ---------- NGỮ PHÁP (thêm) ---------- */
DATA.grammar.push(
 {id:'g9',title:'Các cách diễn đạt tương lai (will / going to / Present Continuous)',level:'B1',
  body:`<ul><li><b>will</b>: quyết định tức thời, dự đoán, lời hứa. <i>I’ll send it now.</i></li>
  <li><b>be going to</b>: kế hoạch đã có, dự đoán có căn cứ. <i>We’re going to open a new branch.</i></li>
  <li><b>Present Continuous</b>: lịch hẹn đã sắp xếp. <i>I’m meeting the auditor at 3.</i></li>
  <li><b>Present Simple</b>: lịch trình cố định. <i>The train leaves at 9.</i></li></ul>`,
  quiz:[
   {q:'“The phone is ringing.” – “I ___ get it.”',o:["will","am going to","am getting"],a:0,e:'Quyết định tức thời → will.'},
   {q:'Look at those clouds! It ___ rain.',o:['will','is going to','rains'],a:1,e:'Dự đoán có căn cứ nhìn thấy → going to.'},
   {q:'I ___ the auditor at 3 p.m. tomorrow. It’s in my diary.',o:['meet','am meeting','will meet'],a:1,e:'Lịch hẹn đã sắp xếp → Present Continuous.'},
   {q:'The bank ___ at 8 a.m. every day.',o:['opens','is going to open','will open'],a:0,e:'Lịch cố định → Present Simple.'}]},
 {id:'g10',title:'So sánh (Comparatives & Superlatives)',level:'A2-B1',
  body:`<ul><li>Tính từ ngắn: <b>-er / the -est</b> (cheap → cheaper → the cheapest).</li><li>Tính từ dài: <b>more / the most</b> (expensive → more expensive → the most expensive).</li><li>Bất quy tắc: good–better–best, bad–worse–worst, far–further–furthest.</li><li>Bằng nhau: <b>as … as</b>. So sánh kép: <i>The more you save, the richer you become.</i></li></ul>`,
  quiz:[
   {q:'Online shopping is ___ than shopping in stores.',o:['convenienter','more convenient','most convenient'],a:1,e:'Tính từ dài → more + adj.'},
   {q:'This is ___ report I have ever read.',o:['the longest','longer','the most long'],a:0,e:'So sánh nhất tính từ ngắn: the + -est.'},
   {q:'This year’s profit is ___ than last year’s.',o:['good','better','best'],a:1,e:'good → better.'},
   {q:'The ___ you save, the ___ you have.',o:['more / more','most / most','more / most'],a:0,e:'The + so sánh hơn, the + so sánh hơn.'}]},
 {id:'g10b',title:'Câu tường thuật (Reported Speech)',level:'B1-B2',
  body:`<p>Khi tường thuật, lùi một thì: <i>present → past</i>, <i>past → past perfect</i>, <i>will → would</i>, <i>can → could</i>; đổi đại từ và trạng từ (<i>today → that day, tomorrow → the next day</i>).</p>
  <ul><li>“I <b>am</b> busy.” → He said he <b>was</b> busy.</li><li>“We <b>will</b> pay.” → She said they <b>would</b> pay.</li><li>“Did you send it?” → He asked <b>if I had sent</b> it.</li></ul>`,
  quiz:[
   {q:'“I am reviewing the budget.” → She said she ___ the budget.',o:['is reviewing','was reviewing','has reviewed'],a:1,e:'Lùi thì: am reviewing → was reviewing.'},
   {q:'“We will pay on Friday.” → They said they ___ on Friday.',o:['will pay','would pay','pay'],a:1,e:'will → would.'},
   {q:'“Did you sign the contract?” → He asked me ___ the contract.',o:['if I had signed','did I sign','if I signed?'],a:0,e:'Câu hỏi Yes/No → if + mệnh đề, lùi thì.'},
   {q:'“I’ll call you tomorrow.” → He said he would call me ___.',o:['tomorrow','the next day','yesterday'],a:1,e:'tomorrow → the next day.'}]},
 {id:'g11',title:'Danh động từ & động từ nguyên mẫu (V-ing / to V)',level:'B1-B2',
  body:`<ul><li>+ <b>V-ing</b>: enjoy, avoid, finish, consider, suggest, mind, keep, practice. <i>She avoids spending money.</i></li>
  <li>+ <b>to V</b>: want, need, decide, plan, hope, afford, manage, agree. <i>We decided to invest.</i></li>
  <li>Cả hai nhưng nghĩa khác: <i>stop doing</i> (dừng hẳn) vs <i>stop to do</i> (dừng lại để làm); <i>remember doing</i> (nhớ đã làm) vs <i>remember to do</i> (nhớ phải làm).</li>
  <li>Sau giới từ luôn dùng V-ing: <i>interested in learning</i>.</li></ul>`,
  quiz:[
   {q:'She enjoys ___ financial reports.',o:['to read','reading','read'],a:1,e:'enjoy + V-ing.'},
   {q:'We decided ___ the new system.',o:['adopting','to adopt','adopt'],a:1,e:'decide + to V.'},
   {q:'I’m interested in ___ my English.',o:['improve','to improve','improving'],a:2,e:'Sau giới từ → V-ing.'},
   {q:'Remember ___ the invoice before you leave.',o:['to send','sending','send'],a:0,e:'Nhớ phải làm (việc chưa làm) → remember to V.'}]},
 {id:'g12',title:'Danh từ đếm được / không đếm được & lượng từ',level:'A2-B1',
  body:`<ul><li><b>Không đếm được:</b> money, information, advice, equipment, cash, furniture, news, work, feedback → không thêm -s, dùng <i>much, a little, some, a lot of</i>.</li>
  <li><b>Đếm được số nhiều:</b> <i>many, a few, several, a number of</i>.</li>
  <li>Đơn vị: <i>a piece of advice, a bit of information</i>.</li>
  <li>Lỗi hay gặp: ✗ informations, ✗ advices, ✗ equipments.</li></ul>`,
  quiz:[
   {q:'Could you give me some ___ about the loan?',o:['informations','information','an information'],a:1,e:'information không đếm được.'},
   {q:'How ___ money do we need?',o:['many','much','a few'],a:1,e:'money không đếm được → much.'},
   {q:'There are only ___ invoices left.',o:['a few','a little','much'],a:0,e:'invoices đếm được số nhiều → a few.'},
   {q:'She gave me a useful piece of ___.',o:['advices','advice','advise'],a:1,e:'advice (danh từ, không đếm được).'}]},
 {id:'g13',title:'Past Continuous & Past Perfect',level:'B1-B2',
  body:`<ul><li><b>Past Continuous</b> (was/were + V-ing): việc đang diễn ra tại một thời điểm hoặc bị cắt ngang. <i>I was checking the ledger when the power went out.</i></li>
  <li><b>Past Perfect</b> (had + V3): việc xảy ra <u>trước</u> một việc khác trong quá khứ. <i>By the time we arrived, the meeting had finished.</i></li></ul>`,
  quiz:[
   {q:'I ___ the ledger when the power went out.',o:['checked','was checking','had checked'],a:1,e:'Việc đang diễn ra bị cắt ngang → Past Continuous.'},
   {q:'By the time we arrived, the meeting ___.',o:['finished','had finished','was finishing'],a:1,e:'Xảy ra trước “arrived” → Past Perfect.'},
   {q:'She ___ the report before she sent it.',o:['had reviewed','was reviewing','reviews'],a:0,e:'Hành động trước hành động “sent” → had reviewed.'},
   {q:'While he ___ , the phone rang.',o:['was working','had worked','works'],a:0,e:'While + Past Continuous.'}]},
 {id:'g14',title:'Câu ước & I wish / If only',level:'B2',
  body:`<ul><li><b>Hiện tại không có thật:</b> I wish + past simple. <i>I wish I had more time.</i> (were cho mọi ngôi: <i>I wish I were rich</i>)</li>
  <li><b>Quá khứ:</b> I wish + past perfect. <i>I wish I had saved more.</i></li>
  <li><b>Phàn nàn/mong đợi thay đổi:</b> I wish + would. <i>I wish the client would pay on time.</i></li>
  <li>If only mạnh hơn, cùng cấu trúc.</li></ul>`,
  quiz:[
   {q:'I wish I ___ more money right now.',o:['have','had','would have'],a:1,e:'Hiện tại không có thật → past simple.'},
   {q:'I wish I ___ for the exam earlier.',o:['studied','had studied','would study'],a:1,e:'Tiếc nuối quá khứ → past perfect.'},
   {q:'I wish he ___ late every day.',o:["wouldn't be",'isn’t','weren’t not'],a:0,e:'Phàn nàn hành vi hiện tại → would/wouldn’t.'},
   {q:'If only I ___ rich!',o:['am','were','will be'],a:1,e:'If only + past (were).'}]},
 {id:'g15',title:'Từ nối & liên từ (Linking words)',level:'B1-B2',
  body:`<ul><li><b>Tương phản:</b> but, however (đầu câu, có dấu phẩy), although/even though + mệnh đề, despite/in spite of + danh từ/V-ing.</li>
  <li><b>Nguyên nhân – kết quả:</b> because, since, as; because of + danh từ; so, therefore, as a result, consequently.</li>
  <li><b>Bổ sung:</b> and, moreover, in addition, furthermore.</li>
  <li><b>Ví dụ:</b> for example, for instance, such as.</li></ul>`,
  quiz:[
   {q:'___ the high prices, sales kept rising.',o:['Although','Despite','However'],a:1,e:'Despite + danh từ (the high prices).'},
   {q:'___ he was tired, he finished the report.',o:['Although','Despite','Because of'],a:0,e:'Although + mệnh đề.'},
   {q:'Costs rose sharply. ___, the company raised prices.',o:['Because','Therefore','Although'],a:1,e:'Kết quả → Therefore (đầu câu).'},
   {q:'The event was cancelled ___ the bad weather.',o:['because','because of','although'],a:1,e:'because of + danh từ.'}]},
 {id:'g16',title:'Hòa hợp chủ vị & lỗi thường gặp',level:'B1',
  body:`<ul><li>Chủ ngữ số ít + V-s: <i>Everyone <b>needs</b> money.</i> (everyone, each, either, neither, nobody đều số ít)</li>
  <li><i>The number of</i> + số nhiều → động từ số ít; <i>A number of</i> + số nhiều → động từ số nhiều.</li>
  <li>Chủ ngữ ghép bằng <i>and</i> → số nhiều; bằng <i>or / nor</i> → hợp với danh từ gần nhất.</li>
  <li>Các danh từ số ít về hình thức: <i>news, economics, mathematics</i>.</li></ul>`,
  quiz:[
   {q:'The number of accounts ___ increasing.',o:['is','are','be'],a:0,e:'The number of → số ít.'},
   {q:'Everyone ___ to submit the form.',o:['need','needs','are needing'],a:1,e:'Everyone → số ít.'},
   {q:'Economics ___ my favorite subject.',o:['are','is','were'],a:1,e:'Economics dạng số ít.'},
   {q:'Neither the manager nor the clerks ___ available.',o:['is','are','was'],a:1,e:'nor → hợp với danh từ gần nhất (clerks).'}]}
);

/* ---------- ĐỌC IELTS (thêm) ---------- */
DATA.ieltsReading.push(
 {id:'r3',title:'Why People Save Less Than They Plan',mins:10,
  text:`Surveys in several countries show that most adults intend to save a portion of their monthly income, yet few actually do. Economists call this the intention–action gap. One explanation is present bias: people place greater value on immediate rewards than on future benefits. Another is that saving requires repeated decisions, each of which is easy to postpone. Some employers have addressed the problem by enrolling staff automatically in pension schemes, allowing them to opt out if they wish. Studies show that this simple change can double participation rates. Nevertheless, critics point out that automatic enrolment does not help people who work for themselves or move frequently between jobs. Financial educators therefore recommend setting up a regular transfer to a separate account on payday, so that saving happens before spending.`,
  qs:[
   {q:'Most adults do not intend to save any of their income.',t:'tfng',a:1,e:'Văn bản: hầu hết CÓ ý định tiết kiệm → FALSE.'},
   {q:'Present bias means people prefer immediate rewards to future ones.',t:'tfng',a:0,e:'Đúng theo định nghĩa trong bài → TRUE.'},
   {q:'Automatic enrolment has tripled participation in pension schemes.',t:'tfng',a:1,e:'Bài nói “double” (gấp đôi) → FALSE.'},
   {q:'Self-employed people have less time to save than employees.',t:'tfng',a:2,e:'Chỉ nói tự động ghi danh không giúp họ, không nói về thời gian → NOT GIVEN.'},
   {q:'What do financial educators recommend?',t:'mc',o:['Spending first and saving what remains','A regular transfer to a separate account on payday','Avoiding pension schemes'],a:1,e:'Câu cuối.'}]},
 {id:'r4',title:'Microfinance and Small Business',mins:10,
  text:`Microfinance refers to small loans given to entrepreneurs who cannot obtain credit from traditional banks. The idea gained international attention in the 1970s, when a programme in Bangladesh lent small sums to groups of poor women. Repayment rates were unexpectedly high, often above 95 percent. Supporters argue that microloans allow families to start small businesses, such as sewing or food stalls, and gradually escape poverty. However, later research has produced mixed results. Some studies found only modest improvements in household income, while others reported that borrowers with high interest rates fell into debt. Regulators in several countries now require lenders to disclose interest rates clearly and to assess whether customers can afford to repay.`,
  qs:[
   {q:'Microfinance began in Bangladesh in the 1970s.',t:'tfng',a:2,e:'Bài nói ý tưởng thu hút chú ý quốc tế ở thập niên 1970, không nói “bắt đầu” → NOT GIVEN.'},
   {q:'Repayment rates in the early programme were often above 95 percent.',t:'tfng',a:0,e:'Đúng → TRUE.'},
   {q:'All later studies confirmed large income gains for borrowers.',t:'tfng',a:1,e:'“mixed results” → FALSE.'},
   {q:'Some regulators require lenders to state interest rates clearly.',t:'tfng',a:0,e:'“to disclose interest rates clearly” → TRUE.'},
   {q:'Which is a problem mentioned in the passage?',t:'mc',o:['Borrowers with high interest rates fell into debt','Banks refused to lend to women','Loans were too large'],a:0,e:'Câu 7.'}]},
 {id:'r5',title:'The Gig Economy',mins:10,
  text:`The gig economy describes a labour market in which people take short-term jobs, often arranged through digital platforms, rather than permanent positions. Drivers, delivery riders and freelance designers are typical examples. Workers value the flexibility of choosing when and where to work. In contrast, they usually lack benefits such as paid holiday, sick pay and employer pension contributions. Income can also be unpredictable, changing sharply from month to month. Governments are debating whether platform workers should be classified as employees or as independent contractors, a decision that would determine their legal rights. Some economists believe the gig economy will keep growing as technology makes it easier to connect workers with customers.`,
  qs:[
   {q:'Gig workers usually receive paid holiday.',t:'tfng',a:1,e:'“usually lack benefits such as paid holiday” → FALSE.'},
   {q:'Flexibility is valued by many gig workers.',t:'tfng',a:0,e:'→ TRUE.'},
   {q:'Gig workers earn more than permanent employees.',t:'tfng',a:2,e:'Không có so sánh mức thu nhập → NOT GIVEN.'},
   {q:'The classification of platform workers has been decided by all governments.',t:'tfng',a:1,e:'Chính phủ “are debating” → FALSE.'},
   {q:'Why might the gig economy keep growing?',t:'mc',o:['Technology makes matching workers and customers easier','Wages are guaranteed','Fewer people want flexibility'],a:0,e:'Câu cuối.'}]}
);

/* ---------- WRITING TASK 1/2 (thêm) ---------- */
DATA.ieltsTask1.push(
 {id:'t1c',title:'Bảng: Tỷ lệ dùng phương thức thanh toán (%)',cols:['2015','2023'],rows:[['Cash',55,25],['Debit card',25,30],['Credit card',15,18],['Mobile payment',5,27]],
  prompt:'The table shows the percentage of people using four payment methods in 2015 and 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. (150 words)'},
 {id:'t1d',title:'Biểu đồ: Lãi suất tiết kiệm trung bình (%) 2018–2024',cols:['Rate (%)'],rows:[['2018',1.5],['2019',1.8],['2020',0.6],['2021',0.5],['2022',2.4],['2023',4.1],['2024',3.8]],
  prompt:'The chart shows the average savings interest rate between 2018 and 2024. Summarise the information by selecting and reporting the main features. (150 words)'},
 {id:'t1e',title:'Bảng: Chi ngân sách công theo lĩnh vực (tỷ USD)',cols:['2000','2020'],rows:[['Education',90,160],['Health',70,210],['Defence',120,140],['Transport',40,55]],
  prompt:'The table shows government spending in four areas in 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. (150 words)'}
);
DATA.ieltsTask2.push(
 'Some people believe that money is the most important factor when choosing a job. Others think job satisfaction matters more. Discuss both views and give your opinion.',
 'In many countries, credit cards are widely used and people often spend more than they earn. What problems does this cause and what solutions can you suggest?',
 'Some argue that the rich should pay higher taxes to support the poor. To what extent do you agree or disagree?',
 'Financial education should be a compulsory subject in secondary schools. Do you agree or disagree?',
 'More and more people are shopping online rather than in stores. Is this a positive or negative development?',
 'Some people think that governments should control the prices of essential goods such as food and housing. Do you agree or disagree?',
 'Many young people find it hard to buy their first home. What are the causes and what measures could help?',
 'Companies today are making more profit than ever, yet many workers are paid low wages. Why is this and what can be done?'
);

/* ---------- SPEAKING (thêm) ---------- */
DATA.speakP1.push('What did you study, or what would you like to study?','Do you prefer working alone or in a team?','How do you usually get to work or school?','Do you think it is important to learn English? Why?','What do you usually do to relax after work?','Have you ever bought something online that you regretted?','How has your town changed in recent years?','Do you often read the news? What kind?','What is your favorite season and why?','Do you prefer paying by cash or by card?');
DATA.speakP2.push(
 {t:'Describe a company you admire.',pts:['what the company is','what it does','how you know about it','and explain why you admire it'],p3:['What makes a company successful?','Should companies care about the environment?','Will small businesses survive against large ones?']},
 {t:'Describe an important purchase you made.',pts:['what you bought','why you needed it','how much it cost','and explain how you felt about it'],p3:['Why do people buy things they do not need?','Does advertising influence what people buy?','Is it better to buy second-hand goods?']},
 {t:'Describe a time you helped a colleague or friend with a problem.',pts:['who you helped','what the problem was','what you did','and explain how it turned out'],p3:['Why is teamwork important at work?','How do people usually solve conflicts?','Should employers reward cooperation?']},
 {t:'Describe a place where you would like to work.',pts:['where it is','what work you would do there','what it looks like','and explain why you would like to work there'],p3:['Do people prefer to work in big or small cities?','Will remote work replace offices?','What makes a good workplace?']},
 {t:'Describe a skill you would like to learn.',pts:['what the skill is','why you want to learn it','how you would learn it','and explain how it would help you'],p3:['What skills are most valuable today?','Should schools teach practical skills?','Is it easier to learn as a child or an adult?']}
);

/* ---------- VIẾT (thêm) ---------- */
DATA.writing.push(
 {id:'w12',cat:'Email công việc',title:'Gửi báo cáo kèm giải trình chênh lệch',min:120,
  prompt:'Viết email gửi quản lý báo cáo chi phí quý 3, giải thích chênh lệch 12% so với ngân sách.',
  outline:['Subject','Mục đích + đính kèm','Tóm tắt số liệu chính','Nguyên nhân chênh lệch','Đề xuất tiếp theo'],
  phrases:['Please find attached…','As you can see, expenses exceeded the budget by…','The main reason for the variance is…','I suggest that we…','Let me know if you would like to discuss this.']},
 {id:'w13',cat:'Email công việc',title:'Yêu cầu báo giá từ nhà cung cấp',min:100,
  prompt:'Viết email cho nhà cung cấp phần mềm kế toán để hỏi giá, thời gian triển khai và hỗ trợ.',
  outline:['Giới thiệu công ty','Nhu cầu','Câu hỏi cụ thể','Hạn phản hồi'],
  phrases:['We are currently looking for…','Could you provide a quotation for…?','Could you also let us know…','We would appreciate your reply by…']},
 {id:'w14',cat:'Mô tả',title:'Mô tả biểu đồ/xu hướng doanh thu',min:150,
  prompt:'Mô tả xu hướng doanh thu 5 năm gần đây của một công ty (tự đặt số liệu).',
  outline:['Giới thiệu','Xu hướng chung','Chi tiết theo giai đoạn','Kết luận'],
  phrases:['Revenue rose steadily from… to…','There was a sharp fall in…','It peaked at…','Overall, the trend was upward.']},
 {id:'w15',cat:'Quan điểm (IELTS Task 2)',title:'Nên dạy quản lý tài chính ở trường?',min:250,
  prompt:'Financial education should be a compulsory subject in secondary schools. Do you agree or disagree?',
  outline:['Mở bài','Lý do 1: kỹ năng sống','Lý do 2: giảm nợ/rủi ro','Ý kiến trái chiều ngắn + kết luận'],
  phrases:['It is essential that…','Equipping students with… will…','Critics may argue… but…','In conclusion, …']},
 {id:'w16',cat:'Kể chuyện',title:'Lần đầu bạn tiết kiệm/đầu tư',min:150,
  prompt:'Kể về một lần bạn tiết kiệm hoặc đầu tư một khoản tiền và kết quả.',
  outline:['Bối cảnh','Quyết định','Diễn biến','Bài học'],
  phrases:['I still remember when…','I decided to…','Little by little…','Looking back, …']},
 {id:'w17',cat:'Phỏng vấn / CV',title:'Thư xin việc (Cover letter) vị trí kế toán',min:180,
  prompt:'Viết thư xin việc cho vị trí Accountant tại một công ty đa quốc gia.',
  outline:['Mở đầu: vị trí + nguồn thông tin','Kinh nghiệm & kỹ năng','Vì sao phù hợp','Kết + đề nghị phỏng vấn'],
  phrases:['I am writing to apply for the position of…','I have … years of experience in…','I am proficient in…','I would welcome the opportunity to…','Yours sincerely,']},
 {id:'w18',cat:'So sánh / Nguyên nhân',title:'Làm việc tại nhà vs tại văn phòng',min:200,
  prompt:'So sánh lợi ích và bất lợi của làm việc tại nhà và tại văn phòng.',
  outline:['Giới thiệu','Làm việc tại nhà','Làm việc tại văn phòng','Ý kiến của bạn'],
  phrases:['One advantage of working from home is…','In contrast, working in an office allows…','Personally, I prefer… because…']}
);

/* ---------- NGHE (thêm dictation) ---------- */
DATA.dictation.push(
 'The company had to cut costs after revenue fell by fifteen percent.',
 'Please confirm whether the payment has been received.',
 'We are expecting a significant rise in interest rates next quarter.',
 'The finance department prepares the annual budget in October.',
 'If we had reviewed the contract earlier, we would have avoided this problem.',
 'Could you send me the updated balance sheet before the meeting?',
 'The auditors found that internal controls were weak.',
 'Cash flow problems are a leading cause of small business failure.',
 'Inventory levels have dropped because demand is higher than expected.',
 'She was promoted to finance manager after working here for five years.'
);
DATA.shadow.push(
 'We need to submit the tax return before the end of the month.',
 'Could you walk me through the cash flow statement?',
 "The exchange rate has been fluctuating a lot recently.",
 "I'll get back to you with the numbers by the end of the week."
);
DATA.pairs.push(['bank','bunk'],['ship','chip'],['light','late'],['sheet','seat']);

/* ---------- NGHE: link dự phòng qua YouTube (khi BBC/VOA/Investopedia bị chặn mạng) ---------- */
DATA.listenGroups.push({g:'🛟 Link dự phòng qua YouTube (dùng khi trang gốc không mở được)',items:[
 ['BBC 6 Minute English (YouTube)','Cùng nội dung BBC, có phụ đề.','https://www.youtube.com/results?search_query=BBC+6+Minute+English+business'],
 ['VOA Learning English – Business (YouTube)','Tin kinh tế tốc độ chậm, giọng Mỹ.','https://www.youtube.com/results?search_query=VOA+Learning+English+business+economics'],
 ['Investopedia (YouTube)','Giải thích thuật ngữ tài chính.','https://www.youtube.com/results?search_query=Investopedia+explained+finance+terms'],
 ['British Council LearnEnglish Listening (YouTube)','Bài nghe theo trình độ.','https://www.youtube.com/results?search_query=LearnEnglish+British+Council+listening'],
 ['Kế toán bằng tiếng Anh – phụ đề','Video kế toán có phụ đề tiếng Anh.','https://www.youtube.com/results?search_query=accounting+english+vocabulary+for+accountants']
]});
