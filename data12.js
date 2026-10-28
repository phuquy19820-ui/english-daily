/* PHÁT ÂM: phiên âm Mỹ cho từng từ, nhóm nguyên âm NGẮN / DÀI, video shadowing người thật */
DATA.ipa = {
 think:'/θɪŋk/',three:'/θriː/',thanks:'/θæŋks/',thirty:'/ˈθɝːti/',this:'/ðɪs/',that:'/ðæt/',the:'/ðə/',other:'/ˈʌðɚ/',
 ship:'/ʃɪp/',sheep:'/ʃiːp/',live:'/lɪv/',leave:'/liːv/',fill:'/fɪl/',feel:'/fiːl/',bit:'/bɪt/',beat:'/biːt/',
 bank:'/bæŋk/',tax:'/tæks/',cash:'/kæʃ/',planning:'/ˈplænɪŋ/',manage:'/ˈmænɪdʒ/',analyze:'/ˈænəlaɪz/',happy:'/ˈhæpi/',back:'/bæk/',
 cup:'/kʌp/',budget:'/ˈbʌdʒɪt/',up:'/ʌp/',money:'/ˈmʌni/',stock:'/stɑːk/',model:'/ˈmɑːdl/',john:'/dʒɑːn/',hot:'/hɑːt/',
 work:'/wɝːk/',world:'/wɝːld/',report:'/rɪˈpɔːrt/',dollar:'/ˈdɑːlɚ/',order:'/ˈɔːrdɚ/',return:'/rɪˈtɝːn/',research:'/ˈriːsɝːtʃ/',turnover:'/ˈtɝːnoʊvɚ/',
 bill:'/bɪl/',total:'/ˈtoʊɾl/',full:'/fʊl/',skill:'/skɪl/',financial:'/faɪˈnænʃl/',table:'/ˈteɪbl/',deal:'/diːl/',
 share:'/ʃer/',shift:'/ʃɪft/',check:'/tʃek/',charge:'/tʃɑːrdʒ/',judge:'/dʒʌdʒ/',major:'/ˈmeɪdʒɚ/',
 banking:'/ˈbæŋkɪŋ/',running:'/ˈrʌnɪŋ/',building:'/ˈbɪldɪŋ/',saving:'/ˈseɪvɪŋ/',long:'/lɔːŋ/',strong:'/strɔːŋ/',thing:'/θɪŋ/',morning:'/ˈmɔːrnɪŋ/',
 assets:'/ˈæsets/',bags:'/bæɡz/',bonuses:'/ˈboʊnəsɪz/',worked:'/wɝːkt/',played:'/pleɪd/',wanted:'/ˈwɑːntɪd/',costs:'/kɔːsts/',ended:'/ˈendɪd/',
 water:'/ˈwɑːɾɚ/',better:'/ˈbeɾɚ/',meeting:'/ˈmiːɾɪŋ/',quality:'/ˈkwɑːləɾi/',city:'/ˈsɪɾi/',waiting:'/ˈweɪɾɪŋ/',accounting:'/əˈkaʊnɾɪŋ/',
 about:'/əˈbaʊt/',accountant:'/əˈkaʊntənt/',balance:'/ˈbæləns/',company:'/ˈkʌmpəni/',another:'/əˈnʌðɚ/',support:'/səˈpɔːrt/',today:'/təˈdeɪ/',
 record:'/ˈrekɚd/',account:'/əˈkaʊnt/',economy:'/ɪˈkɑːnəmi/',economics:'/ˌekəˈnɑːmɪks/',economic:'/ˌekəˈnɑːmɪk/',forecast:'/ˈfɔːrkæst/',decision:'/dɪˈsɪʒn/',
 sink:'/sɪŋk/',right:'/raɪt/',light:'/laɪt/',cap:'/kæp/',bed:'/bed/',bad:'/bæd/',walk:'/wɔːk/',very:'/ˈveri/',berry:'/ˈberi/',cost:'/kɔːst/',coast:'/koʊst/',fool:'/fuːl/',tree:'/triː/',bunk:'/bʌŋk/',chip:'/tʃɪp/',late:'/leɪt/',sheet:'/ʃiːt/',seat:'/siːt/',
 sit:'/sɪt/',big:'/bɪɡ/',kid:'/kɪd/',fish:'/fɪʃ/',get:'/ɡet/',red:'/red/',men:'/men/',head:'/hed/',ten:'/ten/',cat:'/kæt/',man:'/mæn/',black:'/blæk/',
 bus:'/bʌs/',luck:'/lʌk/',run:'/rʌn/',sun:'/sʌn/',love:'/lʌv/',book:'/bʊk/',put:'/pʊt/',good:'/ɡʊd/',foot:'/fʊt/',look:'/lʊk/',
 banana:'/bəˈnænə/',sofa:'/ˈsoʊfə/',problem:'/ˈprɑːbləm/',green:'/ɡriːn/',see:'/siː/',food:'/fuːd/',blue:'/bluː/',school:'/skuːl/',moon:'/muːn/',true:'/truː/',two:'/tuː/',
 father:'/ˈfɑːðɚ/',car:'/kɑːr/',start:'/stɑːrt/',calm:'/kɑːm/',large:'/lɑːrdʒ/',saw:'/sɔː/',all:'/ɔːl/',thought:'/θɔːt/',talk:'/tɔːk/',law:'/lɔː/',door:'/dɔːr/',
 bird:'/bɝːd/',learn:'/lɝːn/',turn:'/tɝːn/',first:'/fɝːst/'
};
const _ipaOf = w => { const k = String(w).toLowerCase(); if (DATA.ipa[k]) return DATA.ipa[k]; const v = DATA.vocab.find(x => x.w.toLowerCase() === k); return v ? v.ipa : ''; };

/* NGUYÊN ÂM NGẮN và DÀI (tiếng Anh-Mỹ) */
DATA.vowels = {
 short:[
  {ipa:'/ɪ/',vi:'i ngắn',tip:'Môi thả lỏng, lưỡi hơi thấp; âm nhanh, gọn. Giống “i” rất ngắn, hơi lai “ơ”.',words:['sit','big','kid','fish','ship','live']},
  {ipa:'/e/',vi:'e ngắn',tip:'Miệng mở vừa, giống “e” tiếng Việt nhưng ngắn hơn.',words:['bed','get','red','men','head','ten']},
  {ipa:'/æ/',vi:'a mở rộng',tip:'Mở miệng rộng, hàm dưới hạ thấp, như “e” + “a” cùng lúc; vẫn là âm ngắn.',words:['cat','bad','man','black','back','happy']},
  {ipa:'/ʌ/',vi:'ơ ngắn',tip:'Miệng mở vừa, lưỡi thả lỏng ở giữa; nhanh, ngắn (giống “ơ” nhanh).',words:['cup','bus','luck','run','sun','love']},
  {ipa:'/ʊ/',vi:'u ngắn',tip:'Môi tròn nhẹ, không chu ra như /uː/; ngắn, thả lỏng.',words:['book','put','good','foot','full','look']},
  {ipa:'/ə/',vi:'schwa (âm yếu)',tip:'Âm ngắn nhất, nhẹ, xuất hiện ở âm tiết KHÔNG nhấn.',words:['about','banana','sofa','today','problem','support']}],
 long:[
  {ipa:'/iː/',vi:'i dài',tip:'Môi kéo ngang như đang cười, giữ âm lâu (≈ 2 nhịp).',words:['sheep','seat','feel','leave','green','see']},
  {ipa:'/uː/',vi:'u dài',tip:'Môi chu tròn, đưa ra trước, giữ âm lâu.',words:['food','blue','school','moon','true','two']},
  {ipa:'/ɑː/',vi:'a dài, miệng mở to',tip:'Hạ thấp lưỡi, mở miệng to, kéo dài; kiểu Mỹ có thể kèm âm r (car, start).',words:['father','car','start','calm','large','hot']},
  {ipa:'/ɔː/',vi:'o dài',tip:'Môi tròn, hàm hạ, kéo dài âm “o” (door, all).',words:['saw','all','thought','talk','law','door']},
  {ipa:'/ɜːr/',vi:'ơ dài (có r)',tip:'Lưỡi cuộn nhẹ, môi hơi tròn, giữ âm lâu: bird, work.',words:['bird','work','learn','turn','first','world']}]
};
/* Cặp NGẮN – DÀI để nghe so sánh */
DATA.vowelPairs = [
 ['/ɪ/','ship','/iː/','sheep'],['/ɪ/','live','/iː/','leave'],['/ɪ/','fill','/iː/','feel'],['/ɪ/','bit','/iː/','beat'],
 ['/ʊ/','full','/uː/','fool'],['/ʌ/','cup','/ɑː/','calm'],['/e/','bed','/æ/','bad']
];
/* Một số thẻ âm khó chia làm 2–3 hàng rõ ràng */
DATA.soundGroups = {
 '/θ/ và /ð/':[['/θ/ vô thanh (đặt lưỡi giữa răng, KHÔNG rung cổ)',['think','three','thanks','thirty']],['/ð/ hữu thanh (đặt lưỡi giữa răng, RUNG cổ)',['this','that','the','other']]],
 '/ɪ/ vs /i/':[['Âm NGẮN /ɪ/ (nhanh, gọn)',['ship','live','fill','bit']],['Âm DÀI /iː/ (kéo dài, môi kéo ngang)',['sheep','leave','feel','beat']]],
 '/ʌ/ và /ɑː/':[['Âm NGẮN /ʌ/',['cup','budget','up','money']],['Âm DÀI/mở /ɑː/',['stock','model','John','hot']]],
 '/ʃ/ /tʃ/ /dʒ/':[['/ʃ/ “sh” (hơi trượt liên tục)',['share','shift']],['/tʃ/ “ch” (bật hơi, vô thanh)',['check','charge']],['/dʒ/ “j” (như ch nhưng RUNG cổ)',['budget','manage','judge','major']]],
 '-s / -ed cuối từ':[['Đuôi -s: /s/, /z/, /ɪz/',['assets','costs','bags','bonuses']],['Đuôi -ed: /t/, /d/, /ɪd/',['worked','played','wanted','ended']]]
};
/* VIDEO SHADOWING có người thật (đã kiểm tra tồn tại & nhúng được) */
DATA.shadowVideos = [
 {g:'📚 Cách luyện shadowing đúng (người dạy thật)', items:[
  ['N20jOJDYyYA','Speak with me! (Shadowing Method)','English with Lucy','Cùng nói với cô giáo, giọng Anh','B1'],
  ['PvpW3K-1Mws','Shadowing Technique: How to do it the RIGHT way','KatyEnglish','Các bước làm đúng','B1'],
  ['ljEP_ywBm7I','Shadowing Technique: are you wasting your time?',"Accent's Way English with Hadar",'Tránh sai lầm khi shadowing','B1']]},
 {g:'🇺🇸 Nhại theo người Mỹ (Imitation – Rachel’s English)', items:[
  ['kUdadeeGZeY','Meet Tom! + Imitation Exercise',"Rachel's English",'Có người thật đọc + phân tích','B1'],
  ['_kksuKc6u1I','American English Imitation Exercise: Big Love','RachelsEnglish2','Nhại theo đoạn hội thoại','B1+'],
  ['lhmlzb0t1O0','American English Imitation Exercise: A Christmas Story','RachelsEnglish2','Kể chuyện, ngữ điệu tự nhiên','B1+'],
  ['TebNvlrUvXk','American English Imitation Exercise: People Change','RachelsEnglish2','Ngữ điệu và nối âm','B1+'],
  ['YW56XamxiIc','American English Imitation Exercise: The Art of Getting By','RachelsEnglish2','Nối âm, nhấn từ','B2'],
  ['KJSomazFEaU','American English Imitation Exercise: Midnight in Paris','RachelsEnglish2','Tốc độ thật, nhịp điệu','B2']]},
 {g:'🗣️ Repeat-after-me & hội thoại (giọng Mỹ)', items:[
  ['WXhRVKjn7D8','Repeat-After-Me + Shadowing Practice (REAL American English)','Lauren Taylor','Nhắc lại từng cụm','B1'],
  ['mAea3U2Xzhc','Repeat After Me + Shadowing English Speaking Practice','English Coach Chad','Giọng Mỹ, từng câu','B1'],
  ['eIXLVf9ICo0','Repeat-After-Me + SHADOWING: Life can surprise you!','English Coach Chad','Đoạn nói dài hơn','B1+'],
  ['yCJiG7bRchk','Improve English Listening by Shadowing (B2–C1 Real Conversation)','English Fluency Teacher','Hội thoại thật B2–C1','B2'],
  ['5l2hBL4EbGo','Improve Your English Speaking by Shadowing This Conversation','English Fluency Teacher','Hội thoại, nhắc lại 2 lần','B1+']]}
];
DATA.vowelVideos = [
 ['StSBQ5PtQAc','Ship or Sheep? Short /ɪ/ vs Long /iː/','English with Max','Giải thích cách đặt miệng'],
 ['5hBDAUCDXN8','SHIP vs SHEEP? Long and Short “i” Vowels','Pronunciation with Emma','Nghe so sánh, có quiz'],
 ['HmrBUUaoX5o','Sheep or Ship? Practice now! (American)',"Accent's Way English with Hadar",'Luyện giọng Mỹ'],
 ['TNFKG0yvDx4','Short vowel /ɪ/ in “bid”, “tip” & “minute”','BBC Learning English','Giọng Anh, rõ miệng'],
 ['yIOOOC0zlmY','ALL OF THE SOUNDS OF ENGLISH (American, IPA)','#GOALS English','Toàn bộ âm với ký hiệu IPA']
];
/* thêm 2 nhóm video vào thư viện Video */
DATA.videos.push(
 {g:'🎯 Shadowing – nhại theo người thật', items: DATA.shadowVideos.flatMap(x => x.items)},
 {g:'👄 Nguyên âm ngắn – dài (người thật dạy)', items: DATA.vowelVideos.map(v => [v[0], v[1], v[2], v[3], 'A2+'])}
);
