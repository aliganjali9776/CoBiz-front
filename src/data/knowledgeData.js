// src/data/knowledgeData.js

export const knowledgeData = [
  // --- دسته: خلاصه کتاب ---
  {
    id: 'b01',
    title: 'خلاصه کتاب: مدیر یک دقیقه‌ای',
    category: 'مدیریت تیم',
    format: 'خلاصه کتاب',
    summary: 'سه راز کلیدی برای تبدیل شدن به یک مدیر کارآمد که به تیم خود قدرت می‌بخشد و نتایج را به حداکثر می‌رساند.',
    tags: ['مدیریت', 'بهره‌وری', 'بازخورد'],
    content: [
      { type: 'h2', text: 'راز اول: اهداف یک دقیقه‌ای' },
      { type: 'p', text: 'اهداف باید شفاف، قابل اندازه‌گیری و در کمتر از یک دقیقه قابل بازخوانی باشند. مطمئن شوید شما و کارمندتان درک یکسانی از یک "کار خوب" دارید.' },
      { type: 'li', text: 'هر هدف را در یک برگه جداگانه بنویسید.' },
      { type: 'li', text: 'رفتارهای مورد انتظار را مشخص کنید، نه فقط نتایج را.' },
    ]
  },
  // --- دسته: چک‌لیست ---
  {
    id: 'c01',
    title: 'چک‌لیست جلسه یک-به-یک مؤثر',
    category: 'مدیریت تیم',
    format: 'چک‌لیست',
    summary: 'یک راهنمای گام به گام برای تبدیل جلسات هفتگی شما به قدرتمندترین ابزار مدیریتی‌تان.',
    tags: ['جلسه', 'بازخورد', 'ارتباط'],
    content: [
      { type: 'h2', text: 'قبل از جلسه' },
      { type: 'li', text: 'از کارمند بخواهید دستور جلسه (Agenda) را او تعیین کند.' },
      { type: 'li', text: 'حداقل ۱۵ دقیقه قبل از جلسه، دستور جلسه را مطالعه کنید.' },
      { type: 'h2', text: 'در حین جلسه' },
      { type: 'li', text: 'با یک سوال غیرکاری و شخصی شروع کنید تا فضا دوستانه شود.' },
      { type: 'li', text: '۸۰٪ زمان را به گوش دادن فعال اختصاص دهید.' },
      { type: 'li', text: 'موانع و مشکلات کارمند را بپرسید و برای رفع آن‌ها راه حل پیدا کنید.' },
      { type: 'h2', text: 'بعد از جلسه' },
      { type: 'li', text: 'یک خلاصه کوتاه از تصمیمات و اقدامات بعدی را ارسال کنید.' },
    ]
  },
  // --- دسته: چارچوب ---
  {
    id: 'f01',
    title: 'چارچوب GROW برای کوچینگ',
    category: 'توسعه فردی',
    format: 'چارچوب',
    summary: 'یک مدل چهار مرحله‌ای ساده و قدرتمند برای هدایت گفتگوهای کوچینگ و کمک به رشد کارمندان.',
    tags: ['کوچینگ', 'رشد', 'گفتگو'],
    content: [
      { type: 'h2', text: 'G - Goal (هدف)' },
      { type: 'p', text: 'در این مرحله، هدف اصلی گفتگو را مشخص می‌کنید. از کارمند بپرسید: "در پایان این جلسه می‌خواهی به چه چیزی برسی؟"' },
      { type: 'h2', text: 'R - Reality (واقعیت)' },
      { type: 'p', text: 'وضعیت فعلی را بدون قضاوت بررسی کنید. بپرسید: "الان دقیقاً کجا هستیم؟ چه اقداماتی تا الان انجام داده‌ای؟"' },
      { type: 'h2', text: 'O - Options (گزینه‌ها)' },
      { type: 'p', text: 'برای رسیدن به هدف، تمام گزینه‌های ممکن را بررسی کنید. بپرسید: "چه کارهای دیگری می‌توانی انجام دهی؟ اگر هیچ محدودیتی نداشتی چه می‌کردی؟"' },
      { type: 'h2', text: 'W - Will (اراده / اقدام بعدی)' },
      { type: 'p', text: 'گفتگو را با یک اقدام عملی و مشخص به پایان برسانید. بپرسید: "خب، اولین و ساده‌ترین قدمی که می‌توانی برداری چیست؟ از ۱ تا ۱۰ چقدر به انجام آن متعهد هستی؟"' },
    ]
  },
  // --- دسته: مقالات علمی ---
  {
    id: 'a01',
    title: 'مقاله: تاثیر امنیت روانی بر عملکرد تیم',
    category: 'فرهنگ سازمانی',
    format: 'مقاله علمی',
    summary: 'بررسی تحقیقات دانشگاه هاروارد در مورد اینکه چگونه ایجاد یک محیط امن برای ریسک کردن، به نوآوری و یادگیری در تیم‌ها منجر می‌شود.',
    tags: ['امنیت روانی', 'گوگل', 'عملکرد'],
    content: [
      { type: 'p', text: 'تحقیقات گسترده گوگل در پروژه ارسطو (Project Aristotle) نشان داد که مهم‌ترین عامل در موفقیت یک تیم، "امنیت روانی" است.' },
      { type: 'p', text: 'امنیت روانی یعنی اعضای تیم احساس راحتی کنند که بدون ترس از تنبیه یا تحقیر شدن، ریسک‌های بین فردی را بپذیرند؛ یعنی به راحتی سوال بپرسند، ایده‌های جدید بدهند، اشتباهاتشان را بپذیرند و با یکدیگر مخالفت کنند.' },
    ]
  },
];