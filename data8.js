/* Luyện bài xếp lớp tiếng Anh (mô phỏng): Viết 30 phút + Nói 15 phút.
   Nội dung tự soạn để luyện tập, KHÔNG phải đề thi chính thức của trường. */
DATA.rmit = {};

DATA.rmit.facts = [
 ['Bài xếp lớp','Xác định năng lực hiện tại và lớp bạn được xếp vào. Chương trình tiếng Anh dự bị đại học chia thành nhiều cấp độ (theo thông tin bạn cung cấp: 6 cấp).'],
 ['Hình thức','Online hoặc trực tiếp tại trường.'],
 ['Phần VIẾT','30 phút · một chủ đề bất kỳ · không giới hạn số chữ.'],
 ['Phần NÓI','15 phút · nói chuyện với giáo viên người nước ngoài.'],
 ['Điều này nghĩa là gì','Giám khảo đánh giá cả độ DÀI lẫn độ ĐA DẠNG và CHÍNH XÁC của ngôn ngữ. Viết/nói nhiều hơn → họ thấy được nhiều cấu trúc hơn (nhưng sai nhiều cũng bị thấy).']
];
DATA.rmit.levels = [
 [1,'≈ A1','Câu rất ngắn, từ vựng cơ bản, nhiều lỗi nhưng hiểu được ý.'],
 [2,'≈ A2','Câu đơn rõ ràng, nói về bản thân/gia đình/thói quen; dùng được quá khứ đơn.'],
 [3,'≈ B1 thấp','Có từ nối (and, but, because), kể được trải nghiệm, nêu ý kiến đơn giản.'],
 [4,'≈ B1 cao','Đoạn văn có tổ chức, nhiều thì, mệnh đề quan hệ, ví dụ minh họa.'],
 [5,'≈ B2','Lập luận mạch lạc, từ nối đa dạng, câu phức, ít lỗi gây khó hiểu.'],
 [6,'≈ B2+ / C1','Văn phong tự nhiên, từ vựng phong phú và chính xác, kiểm soát ngữ pháp tốt.']
];

DATA.rmit.topics = [
 ['Bản thân','Describe a person who has influenced your life.'],
 ['Bản thân','Describe a memorable experience and what you learned from it.'],
 ['Bản thân','Describe your hometown and explain why people should visit it.'],
 ['Bản thân','What is your dream job and how will you achieve it?'],
 ['Bản thân','Write about a typical day in your life and one thing you would like to change.'],
 ['Giáo dục','Why do you want to study at university?'],
 ['Giáo dục','Is online learning better than studying in a classroom?'],
 ['Giáo dục','Should students study abroad? Give reasons.'],
 ['Giáo dục','Do you think homework is useful for students?'],
 ['Công nghệ','How does social media affect young people?'],
 ['Công nghệ','Should smartphones be allowed in classrooms?'],
 ['Công nghệ','Will artificial intelligence change the jobs of the future?'],
 ['Công nghệ','Is online shopping better than shopping in stores?'],
 ['Xã hội & môi trường','What can we do to reduce plastic pollution?'],
 ['Xã hội & môi trường','Is public transport better than private cars in big cities?'],
 ['Xã hội & môi trường','Is it better to live in a city or in the countryside?'],
 ['Xã hội & môi trường','What are the benefits of volunteering?'],
 ['Công việc & tiền bạc','Is money the most important thing for happiness?'],
 ['Công việc & tiền bạc','Is working from home better than working in an office?'],
 ['Công việc & tiền bạc','Is it better to save money or to spend it on experiences?'],
 ['Công việc & tiền bạc','What do you need to start a small business?'],
 ['Tự do','Write about any topic you feel confident about (travel, food, sport, music, family…).']
];

/* Bài mẫu 3 mức (để đối chiếu cấu trúc, không để học thuộc) */
DATA.rmit.models = {
 'Why do you want to study at university?': [
  {lv:'Cấp 2 (≈A2)',note:'Câu đơn, ý rõ nhưng chưa phát triển.',text:'I want to study at university because I want a good job. My parents want me to study too. I like computers. I want to learn about technology. After I finish, I want to work in a big company. I think university is good for my future.'},
  {lv:'Cấp 4 (≈B1 cao)',note:'Có từ nối, lý do + ví dụ, nhiều dạng câu.',text:'There are several reasons why I want to study at university. First of all, I would like to get a degree in information technology, which will help me find a good job. In addition, university is a place where I can meet new people and improve my English. For example, last year I joined an English club and I made friends from different countries. Although studying is sometimes difficult, I believe the experience will make me more independent. In the future, I hope to work for an international company.'},
  {lv:'Cấp 6 (≈B2+)',note:'Lập luận mạch lạc, từ vựng chính xác, câu phức, kết luận.',text:'Choosing to pursue a university education is, in my view, one of the most important decisions a young person can make. Firstly, a degree in information technology would give me the specialised knowledge that employers increasingly demand. Moreover, university offers far more than academic content: it encourages independent thinking, teamwork and resilience, skills that are difficult to develop elsewhere. I experienced this myself when I led a small project at school; although we encountered many setbacks, the process taught me how to manage time and communicate under pressure. Admittedly, tuition fees can be a burden, but I regard them as an investment rather than an expense. Ultimately, I hope that my studies will allow me not only to build a career but also to contribute to my community.'}
 ],
 'How does social media affect young people?': [
  {lv:'Cấp 2 (≈A2)',note:'Ý đơn giản, ví dụ cá nhân.',text:'Many young people use social media every day. They use Facebook and TikTok. It is fun and they can talk to friends. But sometimes they spend too much time on the phone. They do not sleep well. I think social media is good and bad.'},
  {lv:'Cấp 4 (≈B1 cao)',note:'Hai mặt, từ nối, ví dụ.',text:'Social media has both positive and negative effects on young people. On the one hand, it helps them stay in touch with friends and learn new things. For example, I watch videos on YouTube to practise English. On the other hand, many teenagers spend too many hours online, so they sleep less and have less time for homework. In addition, some people compare themselves with others, which can make them feel unhappy. In my opinion, young people should use social media carefully and set a time limit.'},
  {lv:'Cấp 6 (≈B2+)',note:'Phân tích, hedging, giải pháp, văn phong học thuật.',text:'There is little doubt that social media has reshaped the way young people communicate, and its influence is far from straightforward. On the positive side, platforms allow users to maintain friendships across distances, access educational content and express their creativity. Nevertheless, research suggests that excessive use may contribute to anxiety, sleep deprivation and unrealistic comparisons with others. What concerns me most is that many teenagers appear to measure their self-worth by the number of likes they receive. To limit these risks, parents and schools should encourage balanced habits, while young people themselves ought to treat social media as a tool rather than a necessity. On balance, its benefits are real, provided that it is used mindfully.'}
 ],
 'Describe a memorable experience and what you learned from it.': [
  {lv:'Cấp 2 (≈A2)',note:'Quá khứ đơn, câu ngắn.',text:'Last summer I went to Da Nang with my family. We stayed in a hotel near the beach. We swam in the sea and ate seafood. It was very fun. I learned that family time is important. I want to go there again.'},
  {lv:'Cấp 4 (≈B1 cao)',note:'Kể theo trình tự, có bối cảnh và cảm xúc.',text:'One of my most memorable experiences was a trip to Da Lat last year. While we were travelling by bus, it started to rain heavily, so we arrived late at night. At first I felt tired and disappointed, but the next morning the weather was beautiful and the mountains looked amazing. We rode bicycles around the lake and tried local food. This trip taught me that things do not always go as planned, and that we can still enjoy them if we stay positive.'},
  {lv:'Cấp 6 (≈B2+)',note:'Kể chuyện phong phú, phản tư, ngôn ngữ tự nhiên.',text:'The experience that has stayed with me the longest was a solo trip I took when I was eighteen. I had never travelled alone before, and by the time I reached the station I realised that I had left my wallet on the bus. Panicking, I approached a stranger, who, to my surprise, not only lent me money but also helped me contact the driver. Looking back, that incident was a turning point: it taught me to remain calm under pressure and showed me how much kindness exists in ordinary people. Had I travelled with friends, I would probably never have learned how resourceful I could be.'}
 ],
 'Is online learning better than studying in a classroom?': [
  {lv:'Cấp 2 (≈A2)',note:'Ý kiến đơn giản.',text:'I think studying in a classroom is better. In the classroom, I can ask the teacher questions. I can talk with my friends. Online learning is easy because I stay at home, but sometimes the internet is slow. I like the classroom more.'},
  {lv:'Cấp 4 (≈B1 cao)',note:'So sánh, lý do, ví dụ.',text:'Both online learning and classroom learning have advantages. Online courses are flexible, so students can study at any time and save money on travelling. However, I believe that classroom learning is more effective for most people because teachers can give immediate feedback and students can practise speaking with each other. For instance, when I studied English online, I often felt lonely and lost motivation. Therefore, I would choose a combination of both methods.'},
  {lv:'Cấp 6 (≈B2+)',note:'Lập luận cân bằng, hedging, kết luận.',text:'Whether online learning is superior to traditional classes largely depends on the learner. Proponents argue that digital courses offer unmatched flexibility and often cost less, which makes education accessible to people who could otherwise not afford it. Nevertheless, classroom learning provides something that screens struggle to replicate: spontaneous interaction, immediate feedback and the social pressure that keeps students motivated. From my own experience, I tend to procrastinate when I study alone, so I find face-to-face lessons more productive. Consequently, I believe the most effective model is a blended one, in which online resources complement rather than replace the classroom.'}
 ]
};

DATA.rmit.speakWarm = [
 'Hello. Could you tell me your name, and where you are from?','What do you do — are you a student or do you work?','Tell me about your family.','What do you usually do in your free time?','What kind of food do you like, and why?','Do you prefer to stay at home or go out at weekends?','Tell me about the place where you live.','What is your favourite season?','How do you usually get to school or work?','Why are you studying English?','What is your favourite subject, and why?','Do you like music? What kind?','What did you do last weekend?','Tell me about your best friend.','What are your plans for the next five years?','Do you use social media much? Which apps?','What is a skill you would like to learn?','How do you relax after a busy day?','Have you travelled anywhere interesting?','What do you want to study at university?'
];
DATA.rmit.speakCards = [
 {t:'Describe a person who has helped you.',pts:['who this person is','how you know them','what they did to help you','and explain why it was important to you'],follow:['Why do you think some people enjoy helping others?','Do young people help their communities enough?','How can schools teach students to be helpful?']},
 {t:'Describe a place you would like to visit.',pts:['where it is','how you know about it','what you would do there','and explain why you want to go'],follow:['Why do people like to travel?','Is it better to travel alone or with others?','How has tourism changed in your country?']},
 {t:'Describe a technology device you use every day.',pts:['what it is','how often you use it','what you use it for','and explain how it makes your life easier'],follow:['Do people depend too much on technology?','How has technology changed education?','What will technology be like in twenty years?']},
 {t:'Describe a time you learned something difficult.',pts:['what you learned','why it was difficult','how you managed it','and explain how you felt afterwards'],follow:['What is the best way to learn a new skill?','Should schools focus more on practical skills?','Why do some people give up easily?']},
 {t:'Describe your favourite food or a meal you enjoyed.',pts:['what it was','where you ate it','who you ate it with','and explain why you liked it'],follow:['Why is fast food so popular?','Is traditional food becoming less important?','How can people eat more healthily?']},
 {t:'Describe a job you would like to do in the future.',pts:['what the job is','what skills it needs','why you want it','and explain how you will prepare'],follow:['How important is it to enjoy your job?','Do people change jobs more often now?','Will robots replace many jobs?']},
 {t:'Describe a hobby or sport you enjoy.',pts:['what it is','when you started','how often you do it','and explain why you enjoy it'],follow:['Why is exercise important?','Should schools make sport compulsory?','Why do some people prefer watching sport to playing it?']},
 {t:'Describe a memorable event in your life.',pts:['what happened','when and where it happened','who was there','and explain why it was memorable'],follow:['Why do people celebrate special days?','How have celebrations changed over time?','Are traditional festivals still important?']},
 {t:'Describe an important decision you made.',pts:['what the decision was','why you made it','what happened afterwards','and explain whether it was a good decision'],follow:['Should young people make decisions alone?','Who influences people’s decisions most?','Is it better to decide quickly or slowly?']},
 {t:'Describe a famous person you admire.',pts:['who this person is','what they have done','how you learned about them','and explain why you admire them'],follow:['Why do people look up to celebrities?','Are celebrities good role models?','Does fame always make people happy?']}
];
DATA.rmit.speakWrap = ['Thank you. Before we finish, is there anything you would like to add?','Is there anything you would like to ask me?','Finally, what do you hope to achieve at university?'];

DATA.rmit.phrases = {
 'Mở rộng câu trả lời (Answer + Reason + Example)':['I’d say… because…','The main reason is that…','For example, last year I…','That’s partly because…','What I mean is…','As a result, …'],
 'Câu giờ tự nhiên (thay cho “um…”)':['That’s an interesting question…','Let me think for a moment…','Well, to be honest…','How can I put this…','I’ve never really thought about it, but…'],
 'Nhờ giám khảo nhắc lại / làm rõ':['Sorry, could you say that again, please?','Could you repeat the question, please?','Do you mean… ?','What does “…” mean exactly?','Just to check, you’re asking about… ?'],
 'Nêu ý kiến':['In my opinion, …','From my point of view, …','I strongly believe that…','I tend to think that…','I’m not entirely sure, but I think…'],
 'Đồng ý / phản biện':['I see your point, but…','That’s true to some extent, however…','On the other hand, …','I partly agree because…'],
 'Kết thúc / tóm lại':['To sum up, …','All in all, …','That’s why I think…','In conclusion, …']
};
DATA.rmit.mistakes = [
 ['Thiếu mạo từ','I am student.','I am a student.'],
 ['Thiếu -s số nhiều','I have many friend.','I have many friends.'],
 ['Quên chia động từ ngôi 3 số ít','My mother work in a bank.','My mother works in a bank.'],
 ['Thiếu động từ to be','She very kind.','She is very kind.'],
 ['Sai thì khi kể chuyện quá khứ','Yesterday I go to the park.','Yesterday I went to the park.'],
 ['People + is','People is friendly.','People are friendly.'],
 ['Danh từ không đếm được thêm -s','I need some informations.','I need some information.'],
 ['Câu quá dài, thiếu dấu chấm','I like music I listen every day it makes me happy.','I like music. I listen to it every day because it makes me happy.'],
 ['Lặp từ “very, good, bad”','It is very good.','It is excellent. / It is extremely useful.'],
 ['Trả lời quá ngắn (khi nói)','“Yes, I like.”','“Yes, I really enjoy it because it helps me relax. For example, I listen to music every evening.”']
];
DATA.rmit.writingPlan = [
 'Chia 30 phút: 3′ lập dàn ý · 22′ viết · 5′ đọc lại sửa lỗi.',
 'Cấu trúc bài: Mở bài (nêu ý kiến) → 2 đoạn thân bài (lý do + ví dụ) → kết bài.',
 'Mỗi đoạn: câu chủ đề → giải thích → ví dụ cụ thể → câu nối.',
 'Dùng ít nhất 5 từ nối khác nhau (however, in addition, for example, as a result, although).',
 'Thể hiện sự đa dạng: ít nhất 1 câu điều kiện, 1 câu bị động, 1 mệnh đề quan hệ, 2 thì khác nhau.',
 'Đừng dùng từ quá khó mà bạn không chắc; ưu tiên đúng và rõ.',
 'Không giới hạn số chữ: cố viết 200–300 chữ có kiểm soát; còn thời gian thì đọc lại.'
];
DATA.rmit.plan14 = [
 ['Ngày 1','Làm bài xếp lớp trong app (Lộ trình) để biết điểm xuất phát. Đọc tab “Mẹo & lỗi thường gặp”.'],
 ['Ngày 2','Viết thử 1 bài 30 phút (chủ đề tự chọn). Xem phân tích tự động và bài mẫu.'],
 ['Ngày 3','Ôn ngữ pháp thì (hiện tại, quá khứ, hiện tại hoàn thành) – bài trong Lộ trình + sổ lỗi sai.'],
 ['Ngày 4','Nói thử phần Warm-up 5 câu, nghe lại ghi âm, sửa phát âm/âm cuối.'],
 ['Ngày 5','Viết bài 2 (chủ đề giáo dục/công nghệ), dùng ≥5 từ nối.'],
 ['Ngày 6','Học 20 từ chủ đề (Chủ đề học) + luyện đặt câu với từng từ.'],
 ['Ngày 7','Nghỉ nhẹ: nghe 20 phút (YouTube/TED) và nhại theo 5 câu (shadowing).'],
 ['Ngày 8','Nói thử cả buổi 15 phút (mô phỏng). Ghi lại điểm yếu.'],
 ['Ngày 9','Ôn câu điều kiện, bị động, mệnh đề quan hệ (để đa dạng cấu trúc).'],
 ['Ngày 10','Viết bài 3 (xã hội/môi trường). So sánh với bài mẫu cấp cao hơn, rút 5 cụm hay.'],
 ['Ngày 11','Luyện “Long turn” 2 phút với 3 thẻ khác nhau; mỗi thẻ nói 2 lần, lần 2 tốt hơn lần 1.'],
 ['Ngày 12','Sửa lỗi: đọc lại 3 bài viết cũ, tự sửa theo danh sách “lỗi người Việt hay mắc”.'],
 ['Ngày 13','Thi thử trọn bộ: Viết 30′ + Nói 15′ cách nhau 15 phút, đúng như ngày thi.'],
 ['Ngày 14','Nhẹ nhàng: ôn cụm từ, ngủ sớm, chuẩn bị giấy tờ/thiết bị (micro, internet nếu thi online).']
];
DATA.rmit.links = [
 ['RMIT Vietnam – English placement test (trang chính thức)','Thông tin hiện hành về lệ phí, lịch thi, hình thức.','https://www.rmit.edu.vn/study-at-rmit/pathway-programs/english-placement-test'],
 ['RMIT Vietnam – English for University','Chương trình tiếng Anh dự bị đại học và các cấp độ.','https://www.rmit.edu.vn/study-at-rmit/pathway-programs/english-for-university']
];
