export type HomeContent = {
  hero: {
    badge: string;
    title: string;
    highlight: string;
    titleSuffix: string;
    description: string;
    achievements: string[];
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    backgroundImage: { src: string; alt: string };
    portraitImage: { src: string; alt: string };
    statCards: { value: string; label: string }[];
  };
  stats: {
    items: {
      icon: string;
      label: string;
      value: number;
      suffix: string;
      color: string;
    }[];
  };
  problems: {
    title: string;
    highlight: string;
    description: string;
    items: { title: string; description: string; icon: string }[];
    cta: { label: string; href: string };
  };
  services: {
    title: string;
    highlight: string;
    description: string;
    childrenLabel: string;
    adultsLabel: string;
  };
  therapy: {
    title: string;
    highlight: string;
    description: string;
    steps: string[];
    gallery: { src: string; title: string }[];
    cta: { label: string; href: string };
  };
  aboutPreview: {
    name: string;
    highlight: string;
    title: string;
    quote: string;
    experienceValue: string;
    experienceLabel: string;
    credentials: { title: string; subtitle: string; icon: string }[];
    image: { src: string; alt: string };
  };
  aiCta: {
    title: string;
    description: string;
    features: { text: string; icon: string }[];
    buttonLabel: string;
    buttonHref: string;
    footnote: string;
  };
  testimonials: {
    title: string;
    highlight: string;
    description: string;
    items: {
      content: string;
      author: string;
      relation: string;
      location: string;
      date: string;
      rating: number;
      serviceType: string;
    }[];
    videoTitle: string;
    videos: { title: string; thumbnail: string; videoUrl: string }[];
  };
};

export type AboutContent = {
  hero: {
    name: string;
    highlight: string;
    title: string;
    paragraphs: string[];
    quote: string;
    stats: { value: string; label: string }[];
    image: { src: string; alt: string };
  };
  timeline: { year: string; title: string; description: string; icon: string }[];
  certifications: string[];
  values: { title: string; description: string; icon: string }[];
};

export type BookingContent = {
  title: string;
  highlight: string;
  description: string;
  features: { text: string; icon: string }[];
  contactPrompt: string;
  phoneCtaLabel: string;
  whatsappCtaLabel: string;
};

export type AssessmentContent = {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  features: { text: string; icon: string }[];
};

export type TherapyContent = {
  hero: {
    badge: string;
    title: string;
    highlight: string;
    description: string;
    ctaPrimaryLabel: string;
    ctaPrimaryHref: string;
    ctaSecondaryLabel: string;
    ctaSecondaryHref: string;
  };
  routeSummaryTitle: string;
  routeSteps: { title: string; description: string }[];
  toolsTitle: string;
  toolsDescription: string;
  toolSets: { title: string; description: string; icon: string }[];
  galleryTitle: string;
  galleryDescription: string;
  gallery: { src: string; label: string }[];
};

export type ContactContent = {
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  appointmentTitle: string;
  appointmentDescription: string;
  appointmentFeatures: string[];
  messageTitle: string;
  messageDescription: string;
  infoTitle: string;
  quickContactTitle: string;
  quickContactDescription: string;
  locationTitle: string;
};

export type ServicesPageContent = {
  title: string;
  description: string;
  childrenTitle: string;
  childrenDescription: string;
  adultsTitle: string;
  adultsDescription: string;
};

export type BlogContent = {
  title: string;
  highlight: string;
  description: string;
  categories: string[];
  featuredTitle: string;
  featuredDescription: string;
  featuredArticles: Array<{
    slug: string;
    title: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    excerpt: string;
    summary: string;
    keyPoints: string[];
    tips: string[];
    sources: { name: string; url: string }[];
  }>;
  newsletterTitle: string;
  newsletterDescription: string;
  newsletterPlaceholder: string;
  newsletterButton: string;
  disclaimer: string;
};

export const DEFAULT_HOME_CONTENT: HomeContent = {
  hero: {
    badge: "Türkiye'nin Güvenilir Terapi Merkezi",
    title: "Çocuğunuzun",
    highlight: "Potansiyelini",
    titleSuffix: "Birlikte Keşfedelim",
    description:
      "Duyusal bütünleme, otizm, ADHD ve disleksi alanlarında uzman kadromuzla çocuğunuzun gelişimine bilimsel ve sevgi dolu bir yaklaşım sunuyoruz.",
    achievements: [
      "30+ Yıl Devlet Deneyimi",
      "10.000+ Mutlu Aile",
      "Bilimsel Terapi Yaklaşımları"
    ],
    primaryCta: { label: "Ücretsiz Değerlendirme", href: "/degerlendirme" },
    secondaryCta: { label: "Tanıtım Videosu", href: "#video" },
    backgroundImage: { src: "/images/hero-bg.jpg", alt: "Terapi ortamı" },
    portraitImage: { src: "/images/volkan-portrait.png", alt: "Volkan Özcihan" },
    statCards: [
      { value: "30+", label: "Yıl Deneyim" },
      { value: "10K+", label: "Mutlu Aile" }
    ]
  },
  stats: {
    items: [
      { icon: "clock", value: 30, suffix: "+", label: "Yıl Deneyim", color: "text-primary-500" },
      { icon: "users", value: 5000, suffix: "+", label: "Tedavi Edilen Çocuk", color: "text-accent-500" },
      { icon: "heart", value: 98, suffix: "%", label: "Memnuniyet Oranı", color: "text-success-500" },
      { icon: "award", value: 15, suffix: "+", label: "Ödül & Sertifika", color: "text-purple-500" }
    ]
  },
  problems: {
    title: "Çocuğunuzda Bunları",
    highlight: "Gözlemliyor Musunuz?",
    description:
      "Bu belirtiler, çocuğunuzun profesyonel destek almasının faydalı olabileceğini gösteriyor olabilir. Endişelenmeyin, birlikte çözüm bulabiliriz.",
    items: [
      {
        icon: "eye",
        title: "Göz Teması Kurmakta Zorluk",
        description: "Çocuğunuz sizinle veya başkalarıyla göz teması kurmaktan kaçınıyor mu?"
      },
      {
        icon: "ear",
        title: "Seslere Aşırı Hassasiyet",
        description: "Belirli seslere karşı aşırı tepki veriyor veya hiç tepki vermiyor mu?"
      },
      {
        icon: "hand",
        title: "Dokunmaya Tepki Problemleri",
        description: "Dokunulmaktan kaçınıyor veya sürekli dokunsal uyaran mı arıyor?"
      },
      {
        icon: "book",
        title: "Okuma-Yazma Güçlükleri",
        description: "Harfleri karıştırıyor, ters yazıyor veya okumakta zorlanıyor mu?"
      },
      {
        icon: "zap",
        title: "Aşırı Hareketlilik",
        description: "Bir yerde oturmakta zorlanıyor, sürekli hareket halinde mi?"
      },
      {
        icon: "alert",
        title: "Kaygı ve Korkular",
        description: "Yeni ortamlarda aşırı kaygılanıyor veya nedensiz korkular mı yaşıyor?"
      }
    ],
    cta: {
      label: "Ücretsiz Değerlendirme Yap",
      href: "/degerlendirme"
    }
  },
  services: {
    title: "Uzman",
    highlight: "Terapi Hizmetlerimiz",
    description:
      "Her bireyin ihtiyacına özel, bilimsel temelli terapi programları sunuyoruz.",
    childrenLabel: "Çocuk Terapileri",
    adultsLabel: "Yetişkin Rehabilitasyon"
  },
  therapy: {
    title: "Eğitim Rotası &",
    highlight: "Terapi Ortamı",
    description:
      "Seanslarımızı, çocuğun ihtiyacına göre yapılandırılmış bir rota ile planlıyoruz. Kullanılan setler, oyuncaklar ve uygulama alanları sürecin hedeflerine göre seçilir.",
    steps: [
      "İlk görüşme ve ihtiyaç analizi",
      "Kişiselleştirilmiş eğitim rotası",
      "Oyun temelli uygulamalar",
      "Ev programı ve düzenli takip"
    ],
    gallery: [
      { src: "/images/therapy/therapy-R1.png", title: "Duyusal oyun alanı" },
      { src: "/images/therapy/therapy-R2.png", title: "Denge ve koordinasyon çalışmaları" },
      { src: "/images/therapy/therapy-R3.png", title: "Eğitim setleri ve oyuncaklar" }
    ],
    cta: { label: "Daha Fazla Bilgi", href: "/terapi-sureci" }
  },
  aboutPreview: {
    name: "Volkan",
    highlight: "Özcihan",
    title: "Uzman Fizyoterapist & Duyusal Bütünleme Terapisti",
    quote:
      "\"30 yıl boyunca devlet kurumlarında binlerce çocuk ve aileye dokundum. Şimdi bu birikimi sizinle paylaşmak için buradayım.\"",
    experienceValue: "30",
    experienceLabel: "Yıl Deneyim",
    credentials: [
      { icon: "graduation", title: "Hacettepe Üniversitesi", subtitle: "Fizyoterapi ve Rehabilitasyon" },
      { icon: "award", title: "Duyusal Bütünleme", subtitle: "Uluslararası Sertifika" },
      { icon: "building", title: "30 Yıl", subtitle: "Devlet Hastanesi Deneyimi" },
      { icon: "baby", title: "Pediatrik", subtitle: "Rehabilitasyon Uzmanı" }
    ],
    image: { src: "/images/volkan-portrait.png", alt: "Volkan Özcihan" }
  },
  aiCta: {
    title: "Yapay Zeka Destekli Ücretsiz Değerlendirme",
    description:
      "Çocuğunuzun gelişimi hakkında 3 dakikada kişiselleştirilmiş ön değerlendirme raporu alın",
    features: [
      { icon: "clock", text: "Sadece 3 dakika" },
      { icon: "sparkles", text: "AI destekli analiz" },
      { icon: "shield", text: "Gizlilik garantisi" }
    ],
    buttonLabel: "Hemen Başla - Ücretsiz",
    buttonHref: "/degerlendirme",
    footnote: "12 basit soru · Anlık sonuç · Kişisel öneriler"
  },
  testimonials: {
    title: "Ailelerimizden",
    highlight: "Gelen Mutluluklar",
    description: "Binlerce ailenin güvenini kazandık. İşte onların hikayeleri.",
    items: [
      {
        content:
          "Oğlum Efe, 3 ay önce göz teması bile kuramıyordu. Şimdi arkadaşlarıyla oynuyor, gülümsüyor. Volkan Bey'in sabırlı ve sevgi dolu yaklaşımı hayatımızı değiştirdi.",
        author: "A.Y.",
        relation: "Anne",
        location: "İstanbul",
        date: "Kasım 2025",
        rating: 5,
        serviceType: "Otizm Terapisi"
      },
      {
        content:
          "Kızımın okuma güçlüğü için çok endişeleniyorduk. 6 aylık terapi sonunda akranlarıyla aynı seviyeye geldi. Öğretmeni bile inanamadı!",
        author: "M.K.",
        relation: "Baba",
        location: "Ankara",
        date: "Ekim 2025",
        rating: 5,
        serviceType: "Disleksi Terapisi"
      },
      {
        content:
          "Hiperaktif oğlum artık derslerine odaklanabiliyor. Evde verilen egzersizler çok faydalı oldu. Tüm aileye teşekkürler.",
        author: "S.T.",
        relation: "Anne",
        location: "İzmir",
        date: "Aralık 2025",
        rating: 5,
        serviceType: "ADHD Desteği"
      },
      {
        content:
          "Annemin kalça ameliyatı sonrası evde bakım hizmeti aldık. Profesyonel ve şefkatli yaklaşımları için minnettarız.",
        author: "E.D.",
        relation: "Oğlu",
        location: "İstanbul",
        date: "Ocak 2026",
        rating: 5,
        serviceType: "Evde Bakım"
      }
    ],
    videoTitle: "Video Hikayeler",
    videos: [
      { title: "Efe'nin Hikayesi", thumbnail: "/images/testimonials/video-1.jpg", videoUrl: "/videos/efe-hikayesi.mp4" },
      { title: "Elif'in Başarısı", thumbnail: "/images/testimonials/video-2.jpg", videoUrl: "" },
      { title: "Yusuf'un Gelişimi", thumbnail: "/images/testimonials/video-3.jpg", videoUrl: "" }
    ]
  }
};

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  hero: {
    name: "Volkan",
    highlight: "Özcihan",
    title: "Uzman Fizyoterapist & Duyusal Bütünleme Terapisti",
    paragraphs: [
      "Merhaba, ben Volkan Özcihan. 30 yılı aşkın süredir çocukların gelişimine ve ailelerin mutluluğuna katkıda bulunuyorum.",
      "Hacettepe Üniversitesi Fizyoterapi ve Rehabilitasyon bölümünden mezun olduktan sonra, kariyerimin büyük bölümünü devlet hastanelerinde pediatrik rehabilitasyon alanında geçirdim.",
      "Bu süreçte binlerce çocuk ve aileyle çalışma fırsatı buldum. Her çocuğun benzersiz olduğunu ve doğru yaklaşımla mucizeler yaratabileceğini öğrendim."
    ],
    quote:
      "\"Her çocuk bir hazine, her adım bir umut. Ailelerin gözlerindeki mutluluğu görmek, bu işi yapmamın en büyük motivasyonu.\"",
    stats: [
      { value: "30+", label: "Yıl Deneyim" },
      { value: "10K+", label: "Mutlu Aile" }
    ],
    image: { src: "/images/volkan-portrait.png", alt: "Volkan Özcihan" }
  },
  timeline: [
    {
      year: "1995",
      title: "Meslek Hayatının Başlangıcı",
      description: "Hacettepe Üniversitesi Fizyoterapi ve Rehabilitasyon bölümünden mezuniyet.",
      icon: "graduation"
    },
    {
      year: "1996-2010",
      title: "Devlet Hastanesi Deneyimi",
      description: "Çeşitli devlet hastanelerinde pediatrik rehabilitasyon uzmanı olarak görev.",
      icon: "building"
    },
    {
      year: "2010",
      title: "Duyusal Bütünleme Sertifikası",
      description: "Uluslararası duyusal bütünleme terapi sertifikası alındı.",
      icon: "award"
    },
    {
      year: "2015",
      title: "10.000+ Tedavi",
      description: "Kariyer boyunca 10.000'den fazla çocuk ve aileye ulaşıldı.",
      icon: "users"
    },
    {
      year: "2025",
      title: "Özel Klinik",
      description: "Birikimlerini ailelerle paylaşmak için özel klinik açıldı.",
      icon: "heart"
    }
  ],
  certifications: [
    "Duyusal Bütünleme Terapi Sertifikası (Uluslararası)",
    "Pediatrik Nörogelişimsel Tedavi (NDT/Bobath)",
    "Otizm Spektrum Bozukluğu Değerlendirme",
    "ADHD Terapi Yaklaşımları",
    "Disleksi ve Öğrenme Güçlükleri",
    "Geriatrik Rehabilitasyon Uzmanlığı"
  ],
  values: [
    {
      icon: "heart",
      title: "Sevgi & Şefkat",
      description: "Her çocuğa kendi çocuğumuzmuş gibi yaklaşırız."
    },
    {
      icon: "book",
      title: "Bilimsel Yaklaşım",
      description: "Kanıta dayalı, güncel terapi yöntemleri uygularız."
    },
    {
      icon: "users",
      title: "Aile Odaklılık",
      description: "Terapiye tüm aileyi dahil eder, birlikte çalışırız."
    }
  ]
};

export const DEFAULT_BOOKING_CONTENT: BookingContent = {
  title: "Online",
  highlight: "Randevu",
  description: "Size en uygun tarih ve saati seçin, randevunuzu hemen onaylayalım.",
  features: [
    { icon: "clock", text: "7/24 Online Randevu" },
    { icon: "shield", text: "Ücretsiz İptal" },
    { icon: "message", text: "WhatsApp Hatırlatma" }
  ],
  contactPrompt: "Telefonla randevu almayı mı tercih edersiniz?",
  phoneCtaLabel: "Telefonla Ara",
  whatsappCtaLabel: "WhatsApp ile Ulaşın"
};

export const DEFAULT_ASSESSMENT_CONTENT: AssessmentContent = {
  badge: "Yapay Zeka Destekli",
  title: "Ücretsiz",
  highlight: "Ön Değerlendirme",
  description:
    "Birkaç basit soruyu yanıtlayarak çocuğunuzun gelişimi hakkında kişiselleştirilmiş bir ön değerlendirme raporu alın.",
  features: [
    { icon: "clock", text: "Sadece 3-5 dakika" },
    { icon: "sparkles", text: "AI destekli analiz" },
    { icon: "shield", text: "Gizlilik garantisi" }
  ]
};

export const DEFAULT_THERAPY_CONTENT: TherapyContent = {
  hero: {
    badge: "Terapi Süreci",
    title: "Eğitim Rotası &",
    highlight: "Uygulama Alanları",
    description:
      "Eğitim süreci, çocuğun ihtiyaçlarına göre kişiselleştirilir. Oyun temelli yaklaşımımızda setler, oyuncaklar ve uygulama alanları hedeflere uygun biçimde planlanır.",
    ctaPrimaryLabel: "Randevu Al",
    ctaPrimaryHref: "/randevu",
    ctaSecondaryLabel: "Bize Ulaşın",
    ctaSecondaryHref: "/iletisim"
  },
  routeSummaryTitle: "Eğitim Rotası Özeti",
  routeSteps: [
    {
      title: "1. Ön Görüşme & Değerlendirme",
      description:
        "İhtiyaçları ve hedefleri belirlemek için detaylı görüşme ve değerlendirme yapılır."
    },
    {
      title: "2. Kişisel Eğitim Rotası",
      description:
        "Çocuğun güçlü yönlerine göre hedefler belirlenir ve seans planı oluşturulur."
    },
    {
      title: "3. Uygulama & Oyun Temelli Seanslar",
      description:
        "Duyusal setler, oyuncaklar ve araçlarla desteklenen oyun temelli çalışmalar yapılır."
    },
    {
      title: "4. Ev Programı & Takip",
      description:
        "Aileye evde uygulanabilir öneriler verilir ve düzenli takip ile ilerleme izlenir."
    }
  ],
  toolsTitle: "Kullanılan Eğitim Setleri & Oyuncaklar",
  toolsDescription:
    "Her seans, hedeflenen becerilere göre planlanan set ve araçlarla desteklenir.",
  toolSets: [
    {
      icon: "balance",
      title: "Denge ve vestibüler setleri",
      description:
        "Denge tahtaları, salıncaklar ve tırmanma ekipmanlarıyla vestibüler sistemi uyarırız. Postür kontrolü, denge ve hareket güvenliği gelişir. Seanslar kontrollü şekilde zorlaştırılır."
    },
    {
      icon: "sensory",
      title: "Duyusal oyun materyalleri",
      description:
        "Farklı doku, ses ve görsel uyaranlar içeren materyallerle duyusal modülasyon çalışılır. Amaç, aşırı hassasiyetleri azaltmak ve uygun tepkileri güçlendirmektir. Oyun kurgusu motivasyonu korur."
    },
    {
      icon: "fineMotor",
      title: "İnce motor beceri setleri",
      description:
        "Kalem tutma, kesme, kavrama ve dizme gibi beceriler hedeflenir. El-göz koordinasyonu ve parmak kasları güçlenir. Günlük yaşamda bağımsızlık artar."
    },
    {
      icon: "visual",
      title: "Görsel-dikkat destekleyici araçlar",
      description:
        "Görsel tarama, eşleştirme ve odaklanma becerileri için yapılandırılmış oyunlar kullanılır. Dikkat süresi uzar ve ayrıntı farkındalığı gelişir. Okul çalışmalarına transfer hedeflenir."
    },
    {
      icon: "tactile",
      title: "Dokunsal materyaller ve uyaranlar",
      description:
        "Kum, fırça, dokulu top gibi uyaranlarla dokunsal tolerans desteklenir. Kaçınma davranışları azalırken güvenli temas artar. Çocuğun rahatlama düzeyi yükselir."
    },
    {
      icon: "planning",
      title: "Motor planlama ve koordinasyon ekipmanları",
      description:
        "Parkurlar ve sıralı hareket görevleriyle motor planlama geliştirilir. Koordinasyon, bilateral kullanım ve ritim becerileri güçlenir. Hareket özgüveni artar."
    }
  ],
  galleryTitle: "Terapi Ortamı & Uygulama Alanları",
  galleryDescription:
    "Eğitim alanları, çocuğun güvenli ve odaklı hissetmesini sağlayacak şekilde düzenlenir.",
  gallery: [
    { src: "/images/therapy/therapy-R1.png", label: "Duyusal oyun alanı" },
    { src: "/images/therapy/therapy-R2.png", label: "Denge parkuru" },
    { src: "/images/therapy/therapy-R3.png", label: "Eğitim setleri" },
    { src: "/images/therapy/therapy-R4.png", label: "Motor beceri köşesi" },
    { src: "/images/therapy/therapy-R5.png", label: "Odaklanma çalışmaları" },
    { src: "/images/therapy/therapy-R6.png", label: "Oyun ve sosyal etkileşim" }
  ]
};

export const DEFAULT_CONTACT_CONTENT: ContactContent = {
  heroBadge: "Online Randevu",
  heroTitle: "Randevu Almak",
  heroHighlight: "Çok Kolay",
  heroDescription:
    "Size uygun gün ve saati seçin, randevunuzu hızlıca planlayalım. WhatsApp veya telefonla da hemen ulaşabilirsiniz.",
  heroPrimaryCta: "Online Randevu Al",
  heroSecondaryCta: "Ücretsiz Değerlendirme",
  appointmentTitle: "Randevu Planı",
  appointmentDescription:
    "Randevular kişiye özel planlanır. İlk görüşmede ihtiyaçları belirleyip yol haritasını çıkarıyoruz.",
  appointmentFeatures: [
    "7/24 online randevu imkanı",
    "Anlık onay ve hatırlatma",
    "Ücretsiz iptal ve değişiklik",
    "WhatsApp ile hızlı bilgilendirme"
  ],
  messageTitle: "Bize Mesaj Gönderin",
  messageDescription: "Sorularınızı iletin; en kısa sürede size dönüş yapalım.",
  infoTitle: "İletişim Bilgileri",
  quickContactTitle: "Hızlı İletişim",
  quickContactDescription:
    "En hızlı dönüş için WhatsApp üzerinden yazabilir veya doğrudan arayabilirsiniz.",
  locationTitle: "Konum"
};

export const DEFAULT_SERVICES_PAGE_CONTENT: ServicesPageContent = {
  title: "Hizmetlerimiz",
  description:
    "Her bireyin ihtiyacına özel, bilimsel temelli programlarla çocuk ve yetişkin rehabilitasyonunda güvenli çözümler sunuyoruz.",
  childrenTitle: "Çocuk Terapileri",
  childrenDescription:
    "Gelişimsel ihtiyaçlara özel, oyun temelli ve aileyi sürece dahil eden yaklaşımlar uyguluyoruz.",
  adultsTitle: "Yetişkin Rehabilitasyon",
  adultsDescription:
    "İyileşme sürecini hızlandıran, güvenli ve sürdürülebilir bakım planlarıyla yanınızdayız."
};

export const DEFAULT_BLOG_CONTENT: BlogContent = {
  title: "Blog &",
  highlight: "Kaynaklar",
  description:
    "Çocuk gelişimi, terapi yöntemleri ve aile rehberliği hakkında bilimsel temelli yazılar ve pratik ipuçları.",
  categories: [
    "Tümü",
    "Duyusal Bütünleme",
    "Otizm",
    "ADHD",
    "Disleksi",
    "Aile Rehberi"
  ],
  featuredTitle: "Öne Çıkan Bilimsel Yazılar",
  featuredDescription:
    "Kaynaklarımızın açık, uygulaması pratik üç temel konuya odaklandık.",
  featuredArticles: [
    {
      slug: "duyusal-isleme",
      title: "Duyusal İşleme ve Günlük Yaşam",
      category: "Duyusal Bütünleme",
      date: "2026-01-14",
      readTime: "6 dk okuma",
      image: "/images/blog/duyusal-isleme.png",
      excerpt:
        "Duyusal işleme güçlükleri, çocuğun günlük yaşam rutinlerini, dikkatini ve sosyal etkileşimini etkileyebilir.",
      summary:
        "Duyusal işleme, çocuğun çevreden aldığı uyarıları anlamlandırıp uygun tepki vermesiyle ilgilidir. Ses, dokunma ve hareket gibi uyaranlarda hassasiyet veya arayış davranışları görülebilir.",
      keyPoints: [
        "Günlük rutinde tutarlılık çocuğun regülasyonunu destekler.",
        "Oyun temelli aktiviteler duyusal sistemi güçlendirir.",
        "Aile, terapinin sürdürülebilirliğinde kritik rol oynar."
      ],
      tips: [
        "Evde sakin bir köşe oluşturun ve duyusal yüklenmeyi azaltın.",
        "Kısa, net ve olumlu yönergeler kullanın.",
        "Günlük rutine küçük hareket molaları ekleyin."
      ],
      sources: [
        { name: "CDC - Child Development", url: "https://www.cdc.gov/ncbddd/childdevelopment/index.html" },
        { name: "WHO - Early Child Development", url: "https://www.who.int" }
      ]
    },
    {
      slug: "otizm-erken-mudahale",
      title: "Otizmde Erken Müdahalenin Önemi",
      category: "Otizm",
      date: "2026-01-12",
      readTime: "7 dk okuma",
      image: "/images/blog/otizm-erken-mudahale.png",
      excerpt:
        "Erken müdahale, otizm spektrumundaki çocukların iletişim ve sosyal becerilerini geliştirmede güçlü bir etkendir.",
      summary:
        "Otizm spektrum bozukluğu, sosyal iletişim ve davranış örüntülerinde farklılıklarla seyreder. Erken değerlendirme, çocuğun güçlü ve desteklenmesi gereken yönlerini netleştirir.",
      keyPoints: [
        "Erken tarama ve değerlendirme kritik bir adımdır.",
        "Bireyselleştirilmiş hedefler motivasyonu artırır.",
        "Aile katılımı kalıcı öğrenmeyi destekler."
      ],
      tips: [
        "Günlük yaşam içinde kısa ve sık iletişim fırsatları yaratın.",
        "Göz teması ve ortak dikkat için oyun tabanlı etkinlikler kullanın.",
        "Terapi hedeflerini ev programıyla pekiştirin."
      ],
      sources: [
        { name: "WHO - Autism", url: "https://www.who.int" },
        { name: "CDC - Autism Spectrum Disorder", url: "https://www.cdc.gov/ncbddd/autism/" }
      ]
    },
    {
      slug: "adhd-yurutucu-islevler",
      title: "ADHD ve Yürütücü İşlevler",
      category: "ADHD",
      date: "2026-01-10",
      readTime: "6 dk okuma",
      image: "/images/blog/adhd-yurutucu-islevler.png",
      excerpt:
        "ADHD, dikkat ve özdenetim süreçlerini etkileyebilir. Yürütücü işlevleri güçlendiren stratejiler akademik ve sosyal uyumu destekler.",
      summary:
        "Yürütücü işlevler; planlama, odaklanma ve dürtü kontrolü gibi becerileri kapsar. ADHD'de bu alanlar zorlanabilir ve bu durum okul performansını etkileyebilir.",
      keyPoints: [
        "Günlük planlama ve zaman yönetimi becerileri geliştirilebilir.",
        "Ödül temelli motivasyon stratejileri etkilidir.",
        "Okul-aile iş birliği ilerlemeyi hızlandırır."
      ],
      tips: [
        "Günlük görevleri küçük parçalara bölün.",
        "Görsel takvim ve kontrol listeleri kullanın.",
        "Kısa süreli, hedef odaklı çalışma blokları planlayın."
      ],
      sources: [
        { name: "NIH - ADHD", url: "https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd" },
        { name: "CDC - ADHD", url: "https://www.cdc.gov/ncbddd/adhd/" }
      ]
    }
  ],
  newsletterTitle: "Yeni Makaleleri Kaçırmayın",
  newsletterDescription:
    "Haftalık bültenimize abone olun, en güncel içerikler e-postanıza gelsin.",
  newsletterPlaceholder: "E-posta adresiniz",
  newsletterButton: "Abone Ol",
  disclaimer:
    "* Tüm resimler yapay zeka ile oluşturulmuş, yapay resimlerdir. Gerçek insan ve çocuk resimleri olmayıp tamamen temsilidir."
};
