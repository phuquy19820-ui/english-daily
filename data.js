/* Nội dung học: từ vựng, ngữ pháp, phát âm, nghe, viết, IELTS */
const DATA = {};

/* ---------- TỪ VỰNG (tài chính - kế toán + học thuật IELTS) ---------- */
DATA.vocab = [
  ['asset','/ˈæset/','tài sản','The company sold several assets to pay its debts.','fin'],
  ['liability','/ˌlaɪəˈbɪləti/','nợ phải trả; trách nhiệm pháp lý','Long-term liabilities include bank loans.','fin'],
  ['equity','/ˈekwəti/','vốn chủ sở hữu','Owner’s equity is assets minus liabilities.','fin'],
  ['revenue','/ˈrevənuː/','doanh thu','Revenue grew by 8% compared to last year.','fin'],
  ['expense','/ɪkˈspens/','chi phí','Travel expenses must be approved in advance.','fin'],
  ['net income','/net ˈɪnkʌm/','lợi nhuận ròng','Net income is revenue minus all expenses and taxes.','fin'],
  ['balance sheet','/ˈbæləns ʃiːt/','bảng cân đối kế toán','The balance sheet shows what a company owns and owes.','fin'],
  ['income statement','/ˈɪnkʌm ˈsteɪtmənt/','báo cáo kết quả kinh doanh','Please review the income statement for Q3.','fin'],
  ['cash flow','/ˈkæʃ floʊ/','dòng tiền','Positive cash flow keeps a business healthy.','fin'],
  ['depreciation','/dɪˌpriːʃiˈeɪʃn/','khấu hao (tài sản hữu hình)','Depreciation spreads the cost of equipment over its useful life.','fin'],
  ['amortization','/ˌæmərtəˈzeɪʃn/','phân bổ (tài sản vô hình / khoản vay)','Amortization of the software license is recorded monthly.','fin'],
  ['accrual','/əˈkruːəl/','dồn tích','Accrual accounting records income when it is earned.','fin'],
  ['receivable','/rɪˈsiːvəbl/','khoản phải thu','Accounts receivable rose because customers paid late.','fin'],
  ['payable','/ˈpeɪəbl/','khoản phải trả','We must clear accounts payable before year-end.','fin'],
  ['inventory','/ˈɪnvəntɔːri/','hàng tồn kho','The warehouse counts its inventory every quarter.','fin'],
  ['audit','/ˈɔːdɪt/','kiểm toán','An external firm will audit our accounts in March.','fin'],
  ['ledger','/ˈledʒər/','sổ cái','Each transaction is posted to the general ledger.','fin'],
  ['journal entry','/ˈdʒɝːnl ˈentri/','bút toán','She recorded a journal entry to correct the error.','fin'],
  ['debit','/ˈdebɪt/','ghi nợ; bên Nợ','Debit cash and credit revenue when a customer pays.','fin'],
  ['credit','/ˈkredɪt/','ghi có; bên Có; tín dụng','The credit side of the entry must equal the debit side.','fin'],
  ['invoice','/ˈɪnvɔɪs/','hóa đơn','Please send the invoice by the end of the day.','fin'],
  ['budget','/ˈbʌdʒɪt/','ngân sách','We need to stay within the marketing budget.','fin'],
  ['forecast','/ˈfɔːrkæst/','dự báo','The sales forecast for next year looks optimistic.','fin'],
  ['overhead','/ˈoʊvərhed/','chi phí gián tiếp / chung','Rent and utilities are part of overhead.','fin'],
  ['gross margin','/ɡroʊs ˈmɑːrdʒɪn/','biên lợi nhuận gộp','Our gross margin improved to 35%.','fin'],
  ['tax deduction','/tæks dɪˈdʌkʃn/','khoản khấu trừ thuế','Charitable donations may qualify as a tax deduction.','fin'],
  ['withholding tax','/wɪðˈhoʊldɪŋ tæks/','thuế khấu trừ tại nguồn','Withholding tax is deducted from the payment.','fin'],
  ['dividend','/ˈdɪvɪdend/','cổ tức','The board declared a dividend of $0.50 per share.','fin'],
  ['shareholder','/ˈʃerhoʊldər/','cổ đông','Shareholders vote at the annual meeting.','fin'],
  ['interest rate','/ˈɪntrəst reɪt/','lãi suất','The central bank raised the interest rate again.','fin'],
  ['inflation','/ɪnˈfleɪʃn/','lạm phát','High inflation reduces purchasing power.','fin'],
  ['liquidity','/lɪˈkwɪdəti/','tính thanh khoản','The firm has enough liquidity to cover short-term debts.','fin'],
  ['solvency','/ˈsɑːlvənsi/','khả năng thanh toán (dài hạn)','Investors check solvency before buying bonds.','fin'],
  ['leverage','/ˈlevərɪdʒ/','đòn bẩy tài chính','High leverage increases both risk and potential return.','fin'],
  ['portfolio','/pɔːrtˈfoʊlioʊ/','danh mục đầu tư','A diversified portfolio reduces risk.','fin'],
  ['compliance','/kəmˈplaɪəns/','sự tuân thủ','Compliance with tax law is mandatory.','fin'],
  ['reconcile','/ˈrekənsaɪl/','đối chiếu (số liệu)','Please reconcile the bank statement with the ledger.','fin'],
  ['fiscal year','/ˈfɪskl jɪr/','năm tài chính','Our fiscal year ends on December 31.','fin'],
  ['write off','/ˈraɪt ɔːf/','xóa sổ (nợ, tài sản)','The bad debt was written off last quarter.','fin'],
  ['turnover','/ˈtɝːnoʊvər/','doanh số; vòng quay','Annual turnover exceeded two million dollars.','fin'],
  ['allocate','/ˈæləkeɪt/','phân bổ','We allocate resources according to priority.','ielts'],
  ['fluctuate','/ˈflʌktʃueɪt/','dao động','Oil prices fluctuate throughout the year.','ielts'],
  ['substantial','/səbˈstænʃl/','đáng kể, lớn','There was a substantial increase in online sales.','ielts'],
  ['mitigate','/ˈmɪtɪɡeɪt/','giảm thiểu','Diversifying can mitigate financial risk.','ielts'],
  ['sustainable','/səˈsteɪnəbl/','bền vững','Sustainable growth matters more than quick profit.','ielts'],
  ['stakeholder','/ˈsteɪkhoʊldər/','bên liên quan','All stakeholders were informed about the merger.','ielts'],
  ['outweigh','/ˌaʊtˈweɪ/','nặng hơn, vượt trội hơn','The benefits outweigh the costs.','ielts'],
  ['tackle','/ˈtækl/','giải quyết (vấn đề)','Governments must tackle rising living costs.','ielts']
].map((a,i)=>({id:'v'+i,w:a[0],ipa:a[1],vi:a[2],ex:a[3],cat:a[4]}));

/* ---------- NGỮ PHÁP ---------- */
DATA.grammar = [
 {id:'g1',title:'Present Simple vs Present Continuous',level:'A2',
  body:`<p><b>Present Simple</b> (V / V-s): thói quen, sự thật, lịch trình. Dấu hiệu: <i>always, usually, every day, on Mondays</i>.</p>
  <p><b>Present Continuous</b> (am/is/are + V-ing): việc đang xảy ra lúc nói hoặc tạm thời. Dấu hiệu: <i>now, at the moment, this week</i>.</p>
  <p><b>Lưu ý:</b> động từ chỉ trạng thái (<i>know, understand, like, want, need, believe</i>) thường <u>không</u> dùng thì tiếp diễn.</p>
  <ul><li>She <b>prepares</b> the reports every Monday.</li><li>The auditors <b>are checking</b> the invoices right now.</li><li>I <b>understand</b> the problem. (không nói: I am understanding)</li></ul>`,
  quiz:[
   {q:'The accountant ___ the reports every Monday.',o:['prepares','is preparing','prepare'],a:0,e:'Thói quen lặp lại → Present Simple, chủ ngữ số ít thêm -s.'},
   {q:'Look! The auditor ___ the invoices right now.',o:['checks','is checking','checked'],a:1,e:'“Look!/right now” → đang diễn ra → Present Continuous.'},
   {q:'She ___ coffee. She prefers tea.',o:["doesn't like","isn't liking","don't like"],a:0,e:'“like” là động từ trạng thái; chủ ngữ she → doesn’t.'},
   {q:'I ___ what you mean.',o:['am understanding','understand','understanding'],a:1,e:'“understand” là động từ trạng thái, không dùng tiếp diễn.'}]},
 {id:'g2',title:'Past Simple vs Present Perfect',level:'B1',
  body:`<p><b>Past Simple</b>: hành động đã xong ở thời điểm xác định trong quá khứ (<i>yesterday, in 2019, last week, ago</i>).</p>
  <p><b>Present Perfect</b> (have/has + V3): liên quan đến hiện tại — trải nghiệm (<i>ever, never</i>), việc kéo dài đến nay (<i>for, since</i>), kết quả còn thấy (<i>already, yet, just</i>).</p>
  <ul><li>We <b>finished</b> the audit yesterday.</li><li>I <b>have worked</b> here <b>since</b> 2020.</li><li>Have you <b>ever written</b> a financial report in English?</li></ul>`,
  quiz:[
   {q:'I ___ in this company since 2020.',o:['work','worked','have worked'],a:2,e:'“since 2020” → còn đang làm → Present Perfect.'},
   {q:'We ___ the audit yesterday.',o:['finished','have finished','finish'],a:0,e:'“yesterday” là thời điểm xác định → Past Simple.'},
   {q:'Have you ever ___ a financial report in English?',o:['write','wrote','written'],a:2,e:'have + V3 (written).'},
   {q:'She ___ to Hanoi in 2019.',o:['has moved','moved','moves'],a:1,e:'“in 2019” → Past Simple.'}]},
 {id:'g3',title:'Mạo từ: a / an / the / không mạo từ',level:'A2-B1',
  body:`<p><b>a/an</b>: danh từ đếm được số ít, nhắc lần đầu / chung chung. <b>an</b> trước <u>âm</u> nguyên âm (<i>an accountant, an hour</i>).</p>
  <p><b>the</b>: người nghe đã biết là cái nào; duy nhất (<i>the sun</i>); đã nhắc trước đó; nhạc cụ (<i>the guitar</i>).</p>
  <p><b>Không mạo từ</b>: danh từ số nhiều / không đếm được nói chung (<i>Inflation is a problem</i>), tên riêng, môn học, bữa ăn.</p>`,
  quiz:[
   {q:'She is ___ accountant.',o:['a','an','the'],a:1,e:'“accountant” bắt đầu bằng âm nguyên âm → an.'},
   {q:'___ inflation is a serious problem in many countries.',o:['The','A','(no article)'],a:2,e:'Danh từ không đếm được nói chung → không mạo từ.'},
   {q:'I saw a report. ___ report was very long.',o:['A','The','(no article)'],a:1,e:'Đã nhắc trước đó → the.'},
   {q:'He plays ___ guitar in a band.',o:['a','the','(no article)'],a:1,e:'Nhạc cụ dùng “the”.'}]},
 {id:'g4',title:'Câu điều kiện (loại 0, 1, 2, 3)',level:'B1',
  body:`<ul><li><b>Loại 0</b> (sự thật): If + present, present. <i>Water boils if you heat it to 100°C.</i></li>
  <li><b>Loại 1</b> (có thể xảy ra): If + present, will + V. <i>If you send the invoice today, we will pay on time.</i></li>
  <li><b>Loại 2</b> (không có thật ở hiện tại): If + past, would + V. <i>If I had more money, I would invest.</i></li>
  <li><b>Loại 3</b> (không có thật ở quá khứ): If + had + V3, would have + V3. <i>If she had checked, she would have found the error.</i></li></ul>`,
  quiz:[
   {q:'If you ___ the invoice today, we will pay on time.',o:['send','sent','will send'],a:0,e:'Loại 1: If + present simple.'},
   {q:'If I ___ more money, I would invest in stocks.',o:['have','had','would have'],a:1,e:'Loại 2: If + past simple.'},
   {q:'If she had checked the numbers, she ___ the error.',o:['would find','would have found','will find'],a:1,e:'Loại 3: would have + V3.'},
   {q:'Water ___ if you heat it to 100°C.',o:['boils','would boil','boiled'],a:0,e:'Loại 0: sự thật hiển nhiên → present simple.'}]},
 {id:'g5',title:'Câu bị động (Passive Voice)',level:'B1',
  body:`<p>Cấu trúc: <b>be + V3</b>. Dùng khi tác nhân không quan trọng hoặc không biết — rất phổ biến trong báo cáo tài chính, IELTS Writing Task 1.</p>
  <ul><li>Present: Taxes <b>are paid</b> every quarter.</li><li>Past: The statements <b>were approved</b> by the CFO.</li><li>Future: The report <b>will be completed</b> by Friday.</li><li>Present Perfect: The accounts <b>have been audited</b>.</li></ul>`,
  quiz:[
   {q:'The financial statements ___ by the CFO yesterday.',o:['approved','were approved','are approving'],a:1,e:'Quá khứ bị động: were + V3.'},
   {q:'Taxes ___ every quarter.',o:['are paid','pay','is paid'],a:0,e:'Số nhiều + hiện tại bị động: are paid.'},
   {q:'The report ___ by next Friday.',o:['will be completed','will complete','completes'],a:0,e:'Tương lai bị động: will be + V3.'},
   {q:'Passive of “They have audited the accounts.”',o:['The accounts have been audited.','The accounts were have audited.','The accounts have audited.'],a:0,e:'Perfect bị động: have been + V3.'}]},
 {id:'g6',title:'Động từ khuyết thiếu (Modal verbs)',level:'B1',
  body:`<ul><li><b>must</b>: bắt buộc / suy đoán chắc chắn. <b>mustn’t</b>: cấm. <b>don’t have to</b>: không cần.</li>
  <li><b>should</b>: lời khuyên. <b>can/could</b>: khả năng, xin phép lịch sự. <b>may/might</b>: có thể (không chắc).</li>
  <li>Suy đoán: <i>She must be at the office (chắc chắn). She might be late (có thể).</i></li></ul>`,
  quiz:[
   {q:'You ___ submit the tax return before the deadline.',o:['must','may','would'],a:0,e:'Nghĩa vụ → must.'},
   {q:'She ___ be at the office; her coat is here.',o:['must','should','can'],a:0,e:'Suy đoán chắc chắn từ bằng chứng → must be.'},
   {q:'You ___ smoke here. It is forbidden.',o:["mustn't","don't have to","needn't"],a:0,e:'Cấm → mustn’t.'},
   {q:'I ___ swim when I was five.',o:['can','could','may'],a:1,e:'Khả năng trong quá khứ → could.'}]},
 {id:'g7',title:'Mệnh đề quan hệ (who / which / that / whose / where)',level:'B1-B2',
  body:`<ul><li><b>who/that</b> → người: <i>The auditor who found the error is my friend.</i></li>
  <li><b>which/that</b> → vật: <i>The report which I read was long.</i></li>
  <li><b>whose</b> → sở hữu: <i>The company whose profits fell went bankrupt.</i></li>
  <li><b>where</b> → nơi chốn: <i>This is the office where I work.</i></li></ul>
  <p>Dùng để nối câu → tăng band Grammatical Range trong IELTS.</p>`,
  quiz:[
   {q:'The auditor ___ found the error is my friend.',o:['who','which','whose'],a:0,e:'Người + chủ ngữ của mệnh đề → who.'},
   {q:'The report ___ I read yesterday was long.',o:['who','which','what'],a:1,e:'Vật → which/that.'},
   {q:'The company ___ profits fell went bankrupt.',o:['who','which','whose'],a:2,e:'Sở hữu (profits của company) → whose.'},
   {q:'This is the office ___ I work.',o:['where','which','who'],a:0,e:'Nơi chốn → where.'}]},
 {id:'g8',title:'Giới từ thường gặp (thời gian, xu hướng, đi kèm)',level:'B1',
  body:`<ul><li><b>Thời gian:</b> at 9 a.m. / on Monday / in March, in 2024.</li>
  <li><b>Xu hướng (IELTS Task 1):</b> increase <b>by</b> 10% (mức tăng) — rise <b>to</b> $5m (đạt tới) — from 3m <b>to</b> 5m.</li>
  <li><b>Đi kèm:</b> responsible <b>for</b>, depend <b>on</b>, interested <b>in</b>, good <b>at</b>, afraid <b>of</b>, different <b>from</b>.</li></ul>`,
  quiz:[
   {q:'The meeting is ___ 9 a.m. ___ Monday.',o:['at / on','on / at','in / on'],a:0,e:'at + giờ; on + thứ.'},
   {q:'Profits increased ___ 15%.',o:['by','to','at'],a:0,e:'increase by + mức chênh lệch.'},
   {q:'She is responsible ___ the budget.',o:['for','of','to'],a:0,e:'responsible for.'},
   {q:'We depend ___ our suppliers.',o:['on','in','of'],a:0,e:'depend on.'}]}
];

/* ---------- PHÁT ÂM ANH-MỸ ---------- */
DATA.sounds = [
 {ipa:'/θ/ và /ð/',name:'“th”',tip:'Đặt đầu lưỡi nhẹ giữa hai hàm răng rồi thổi hơi. /θ/ không rung cổ (think), /ð/ rung cổ (this). Người Việt hay đọc thành /t/, /d/ hoặc /s/, /z/.',words:['think','three','thanks','thirty','this','that','the','other']},
 {ipa:'/ɪ/ vs /i/',name:'i ngắn – i dài',tip:'/ɪ/ ngắn, môi thả lỏng (ship). /i/ dài, môi kéo ngang (sheep). Đây là cặp gây nhầm nghĩa nhiều nhất.',words:['ship','sheep','live','leave','fill','feel','bit','beat']},
 {ipa:'/æ/',name:'“a” miệng rộng',tip:'Mở miệng rộng như nói “e” + “a” cùng lúc, hàm dưới hạ thấp. Đặc trưng Anh-Mỹ: bank, tax, cash, planning.',words:['bank','tax','cash','planning','manage','analyze','happy','back']},
 {ipa:'/ʌ/ và /ɑː/',name:'cup – stock',tip:'/ʌ/ ngắn, miệng mở vừa (cup, budget, up). /ɑː/ mở to, lưỡi hạ thấp (stock, model, John). Mỹ: “not” /nɑːt/.',words:['cup','budget','up','money','stock','model','John','hot']},
 {ipa:'/ɝ/ và /r/',name:'R kiểu Mỹ',tip:'Cuộn đầu lưỡi lên nhưng KHÔNG chạm vòm miệng, môi hơi tròn. Âm r xuất hiện cả cuối từ (report, dollar, order) — không nuốt âm r như Anh-Anh.',words:['work','world','report','dollar','order','return','research','turnover']},
 {ipa:'/l/ cuối từ',name:'dark L',tip:'Đầu lưỡi chạm nướu răng trên và giữ lại; đừng bỏ âm l cuối. Người Việt hay nuốt: bill, total, full.',words:['bill','total','full','skill','financial','table','model','deal']},
 {ipa:'/ʃ/ /tʃ/ /dʒ/',name:'sh – ch – j',tip:'/ʃ/ (share) hơi trượt liên tục; /tʃ/ (check) bật hơi; /dʒ/ (budget, manage) như “ch” nhưng rung cổ.',words:['share','shift','check','charge','budget','manage','judge','major']},
 {ipa:'/ŋ/',name:'-ng',tip:'Cuống lưỡi chạm ngạc mềm, KHÔNG bật âm g rõ ràng. banking = /ˈbæŋkɪŋ/.',words:['banking','running','building','saving','long','strong','thing','morning']},
 {ipa:'-s / -ed cuối từ',name:'âm cuối',tip:'Phát âm ĐỦ âm cuối — quan trọng cho nghe và IELTS. -s: /s/ (assets), /z/ (bags), /ɪz/ (bonuses). -ed: /t/ (worked), /d/ (played), /ɪd/ (wanted).',words:['assets','bags','bonuses','worked','played','wanted','costs','ended']},
 {ipa:'Flap T /ɾ/',name:'t giữa hai nguyên âm',tip:'Người Mỹ đọc /t/ giữa hai nguyên âm gần như /d/ nhẹ: water, better, meeting, quality, city. Đây là nét Anh-Mỹ rõ nhất.',words:['water','better','meeting','quality','city','waiting','accounting','total']},
 {ipa:'/ə/ schwa',name:'âm yếu',tip:'Âm phổ biến nhất tiếng Anh: nguyên âm ở âm tiết KHÔNG nhấn đọc rất nhẹ, ngắn: about /əˈbaʊt/, accountant /əˈkaʊntənt/, the /ðə/.',words:['about','accountant','balance','company','another','support','today','financial']},
 {ipa:'Trọng âm từ',name:'word stress',tip:'Trọng âm sai → người nghe khó hiểu hơn phát âm sai âm. Danh từ 2 âm tiết thường nhấn âm 1, động từ nhấn âm 2: REcord (n) / reCORD (v). Đuôi -tion, -ic, -ity kéo trọng âm về trước nó.',words:['record','account','accountant','economy','economics','economic','forecast','decision']}
];
DATA.pairs = [['think','sink'],['right','light'],['ship','sheep'],['cup','cap'],['bed','bad'],['work','walk'],['very','berry'],['cost','coast'],['full','fool'],['bit','beat'],['live','leave'],['three','tree']];
DATA.shadow = [
 'Our net income increased by twelve percent compared to last quarter.',
 'The auditor asked us to reconcile the accounts before the deadline.',
 'Could you send me the invoice by the end of the day?',
 'Cash flow is more important than profit for a small business.',
 "I'd like to go over the balance sheet with you this afternoon.",
 'Interest rates are expected to go up later this year.',
 'We need to allocate more budget to marketing next quarter.',
 "What's the difference between an asset and a liability?"
];
DATA.rules = [
 ['Nối âm (linking)','Phụ âm cuối + nguyên âm đầu → nối liền: “check it out” → /tʃe.kɪ.taʊt/; “an asset” → /ə.næ.set/.'],
 ['Nhấn – nhả (stress-timed)','Tiếng Anh nhấn vào từ nội dung (danh từ, động từ chính, tính từ), đọc lướt các từ chức năng (of, to, and, the): “I’d LIKE to GO over the BALance SHEET”.'],
 ['Rút gọn & yếu hóa','want to → wanna, going to → gonna, have to → hafta, could have → coulda. Hiểu để NGHE tốt; dùng khi nói thân mật.'],
 ['Ngữ điệu','Câu Wh- và câu khẳng định xuống giọng ở cuối; câu Yes/No lên giọng; liệt kê: lên, lên, xuống (assets, liabilities, and equity ↘).'],
 ['Cách luyện: Shadowing','Nghe 1 câu → nhại lại ĐỒNG THỜI/ngay sau đó, bắt chước nhịp, trọng âm, ngữ điệu → thu âm → so sánh. 10–15 phút/ngày, lặp lại cùng đoạn 3–5 lần.']
];

/* ---------- NGHE ---------- */
DATA.listenGroups = [
 {g:'🇺🇸 Tài chính – Kế toán bằng giọng Mỹ (miễn phí)',items:[
  ['NPR Planet Money','Podcast kinh tế – tài chính kể chuyện rất dễ nghe, có transcript. Trình độ B1-B2.','https://www.npr.org/podcasts/510289/planet-money'],
  ['Marketplace','Tin kinh tế – kinh doanh hằng ngày, tiếng Mỹ chuẩn, có transcript.','https://www.marketplace.org/'],
  ['Khan Academy – Finance & Economics','Video bài giảng tài chính, kế toán cơ bản, phụ đề tiếng Anh, nói chậm rõ.','https://www.khanacademy.org/economics-finance-domain'],
  ['Investopedia (video + bài đọc)','Giải thích thuật ngữ tài chính: bảng cân đối, dòng tiền, cổ phiếu…','https://www.investopedia.com/'],
  ['AccountingCoach','Bài học kế toán có giải thích rõ ràng, hợp để nghe – đọc song song.','https://www.accountingcoach.com/'],
  ['Accounting Stuff (YouTube)','Kênh dạy kế toán cơ bản bằng tiếng Anh, tốc độ vừa phải.','https://www.youtube.com/@AccountingStuff'],
  ['TED – Business / Economics','Bài nói ngắn có phụ đề & transcript, chọn chủ đề Business/Economics.','https://www.ted.com/topics/business']]},
 {g:'🎓 Luyện nghe cho người học (có tốc độ chậm, có bài tập)',items:[
  ['VOA Learning English','Tin tức giọng Mỹ tốc độ chậm; có mục Business & Economics, có transcript.','https://learningenglish.voanews.com/'],
  ['BBC 6 Minute English','Đối thoại 6 phút, có từ vựng và transcript (giọng Anh-Anh, dùng để làm quen thêm).','https://www.bbc.co.uk/learningenglish/english/features/6-minute-english'],
  ['ELLLO','Hàng nghìn bài nghe với nhiều giọng, có bài tập nhỏ.','https://www.elllo.org/'],
  ['Breaking News English','Tin tức theo nhiều cấp độ, kèm bài nghe – điền từ.','https://breakingnewsenglish.com/'],
  ['British Council – LearnEnglish Listening','Bài nghe theo trình độ A1–C1.','https://learnenglish.britishcouncil.org/skills/listening']]},
 {g:'🔎 Tìm nhanh trên YouTube (mở kết quả tìm kiếm)',items:[
  ['Accounting basics in English','Tìm video kế toán cơ bản có phụ đề.','https://www.youtube.com/results?search_query=accounting+basics+for+beginners+english&sp=EgIoAQ%253D%253D'],
  ['Balance sheet explained','Bảng cân đối kế toán giải thích đơn giản.','https://www.youtube.com/results?search_query=balance+sheet+explained+simple'],
  ['Financial statements explained','Ba báo cáo tài chính chính.','https://www.youtube.com/results?search_query=financial+statements+explained+for+beginners'],
  ['IELTS Listening practice','Đề nghe IELTS có phụ đề.','https://www.youtube.com/results?search_query=IELTS+listening+practice+test+with+answers']]}
];
DATA.dictation = [
 'The company reported a net profit of two million dollars last year.',
 'Please reconcile the bank statement with the general ledger.',
 'Accounts receivable increased because customers paid late.',
 'The finance team will present the quarterly forecast on Thursday.',
 'Depreciation reduces the value of equipment over time.',
 'We should double-check the invoice before sending it to the client.',
 'Inflation has pushed up the cost of raw materials.',
 'The auditor found a small error in the tax calculation.',
 'Our budget for next year has been approved by the board.',
 'Could you explain the difference between cash and accrual accounting?'
];

/* ---------- VIẾT THEO CHỦ ĐỀ ---------- */
DATA.writing = [
 {id:'w1',cat:'Email công việc',title:'Nhắc khách hàng thanh toán hóa đơn trễ',min:100,
  prompt:'Viết email lịch sự nhắc khách hàng thanh toán hóa đơn số INV-2045 (US$3,200) đã quá hạn 15 ngày.',
  outline:['Chủ đề (Subject) rõ ràng','Lời chào + nêu mục đích','Chi tiết hóa đơn (số, số tiền, hạn)','Đề nghị hành động + thời hạn mới','Kết thư lịch sự'],
  phrases:['I’m writing to remind you that…','According to our records, invoice no. … is overdue.','Could you please arrange payment by …?','If you have already made the payment, please disregard this message.','Please let me know if you have any questions.','Best regards,']},
 {id:'w2',cat:'Email công việc',title:'Xin gia hạn nộp báo cáo',min:100,
  prompt:'Viết email cho sếp xin lùi hạn nộp báo cáo quý từ thứ Sáu sang thứ Hai vì dữ liệu từ ngân hàng đến trễ.',
  outline:['Chào + mục đích','Lý do','Đề xuất thời hạn mới','Cam kết / giảm thiểu ảnh hưởng','Cảm ơn'],
  phrases:['I would like to request an extension for…','Unfortunately, we have not yet received…','I expect to finish it by…','I apologize for any inconvenience.','Thank you for your understanding.']},
 {id:'w3',cat:'Mô tả',title:'Công việc hằng ngày của bạn',min:120,
  prompt:'Mô tả công việc và một ngày làm việc điển hình của bạn.',
  outline:['Giới thiệu vị trí','Việc buổi sáng','Việc buổi chiều','Điều bạn thích / thách thức'],
  phrases:['I work as a … at …','My main responsibilities include…','I usually start my day by…','After lunch, I…','What I enjoy most about my job is…']},
 {id:'w4',cat:'Mô tả',title:'Giải thích một quy trình (ví dụ: khóa sổ cuối tháng)',min:150,
  prompt:'Giải thích các bước khóa sổ cuối tháng, hoặc một quy trình bạn quen thuộc, cho đồng nghiệp mới.',
  outline:['Câu mở: mục đích quy trình','Bước 1–2–3… dùng từ nối thứ tự','Lưu ý / lỗi thường gặp','Kết quả cuối cùng'],
  phrases:['First of all, …','After that, / Next, / Then, …','Once this is done, …','Make sure that…','Finally, …','This process is important because…']},
 {id:'w5',cat:'Kể chuyện',title:'Một lần bạn mắc lỗi ở nơi làm việc',min:150,
  prompt:'Kể về một lần bạn mắc lỗi trong công việc/học tập và bạn đã học được gì.',
  outline:['Bối cảnh','Chuyện gì đã xảy ra','Bạn xử lý thế nào','Bài học'],
  phrases:['Last year, I was working on…','Unfortunately, I had forgotten to…','As soon as I realized, I…','It taught me that…','Looking back, I would have…']},
 {id:'w6',cat:'Quan điểm (IELTS Task 2)',title:'AI trong kế toán: lợi hay hại?',min:200,
  prompt:'Some people think that artificial intelligence will replace accountants. To what extent do you agree or disagree?',
  outline:['Mở bài: paraphrase đề + nêu quan điểm','Thân bài 1: lý do 1 + ví dụ','Thân bài 2: lý do 2 / phản biện + ví dụ','Kết bài: tóm ý'],
  phrases:['It is often argued that…','To a large extent, I agree that…','One major reason is that…','For instance, / For example, …','Admittedly, …; however, …','In conclusion, …']},
 {id:'w7',cat:'Quan điểm (IELTS Task 2)',title:'Tiết kiệm hay đầu tư?',min:200,
  prompt:'Some people believe it is better to save money, while others think investing is wiser. Discuss both views and give your opinion.',
  outline:['Mở bài','Quan điểm 1 (tiết kiệm)','Quan điểm 2 (đầu tư)','Ý kiến của bạn + kết luận'],
  phrases:['On the one hand, … On the other hand, …','Supporters of saving argue that…','Investing, by contrast, offers…','In my opinion, a balance is the best approach.']},
 {id:'w8',cat:'So sánh / Nguyên nhân',title:'Tiền mặt và thanh toán số',min:180,
  prompt:'So sánh ưu – nhược điểm của tiền mặt và thanh toán điện tử.',
  outline:['Giới thiệu','Ưu điểm của mỗi loại','Nhược điểm của mỗi loại','Kết luận'],
  phrases:['Compared with…','Whereas / While…','A major advantage of… is…','A drawback is that…','Both … and … have…']},
 {id:'w9',cat:'Quan điểm (IELTS Task 2)',title:'Chi phí sinh hoạt tăng: nguyên nhân & giải pháp',min:250,
  prompt:'The cost of living is rising rapidly in many cities. What are the causes and what solutions can be offered?',
  outline:['Mở bài','Nguyên nhân (2 ý)','Giải pháp (2 ý)','Kết bài'],
  phrases:['A key factor contributing to this is…','This is largely due to…','One effective solution would be to…','Governments should take measures to…','As a result, / Consequently, …']},
 {id:'w10',cat:'Tóm tắt',title:'Tóm tắt một bài tin tài chính',min:150,
  prompt:'Đọc một bài tin tài chính ngắn (VOA / Marketplace) rồi tóm tắt bằng lời của bạn.',
  outline:['Nguồn + chủ đề','Ý chính','Chi tiết quan trọng','Nhận xét của bạn'],
  phrases:['The article is about…','According to the article, …','The author points out that…','Overall, I think…']},
 {id:'w11',cat:'Phỏng vấn / CV',title:'Giới thiệu bản thân khi xin việc',min:120,
  prompt:'Viết đoạn “Tell me about yourself” cho buổi phỏng vấn vị trí kế toán/tài chính.',
  outline:['Hiện tại: bạn là ai, làm gì','Quá khứ: kinh nghiệm chính','Tương lai: vì sao vị trí này'],
  phrases:['I graduated from… with a degree in…','I have … years of experience in…','I am skilled at…','I’m particularly interested in this role because…']}
];
DATA.writeChecklist = ['Có mở – thân – kết rõ ràng?','Mỗi đoạn có một ý chính (topic sentence)?','Có dùng từ nối (however, moreover, as a result)?','Kiểm tra thì động từ & chủ – vị hòa hợp (he works)?','Kiểm tra mạo từ a/an/the và số nhiều?','Có ít nhất 3 từ vựng mới học?','Đã đọc lại 1 lần và sửa lỗi chính tả?'];

/* ---------- IELTS ---------- */
DATA.ieltsReading = [
 {id:'r1',title:'The Rise of Digital Payments',mins:10,
  text:`Over the past decade, digital payments have transformed the way people spend money. In 2012, cash was used in roughly 60 percent of retail transactions in many developed countries. By 2022, that figure had dropped to below 30 percent in several of them. Mobile wallets, contactless cards and online banking have made transactions faster and more convenient. Retailers benefit as well, since handling cash is costly and carries the risk of theft. However, critics argue that a cashless society may exclude elderly people and those without bank accounts. Some countries, such as Sweden, have already seen a sharp decline in cash use, prompting the central bank to consider the effects on vulnerable groups. Meanwhile, cybersecurity experts warn that digital platforms are attractive targets for fraud, and that consumers should use strong passwords and two-factor authentication.`,
  qs:[
   {q:'In 2012, cash was used in about 60% of retail transactions in many developed countries.',t:'tfng',a:0,e:'Đoạn nêu: “roughly 60 percent” → TRUE.'},
   {q:'By 2022, cash use had fallen below 30% in all developed countries.',t:'tfng',a:1,e:'Văn bản nói “in several of them”, không phải “all” → FALSE.'},
   {q:'Contactless cards are more secure than mobile wallets.',t:'tfng',a:2,e:'Không có so sánh bảo mật này → NOT GIVEN.'},
   {q:'Critics believe a cashless society could disadvantage some groups.',t:'tfng',a:0,e:'“may exclude elderly people…” → TRUE.'},
   {q:'Fraud on digital platforms has doubled since 2012.',t:'tfng',a:2,e:'Chỉ nói là mục tiêu của gian lận, không có số liệu → NOT GIVEN.'},
   {q:'What do cybersecurity experts recommend?',t:'mc',o:['Using only cash','Using strong passwords and two-factor authentication','Avoiding mobile wallets'],a:1,e:'Câu cuối đoạn.'}]},
 {id:'r2',title:'Automation in Accounting',mins:10,
  text:`Accounting has traditionally involved long hours of manual data entry and checking. Today, software can read invoices, record transactions and reconcile bank statements automatically. Firms that adopt automation report that routine tasks take up to 70 percent less time. As a result, accountants are spending more time on analysis and advice rather than on data entry. Nevertheless, the change is not without challenges. Smaller firms often lack the budget to buy advanced systems, and staff need training to use them effectively. Some experts also worry that overreliance on software may cause professionals to overlook errors that a human reviewer would notice. Most agree, however, that automation will not replace accountants; instead it will change the skills that employers value most, such as critical thinking and communication.`,
  qs:[
   {q:'Software can reconcile bank statements automatically.',t:'tfng',a:0,e:'“reconcile bank statements automatically” → TRUE.'},
   {q:'Automation reduces the time for routine tasks by exactly 70 percent.',t:'tfng',a:1,e:'Văn bản: “up to 70 percent” (tối đa) → FALSE.'},
   {q:'Small firms find it easy to buy advanced systems.',t:'tfng',a:1,e:'“often lack the budget” → FALSE.'},
   {q:'The number of accountants has fallen since automation began.',t:'tfng',a:2,e:'Không có thông tin → NOT GIVEN.'},
   {q:'Which skills will employers value most?',t:'mc',o:['Data entry and typing','Critical thinking and communication','Programming only'],a:1,e:'Câu cuối.'}]}
];
DATA.ieltsTask1 = [
 {id:'t1a',title:'Bảng: Chi tiêu hộ gia đình trung bình mỗi tháng (USD)',cols:['2010','2020'],rows:[['Housing',800,1000],['Food',400,450],['Transport',250,180],['Entertainment',150,220],['Savings',200,300]],
  prompt:'The table shows average monthly household spending in 2010 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. (150 words)'},
 {id:'t1b',title:'Biểu đồ: Tỷ trọng doanh số bán lẻ trực tuyến (%)',cols:['Online share (%)'],rows:[['2016',8],['2017',11],['2018',14],['2019',18],['2020',25],['2021',22],['2022',24]],
  prompt:'The chart shows the percentage of retail sales made online between 2016 and 2022. Summarise the information by selecting and reporting the main features. (150 words)'}
];
DATA.ieltsTask2 = [
 'Some people say that studying accounting or finance is the best way to secure a good career. To what extent do you agree or disagree?',
 'Many people now pay for everything with phones instead of cash. Do the advantages of this trend outweigh the disadvantages?',
 'Some believe that governments should spend more on public services, while others say they should reduce taxes. Discuss both views and give your opinion.',
 'Young people today are spending too much money on unnecessary things. What are the causes and what can be done?',
 'Large companies should be required to publish detailed financial reports. Do you agree or disagree?',
 'Working from home is becoming more common. Is this a positive or negative development?'
];
DATA.speakP1 = ['Do you work or are you a student? What do you like about it?','How do you usually spend your weekends?','Do you prefer to save money or spend it? Why?','How often do you use your phone to pay for things?','What is your hometown like?','Do you enjoy cooking? Why or why not?','What kind of music do you like?','Is it easy to make friends where you live?','How do you keep track of your spending?','Would you like to change your job in the future?'];
DATA.speakP2 = [
 {t:'Describe a person who helped you learn something.',pts:['who this person is','what they taught you','how they taught you','and explain how you felt about it'],p3:['What makes a good teacher?','Is it better to learn from books or from people?','How will technology change the way people learn?']},
 {t:'Describe a time when you saved money for something.',pts:['what you saved for','how long it took','how you saved','and explain how you felt when you bought it'],p3:['Why do some people find it hard to save?','Should schools teach children about money?','Do you think people will use cash in the future?']},
 {t:'Describe a job you would like to do in the future.',pts:['what the job is','what skills it requires','why you want it','and explain how you would prepare for it'],p3:['What jobs are popular in your country?','Do people change jobs more often now than in the past?','Will robots take over many jobs?']},
 {t:'Describe a useful app on your phone.',pts:['what it is','how often you use it','what it helps you do','and explain why it is useful'],p3:['Do people rely too much on apps?','How has mobile banking changed daily life?','What are the risks of sharing personal data?']},
 {t:'Describe a piece of financial advice you received.',pts:['who gave it','what the advice was','whether you followed it','and explain whether it was helpful'],p3:['Who should give financial advice to young people?','Is it wise to borrow money?','Why do some people invest and others do not?']}
];
DATA.bands = [
 ['Task Response / Achievement','Trả lời ĐỦ mọi phần của đề, quan điểm rõ ràng xuyên suốt, ý được phát triển bằng giải thích + ví dụ. (Task 1: nêu overview + số liệu chính.)'],
 ['Coherence & Cohesion','Bố cục rõ, mỗi đoạn một ý chính, dùng từ nối tự nhiên (không lạm dụng), đại từ tham chiếu đúng.'],
 ['Lexical Resource','Từ vựng đa dạng, chính xác, có collocation (heavy traffic, raise awareness), ít lỗi chính tả/từ loại.'],
 ['Grammatical Range & Accuracy','Kết hợp câu đơn – phức (quan hệ, điều kiện, bị động), ít lỗi gây khó hiểu.']
];
DATA.ieltsLinks = [
 ['IELTS.org – Free sample tests & prep','Trang chính thức có đề mẫu và video hướng dẫn.','https://ielts.org/take-a-test/preparation-resources/sample-test-questions'],
 ['British Council – IELTS Prep','Bài luyện và mẹo cho 4 kỹ năng.','https://takeielts.britishcouncil.org/take-ielts/prepare'],
 ['IELTS Liz','Bài mẫu Writing/Speaking, mẹo, đề thi theo chủ đề.','https://ieltsliz.com/'],
 ['IELTS Simon','Bài mẫu band 9 Writing Task 1 & 2 kèm phân tích.','https://ielts-simon.com/'],
 ['IELTS-Blog','Bài luyện Reading/Listening miễn phí.','https://www.ielts-blog.com/'],
 ['LanguageTool (kiểm tra ngữ pháp)','Kiểm tra lỗi bài viết miễn phí.','https://languagetool.org/']
];

/* ---------- PHƯƠNG PHÁP ---------- */
DATA.method = [
 ['🔁','Lặp lại ngắt quãng (Spaced repetition)','Ôn từ vào đúng lúc sắp quên (1 → 2 → 4 → 8 ngày…) giúp nhớ lâu hơn nhiều so với học dồn. Tab “Từ vựng” dùng hộp Leitner để làm điều này tự động.'],
 ['🧠','Nhớ lại chủ động (Active recall)','Tự kiểm tra thay vì đọc lại. Mọi bài tập trong app đều bắt bạn trả lời trước rồi mới xem đáp án.'],
 ['🎧','Đầu vào dễ hiểu + nghe nhiều (Comprehensible input)','Nghe/đọc nội dung hiểu ~80-90%. Chọn nguồn theo chủ đề nghề nghiệp (tài chính – kế toán) để từ vựng lặp lại tự nhiên. Quy tắc 3 lượt: nghe ý chính → nghe chi tiết + đọc transcript → nghe lại & shadowing.'],
 ['🗣️','Shadowing & phát âm kiểu Mỹ','Nhại lại người bản xứ đúng nhịp – trọng âm – ngữ điệu; tập từng âm khó (θ, ð, r, æ, flap T); thu âm để tự so sánh.'],
 ['✍️','Viết ra & nhận phản hồi (Output)','Viết theo chủ đề, có dàn ý và cụm từ mẫu; sau đó tự kiểm tra bằng checklist hoặc công cụ ngữ pháp/giáo viên. Viết cụ thể buộc bạn nhận ra lỗ hổng ngữ pháp.'],
 ['📘','Ngữ pháp trong ngữ cảnh','Học quy tắc ngắn gọn → làm bài tập ngay → dùng lại trong bài viết/nói. Không học ngữ pháp tách rời thực hành.'],
 ['🎯','Luyện có chủ đích với đề IELTS','Bấm giờ, làm đúng dạng câu hỏi, đối chiếu tiêu chí chấm điểm, sửa lỗi, làm lại. Xen kẽ 4 kỹ năng trong tuần.'],
 ['📅','Đều đặn hơn cường độ','30–60 phút mỗi ngày tốt hơn 5 giờ một lần/tuần. Dùng chuỗi ngày học (streak) + nhắc nhở để duy trì thói quen.']
];
DATA.routine = [
 ['10′','Ôn từ vựng (Leitner)'],['10′','1 bài ngữ pháp + quiz'],['10′','Phát âm/shadowing 2–3 câu'],['15′','Nghe tài chính – kế toán (3 lượt)'],['15′','Viết 1 chủ đề / 1 phần IELTS']
];
