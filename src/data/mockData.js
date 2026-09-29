// Realistik o'zbek mock ma'lumotlari
export const seedClients = [
  { id: 'cl_01', name: 'Abdulla Karimov', phone: '+998 90 123 45 67', email: 'abdulla.karimov@mail.uz', address: 'Toshkent sh., Yunusobod t., 12-mavze, 34-uy', status: 'Faol', tags: ['VIP', 'Biznes'], birth: '1985-04-12', createdAt: '2025-11-02', notes: 'Qurilish kompaniyasi rahbari. Shartnoma nizolari bo‘yicha doimiy mijoz.' },
  { id: 'cl_02', name: 'Dilshodbek Karimov', phone: '+998 91 555 21 34', email: 'dilshod.k@gmail.com', address: 'Samarqand sh., Registon k., 8-uy', status: 'Faol', tags: ['Jismoniy'], birth: '1992-08-03', createdAt: '2025-12-14', notes: 'Mehnat nizosi bo‘yicha murojaat qilgan.' },
  { id: 'cl_03', name: 'Kamola Yuldasheva', phone: '+998 93 777 88 99', email: 'kamola.y@mail.ru', address: 'Toshkent sh., Mirzo Ulug‘bek t., 45-uy', status: 'Kutmoqda', tags: ['Oilaviy'], birth: '1990-01-25', createdAt: '2026-01-19', notes: 'Ajrim va mulk taqsimoti masalasi.' },
  { id: 'cl_04', name: 'Shahzoda Tursunova', phone: '+998 97 246 80 12', email: 'shahzoda.t77@gmail.com', address: 'Buxoro sh., I. Karimov k., 21-uy', status: 'Faol', tags: ['Biznes', 'VIP'], birth: '1988-06-30', createdAt: '2025-09-05', notes: 'MCHJ ta’sischisi.' },
  { id: 'cl_05', name: 'Jasur Hakimov', phone: '+998 99 810 33 44', email: 'jasur.hakimov@inbox.uz', address: 'Andijon sh., Bobur k., 5-uy', status: 'Muammo', tags: ['Qarzdorlik'], birth: '1983-11-11', createdAt: '2025-07-22', notes: 'To‘lov kechikishi bor — qo‘ng‘iroq qilish kerak.' },
  { id: 'cl_06', name: 'Nodira Azimova', phone: '+998 90 321 67 89', email: 'nodira.azimova@gmail.com', address: 'Toshkent sh., Chilonzor t., 9-mavze', status: 'Faol', tags: ['Fuqarolik'], birth: '1995-03-17', createdAt: '2026-02-11', notes: 'Mulk nizosi.' },
  { id: 'cl_07', name: 'Otabek Nazarov', phone: '+998 94 600 12 78', email: 'otabek.nazarov@mail.uz', address: 'Farg‘ona sh., Al-Farg‘oniy k., 77-uy', status: 'Yakunlangan', tags: ['Jinoyat'], birth: '1979-09-09', createdAt: '2025-05-30', notes: 'Ish yopilgan, mijoz mamnun.' },
  { id: 'cl_08', name: 'Malika Rahimova', phone: '+998 95 144 29 30', email: 'malika.r@gmail.com', address: 'Toshkent sh., Sergeli t., 3-mavze', status: 'Kutmoqda', tags: ['Mehnat'], birth: '1998-12-01', createdAt: '2026-03-02', notes: 'Ishdan noqonuniy bo‘shatish.' },
  { id: 'cl_09', name: 'Sardor Usmonov', phone: '+998 98 765 43 21', email: 'sardor.u@business.uz', address: 'Namangan sh., Dustlik k., 11-uy', status: 'Faol', tags: ['Korporativ'], birth: '1987-05-20', createdAt: '2026-04-15', notes: 'IT-kompaniya, oylik retainer.' },
  { id: 'cl_10', name: 'Gulnora Saidova', phone: '+998 90 987 65 43', email: 'gulnora.saidova@mail.uz', address: 'Qarshi sh., Mustakillik k., 2-uy', status: 'Faol', tags: ['Meros'], birth: '1975-02-14', createdAt: '2026-05-08', notes: 'Meros taqsimoti.' },
  { id: 'cl_11', name: 'Timur Aliyev', phone: '+998 91 234 56 78', email: 'timur.aliyev@gmail.com', address: 'Toshkent sh., Yakkasaroy t.', status: 'Kutmoqda', tags: ['Soliq'], birth: '1991-10-10', createdAt: '2026-06-21', notes: 'Soliq tekshiruvi bo‘yicha konsultatsiya.' },
  { id: 'cl_12', name: 'Zarina Karimova', phone: '+998 93 112 23 34', email: 'zarina.k@mail.uz', address: 'Urganch sh., Xonqa k., 9-uy', status: 'Faol', tags: ['Fuqarolik'], birth: '1993-07-07', createdAt: '2026-07-30', notes: 'Uy-joy nizosi.' }
]

export const seedCases = [
  { id: 'LC-2026-001', title: 'Shartnoma nizosi — Qurilish MCHJ', clientId: 'cl_01', lawyer: 'Abdulaziz Yusupov', court: 'Toshkent shahar fuqarolik sudi', start: '2026-06-10', deadline: '2026-10-15', status: 'Sudda', priority: 'High', amount: 85000000, description: 'Pudratchi bilan 850 mln so‘mlik shartnoma ijrosi yuzasidan nizo.' },
  { id: 'LC-2026-002', title: 'Mehnat nizosi — noqonuniy ishdan bo‘shatish', clientId: 'cl_02', lawyer: 'Madina Rahimova', court: 'Samarqand tumanlararo sudi', start: '2026-07-01', deadline: '2026-10-05', status: 'Jarayonda', priority: 'Medium', amount: 12000000, description: 'Xodimni tiklash va majburiy progul haqini undirish.' },
  { id: 'LC-2026-003', title: 'Oilaviy nizo — mulk taqsimoti', clientId: 'cl_03', lawyer: 'Madina Rahimova', court: 'Mirzo Ulug‘bek tuman sudi', start: '2026-08-12', deadline: '2026-11-20', status: 'Yangi', priority: 'Medium', amount: 0, description: 'Nikohdan ajratish va umumiy mulkni taqsimlash.' },
  { id: 'LC-2026-004', title: 'Mulk nizosi — yer uchastkasi', clientId: 'cl_06', lawyer: 'Abdulaziz Yusupov', court: 'Toshkent viloyat sudi', start: '2026-05-18', deadline: '2026-09-30', status: 'Kutilyapti', priority: 'High', amount: 240000000, description: 'Kadastr hujjatlaridagi tafovut bo‘yicha nizo.' },
  { id: 'LC-2026-005', title: 'Qarzdorlikni undirish — 45 mln', clientId: 'cl_05', lawyer: 'Jasur Toshpo‘latov', court: 'Andijon shahar sudi', start: '2026-04-02', deadline: '2026-09-28', status: 'Sudda', priority: 'Urgent', amount: 45000000, description: 'Qarz shartnomasi bo‘yicha undiruv.' },
  { id: 'LC-2026-006', title: 'Korporativ — IT retainer', clientId: 'cl_09', lawyer: 'Abdulaziz Yusupov', court: '—', start: '2026-09-01', deadline: '2027-09-01', status: 'Jarayonda', priority: 'Low', amount: 18000000, description: 'Oylik yuridik kuzatuv shartnomasi.' },
  { id: 'LC-2026-007', title: 'Meros ishi — Saidovlar oilasi', clientId: 'cl_10', lawyer: 'Madina Rahimova', court: 'Qarshi shahar sudi', start: '2026-07-20', deadline: '2026-12-01', status: 'Jarayonda', priority: 'Medium', amount: 0, description: 'Merosni qabul qilish va taqsimlash.' },
  { id: 'LC-2026-008', title: 'Fuqarolik ishi — uy-joy nizosi', clientId: 'cl_12', lawyer: 'Jasur Toshpo‘latov', court: 'Urganch shahar sudi', start: '2026-08-25', deadline: '2026-10-30', status: 'Yangi', priority: 'High', amount: 95000000, description: 'Oldi-sotdi shartnomasini haqiqiy emas deb topish.' },
  { id: 'LC-2025-114', title: 'Jinoyat ishi — himoya', clientId: 'cl_07', lawyer: 'Abdulaziz Yusupov', court: 'Farg‘ona viloyat sudi', start: '2025-06-01', deadline: '2025-12-20', status: 'Yopilgan', priority: 'Urgent', amount: 60000000, description: 'Yakunlangan, oqlov hukmi.' }
]

export const seedPayments = [
  { id: 'INV-2401', clientId: 'cl_01', caseId: 'LC-2026-001', amount: 25000000, method: 'Bank o‘tkazma', status: 'To‘langan', date: '2026-09-10', due: '2026-09-10' },
  { id: 'INV-2402', clientId: 'cl_09', caseId: 'LC-2026-006', amount: 18000000, method: 'Bank o‘tkazma', status: 'To‘langan', date: '2026-09-05', due: '2026-09-05' },
  { id: 'INV-2403', clientId: 'cl_02', caseId: 'LC-2026-002', amount: 6000000, method: 'Click', status: 'To‘langan', date: '2026-09-18', due: '2026-09-18' },
  { id: 'INV-2404', clientId: 'cl_05', caseId: 'LC-2026-005', amount: 15000000, method: 'Naqd', status: 'Kechikkan', date: null, due: '2026-09-12' },
  { id: 'INV-2405', clientId: 'cl_06', caseId: 'LC-2026-004', amount: 20000000, method: 'Payme', status: 'Kutilmoqda', date: null, due: '2026-10-02' },
  { id: 'INV-2406', clientId: 'cl_04', caseId: 'LC-2026-001', amount: 12000000, method: 'Bank o‘tkazma', status: 'Kutilmoqda', date: null, due: '2026-10-08' },
  { id: 'INV-2407', clientId: 'cl_12', caseId: 'LC-2026-008', amount: 10000000, method: 'Click', status: 'To‘langan', date: '2026-08-28', due: '2026-08-28' },
  { id: 'INV-2408', clientId: 'cl_10', caseId: 'LC-2026-007', amount: 8000000, method: 'Naqd', status: 'To‘langan', date: '2026-08-15', due: '2026-08-15' }
]

export const seedEvents = [
  { id: 'ev_1', title: 'Mijoz uchrashuvi — Abdulla Karimov', clientId: 'cl_01', caseId: 'LC-2026-001', date: '2026-09-29', start: '10:00', end: '11:00', type: 'Uchrashuv', location: 'Ofis, 2-qavat', notes: 'Shartnoma ijrosi muhokamasi' },
  { id: 'ev_2', title: 'Sud majlisi — Mehnat nizosi', clientId: 'cl_02', caseId: 'LC-2026-002', date: '2026-09-29', start: '14:30', end: '16:00', type: 'Sud', location: 'Samarqand tumanlararo sudi', notes: 'Guvohlar so‘rovi' },
  { id: 'ev_3', title: 'Deadline — Mulk nizosi hujjatlari', clientId: 'cl_06', caseId: 'LC-2026-004', date: '2026-09-30', start: '18:00', end: '18:30', type: 'Deadline', location: '', notes: 'Apellyatsiya shikoyati topshirish' },
  { id: 'ev_4', title: 'Online konsultatsiya — Kamola Y.', clientId: 'cl_03', caseId: 'LC-2026-003', date: '2026-09-30', start: '11:00', end: '11:45', type: 'Qo‘ng‘iroq', location: 'Zoom', notes: '' },
  { id: 'ev_5', title: 'Shartnoma imzolash — Sardor U.', clientId: 'cl_09', caseId: 'LC-2026-006', date: '2026-10-01', start: '09:30', end: '10:15', type: 'Uchrashuv', location: 'Ofis', notes: 'Retainer shartnomasi' }
]

export const seedDocs = [
  { id: 'doc_1', name: 'Shartnoma_Qurilish_MCHJ_2026.pdf', category: 'Shartnomalar', size: '2.4 MB', type: 'pdf', clientId: 'cl_01', caseId: 'LC-2026-001', updated: '2026-09-20' },
  { id: 'doc_2', name: 'Da’vo_ariza_mehnat_nizosi.docx', category: 'Sud hujjatlari', size: '184 KB', type: 'docx', clientId: 'cl_02', caseId: 'LC-2026-002', updated: '2026-09-12' },
  { id: 'doc_3', name: 'Pasport_nusxa_Kamola_Y.pdf', category: 'Mijoz hujjatlari', size: '1.1 MB', type: 'pdf', clientId: 'cl_03', caseId: 'LC-2026-003', updated: '2026-08-30' },
  { id: 'doc_4', name: 'Kadastr_hujjat_mulk.xlsx', category: 'Sud hujjatlari', size: '96 KB', type: 'xlsx', clientId: 'cl_06', caseId: 'LC-2026-004', updated: '2026-09-25' },
  { id: 'doc_5', name: 'Hisobot_avgust_2026.pdf', category: 'Hisobotlar', size: '3.8 MB', type: 'pdf', clientId: null, caseId: null, updated: '2026-09-01' },
  { id: 'doc_6', name: 'Qarz_shartnomasi_scan.pdf', category: 'Mijoz hujjatlari', size: '900 KB', type: 'pdf', clientId: 'cl_05', caseId: 'LC-2026-005', updated: '2026-07-14' }
]

export const seedTeam = [
  { id: 'tm_1', name: 'Abdulaziz Yusupov', position: 'Bosh yurist', email: 'abdulaziz@lawcrm.uz', phone: '+998 90 111 22 33', role: 'Admin', status: 'Online', cases: 14, winRate: 92 },
  { id: 'tm_2', name: 'Madina Rahimova', position: 'Senior Lawyer', email: 'madina@lawcrm.uz', phone: '+998 91 222 33 44', role: 'Senior Lawyer', status: 'Online', cases: 11, winRate: 88 },
  { id: 'tm_3', name: 'Jasur Toshpo‘latov', position: 'Yurist', email: 'jasur@lawcrm.uz', phone: '+998 93 333 44 55', role: 'Lawyer', status: 'Band', cases: 8, winRate: 81 },
  { id: 'tm_4', name: 'Sevara Olimova', position: 'Yurist yordamchisi', email: 'sevara@lawcrm.uz', phone: '+998 94 444 55 66', role: 'Assistant', status: 'Online', cases: 5, winRate: 0 },
  { id: 'tm_5', name: 'Botir Qodirov', position: 'Buxgalter', email: 'botir@lawcrm.uz', phone: '+998 95 555 66 77', role: 'Accountant', status: 'Offline', cases: 0, winRate: 0 }
]

export const seedMessages = [
  { id: 'conv_1', name: 'Abdulla Karimov', online: true, unread: 2, last: 'Shartnoma loyihasini ko‘rib chiqdingizmi?', time: '09:42', messages: [
    { from: 'them', text: 'Assalomu alaykum! Sud sanasi aniq bo‘ldimi?', time: '09:10' },
    { from: 'me', text: 'Va alaykum assalom! Ha, 15-oktabr, soat 10:00 ga belgilandi.', time: '09:15' },
    { from: 'them', text: 'Shartnoma loyihasini ko‘rib chiqdingizmi?', time: '09:42' }
  ]},
  { id: 'conv_2', name: 'Madina Rahimova', online: true, unread: 0, last: 'Ertangi sudga hujjatlar tayyor ✅', time: '08:30', messages: [
    { from: 'them', text: 'Ertangi sudga hujjatlar tayyor ✅', time: '08:30' },
    { from: 'me', text: 'Zo‘r, rahmat! Guvoh ro‘yxatini ham qo‘shib qo‘ying.', time: '08:35' }
  ]},
  { id: 'conv_3', name: 'Sardor Usmonov', online: false, unread: 1, last: 'Retainer to‘lovini o‘tkazdim', time: 'Kecha', messages: [
    { from: 'them', text: 'Retainer to‘lovini o‘tkazdim', time: 'Kecha' }
  ]},
  { id: 'conv_4', name: 'Kamola Yuldasheva', online: false, unread: 0, last: 'Rahmat, tushunarli!', time: 'Kecha', messages: [
    { from: 'me', text: 'Hujjatlar ro‘yxatini yubordim, iltimos to‘ldirib yuboring.', time: 'Kecha' },
    { from: 'them', text: 'Rahmat, tushunarli!', time: 'Kecha' }
  ]}
]

export const seedNotifications = [
  { id: 'n1', type: 'client', title: 'Yangi mijoz qo‘shildi', text: 'Zarina Karimova tizimga qo‘shildi', time: '10 daq oldin', read: false },
  { id: 'n2', type: 'payment', title: 'To‘lov qabul qilindi', text: 'INV-2403 — 6 000 000 so‘m (Click)', time: '1 soat oldin', read: false },
  { id: 'n3', type: 'deadline', title: 'Deadline yaqinlashmoqda', text: 'Mulk nizosi — hujjat topshirishga 1 kun qoldi', time: '3 soat oldin', read: false },
  { id: 'n4', type: 'appointment', title: 'Yangi uchrashuv', text: 'Ertaga 11:00 — Kamola Y. bilan Zoom', time: 'Kecha', read: true },
  { id: 'n5', type: 'document', title: 'Hujjat yuklandi', text: 'Kadastr_hujjat_mulk.xlsx yuklandi', time: 'Kecha', read: true }
]

export const revenueSeries = [
  { m: 'Apr', daromad: 42000000, xarajat: 18000000 },
  { m: 'May', daromad: 51000000, xarajat: 21000000 },
  { m: 'Iyn', daromad: 48000000, xarajat: 19000000 },
  { m: 'Iyl', daromad: 63000000, xarajat: 24000000 },
  { m: 'Avg', daromad: 71000000, xarajat: 26000000 },
  { m: 'Sen', daromad: 79000000, xarajat: 28000000 }
]

export const caseStatusData = [
  { name: 'Yangi', value: 12 },
  { name: 'Jarayonda', value: 28 },
  { name: 'Sudda', value: 16 },
  { name: 'Kutilyapti', value: 7 },
  { name: 'Yopilgan', value: 34 }
]

export const clientGrowth = [
  { m: 'Apr', mijozlar: 62 }, { m: 'May', mijozlar: 71 },
  { m: 'Iyn', mijozlar: 78 }, { m: 'Iyl', mijozlar: 89 },
  { m: 'Avg', mijozlar: 104 }, { m: 'Sen', mijozlar: 118 }
]

export const activityFeed = [
  { id: 'a1', icon: 'user', text: 'Yangi mijoz qo‘shildi — Zarina Karimova', time: '10 daq oldin', color: 'blue' },
  { id: 'a2', icon: 'file', text: 'Shartnoma yuklandi — Qurilish MCHJ', time: '45 daq oldin', color: 'violet' },
  { id: 'a3', icon: 'card', text: 'To‘lov qabul qilindi — 6 000 000 so‘m', time: '1 soat oldin', color: 'emerald' },
  { id: 'a4', icon: 'cal', text: 'Yangi uchrashuv belgilandi — Kamola Y.', time: '2 soat oldin', color: 'amber' },
  { id: 'a5', icon: 'scale', text: 'LC-2026-002 sudga o‘tkazildi', time: '5 soat oldin', color: 'indigo' }
]
