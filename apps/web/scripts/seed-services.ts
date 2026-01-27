import { PrismaClient, ServiceCategory } from '@prisma/client';

const prisma = new PrismaClient();

const services = [
  {
    slug: 'otizm-terapisi',
    title: 'Otizm Spektrum Bozukluğu Terapisi',
    shortTitle: 'Otizm Terapisi',
    subtitle: 'Bireysel ihtiyaçlara özel, bütüncül yaklaşım',
    description: 'Otizm spektrum bozukluğu olan çocuklar için gelişimsel ve davranışsal destek sağlayan kapsamlı terapi programı.',
    shortDesc: 'OSB olan çocuklar için bilimsel temelli, aile katılımlı terapi programı.',
    longDescription: 'Otizm spektrum bozukluğu tedavisinde, çocuğunuzun benzersiz ihtiyaçlarına göre özelleştirilmiş bir program uyguluyoruz. Duyusal bütünleme, sosyal beceriler, iletişim ve günlük yaşam becerileri üzerine odaklanarak ailelerle işbirliği içinde çalışıyoruz.',
    highlights: [
      'Bireysel değerlendirme ve özel program',
      'Duyusal bütünleme terapisi',
      'Sosyal beceri geliştirme',
      'Aile eğitimi ve danışmanlık',
      'Oyun temelli terapi yaklaşımı',
      'İlerleme takibi ve raporlama'
    ],
    benefits: [
      'Sosyal etkileşim ve iletişim becerilerinde gelişme',
      'Duyusal düzenleme kapasitesinin artması',
      'Günlük yaşam aktivitelerinde bağımsızlık',
      'Davranış problemlerinde azalma',
      'Aile ile çocuk arasında güçlü bağ',
      'Okul ortamına daha kolay uyum'
    ],
    process: [
      {
        title: 'İlk Değerlendirme',
        description: 'Çocuğunuzun mevcut durumu, güçlü yönleri ve ihtiyaçlarını kapsamlı bir şekilde değerlendiriyoruz.'
      },
      {
        title: 'Program Tasarımı',
        description: 'Değerlendirme sonuçlarına göre ailenizle birlikte kişiselleştirilmiş terapi hedefleri belirliyoruz.'
      },
      {
        title: 'Terapi Seansları',
        description: 'Haftada 2-3 seans, oyun temelli ve motivasyonu yüksek aktivitelerle terapiyi sürdürüyoruz.'
      },
      {
        title: 'Aile Katılımı',
        description: 'Evde uygulayabileceğiniz stratejiler ve aktiviteler konusunda aileleri eğitiyoruz.'
      },
      {
        title: 'İzleme ve Ayarlama',
        description: 'Düzenli değerlendirmelerle ilerlemeyi takip ediyor ve programı ihtiyaçlara göre güncelliyoruz.'
      }
    ],
    stats: [
      { value: '95%', label: 'Aile Memnuniyeti' },
      { value: '3-6 ay', label: 'İlk Gelişmeler' },
      { value: '200+', label: 'Başarılı Vaka' }
    ],
    reviewText: 'Oğlum 4 yaşında OSB tanısı aldı. Volkan Bey ile çalışmaya başladıktan 6 ay sonra göz teması kurabilmeye başladı ve basit isteklerini ifade edebiliyor. Çok sabırlı ve profesyonel bir yaklaşımı var.',
    reviewAuthor: 'Ayşe K.',
    reviewRelation: 'Anne',
    reviewLocation: 'İstanbul',
    icon: '🧩',
    image: '/images/services/otizm-terapisi.png',
    category: ServiceCategory.CHILD_THERAPY,
    duration: 60,
    price: 1500,
    isActive: true,
    order: 1
  },
  {
    slug: 'adhd-destegi',
    title: 'Dikkat Eksikliği ve Hiperaktivite Desteği (ADHD)',
    shortTitle: 'ADHD Desteği',
    subtitle: 'Odaklanma ve dürtü kontrolünü güçlendirme',
    description: 'ADHD tanısı olan çocuklar için dikkat, özdenetim ve organizasyon becerilerini geliştiren özel terapi programı.',
    shortDesc: 'Dikkat ve özdenetim becerilerini güçlendiren bilimsel yaklaşım.',
    longDescription: 'ADHD olan çocuklarda dikkat, dürtü kontrolü, organizasyon ve sosyal becerilerin geliştirilmesine odaklanıyoruz. Duyusal-motor aktiviteler, bilişsel stratejiler ve davranış yönetimi teknikleriyle çocuğunuzun potansiyelini ortaya çıkarıyoruz.',
    highlights: [
      'Dikkat ve konsantrasyon geliştirme',
      'Dürtü kontrolü stratejileri',
      'Özdenetim becerileri',
      'Organizasyon ve planlama',
      'Motor koordinasyon aktiviteleri',
      'Okul performansını destekleme'
    ],
    benefits: [
      'Daha uzun süre odaklanabilme',
      'Dürtüsel davranışlarda azalma',
      'Ödev ve görev tamamlamada başarı',
      'Sosyal ilişkilerde iyileşme',
      'Öz güven artışı',
      'Akademik performansta ilerleme'
    ],
    process: [
      {
        title: 'Dikkat Profili Belirleme',
        description: 'Çocuğun dikkat kapasitesi, duyusal eşik ve motor becerilerini değerlendiriyoruz.'
      },
      {
        title: 'Hedef Odaklı Terapi',
        description: 'Dikkat, planlama ve özdenetim becerilerini oyun ve aktivitelerle güçlendiriyoruz.'
      },
      {
        title: 'Stratejiler Öğretimi',
        description: 'Çocuğa günlük yaşamda kullanabileceği pratik stratejiler kazandırıyoruz.'
      },
      {
        title: 'Aile ve Öğretmen İşbirliği',
        description: 'Ev ve okul ortamında tutarlılık sağlamak için koordineli çalışıyoruz.'
      }
    ],
    stats: [
      { value: '85%', label: 'Dikkat Artışı' },
      { value: '2-4 ay', label: 'Gözle Görülür Sonuç' },
      { value: '150+', label: 'Desteklenen Çocuk' }
    ],
    reviewText: 'Kızımın ADHD nedeniyle okul hayatı çok zordu. Terapiye başladıktan sonra ödevlerini tamamlayabilmeye başladı ve sınıfta daha sakin. Hem biz hem de öğretmeni çok mutlu.',
    reviewAuthor: 'Mehmet Y.',
    reviewRelation: 'Baba',
    reviewLocation: 'Ankara',
    icon: '⚡',
    image: '/images/services/adhd-destegi.png',
    category: ServiceCategory.CHILD_THERAPY,
    duration: 45,
    price: 1200,
    isActive: true,
    order: 2
  },
  {
    slug: 'disleksi-terapisi',
    title: 'Disleksi ve Öğrenme Güçlüğü Desteği',
    shortTitle: 'Disleksi Terapisi',
    subtitle: 'Okuma-yazma becerilerinde özgüven',
    description: 'Disleksi ve öğrenme güçlüğü olan çocuklar için okuma, yazma ve akademik becerileri destekleyen özel program.',
    shortDesc: 'Okuma-yazma zorluklarını aşmak için bilimsel temelli destek.',
    longDescription: 'Disleksi tanısı alan çocuklar için fonolojik farkındalık, okuma akıcılığı ve yazma becerilerini geliştiren multisensorial yaklaşımlar kullanıyoruz. Çocuğunuzun özgüvenini yeniden inşa ederken akademik başarısını destekliyoruz.',
    highlights: [
      'Multisensorial öğrenme teknikleri',
      'Fonolojik farkındalık geliştirme',
      'Okuma hızı ve akıcılığı artırma',
      'Yazma becerilerini güçlendirme',
      'Hafıza stratejileri öğretimi',
      'Motivasyon ve özgüven desteği'
    ],
    benefits: [
      'Okuma ve yazma becerilerinde ilerleme',
      'Ders başarısında artış',
      'Özgüven ve motivasyon kazanımı',
      'Ödev yapmada kolaylık',
      'Sınav kaygısının azalması',
      'Okul sevgisinin artması'
    ],
    process: [
      {
        title: 'Öğrenme Profili Çıkarma',
        description: 'Okuma, yazma, fonolojik farkındalık ve görsel-işitsel becerileri test ediyoruz.'
      },
      {
        title: 'Bireysel Program Hazırlama',
        description: 'Çocuğun güçlü yönlerinden yararlanarak zayıf alanları güçlendiren program tasarlıyoruz.'
      },
      {
        title: 'Multisensorial Terapi',
        description: 'Görsel, işitsel ve kinestetik yöntemlerle okuma-yazma öğretiyoruz.'
      },
      {
        title: 'Ev Pratikleri',
        description: 'Ailelerle birlikte evde yapılacak aktiviteler ve okuma rutinleri oluşturuyoruz.'
      }
    ],
    stats: [
      { value: '90%', label: 'Okuma Hızında Artış' },
      { value: '4-6 ay', label: 'İlk İyileşmeler' },
      { value: '100+', label: 'Başarılı Öğrenci' }
    ],
    reviewText: 'Oğlum 2. sınıfta disleksi tanısı aldı ve okumaktan nefret ediyordu. Şimdi 4. sınıfta ve kitap okuyor! Volkan Hoca çok sabırlı ve destekleyici bir yaklaşım sergiledi.',
    reviewAuthor: 'Elif S.',
    reviewRelation: 'Anne',
    reviewLocation: 'İzmir',
    icon: '📖',
    image: '/images/services/disleksi-terapisi.png',
    category: ServiceCategory.CHILD_THERAPY,
    duration: 50,
    price: 1300,
    isActive: true,
    order: 3
  },
  {
    slug: 'duyusal-butunleme',
    title: 'Duyusal Bütünleme Terapisi',
    shortTitle: 'Duyusal Bütünleme',
    subtitle: 'Duyusal işleme sorunlarına kapsamlı çözüm',
    description: 'Duyusal işleme güçlükleri yaşayan çocuklar için bilimsel temelli, oyun odaklı terapi programı.',
    shortDesc: 'Duyusal hassasiyet ve düzenleme zorluklarına özel yaklaşım.',
    longDescription: 'Duyusal bütünleme terapisi, çocuğun çevresinden aldığı duyusal bilgileri etkili bir şekilde işlemesini ve uygun tepkiler vermesini destekler. Dokunma, hareket, ses ve diğer duyusal uyaranlara aşırı duyarlılık veya arayış davranışları gösteren çocuklara yardımcı oluyoruz.',
    highlights: [
      'Duyusal profil değerlendirmesi',
      'Dokunma hassasiyeti tedavisi',
      'Vestibüler sistem güçlendirme',
      'Proprioseptif input aktiviteleri',
      'Duyusal düzenleme stratejileri',
      'Günlük yaşam becerilerinde destek'
    ],
    benefits: [
      'Dokunma ve ses hassasiyetinde azalma',
      'Daha iyi öz düzenleme',
      'Motor koordinasyonda iyileşme',
      'Sosyal katılımda artış',
      'Yemek yeme sorunlarında ilerleme',
      'Uyku kalitesinde iyileşme'
    ],
    process: [
      {
        title: 'Duyusal Değerlendirme',
        description: 'Çocuğun duyusal eşiklerini ve tepkilerini kapsamlı bir şekilde değerlendiriyoruz.'
      },
      {
        title: 'Duyusal Diyet Hazırlama',
        description: 'Günlük rutine entegre edilebilecek duyusal aktiviteler planlıyoruz.'
      },
      {
        title: 'Terapi Seansları',
        description: 'Salıncak, tırmanma, dokunsal materyaller gibi duyusal zenginleştirilmiş ortamda terapi yapıyoruz.'
      },
      {
        title: 'Aile Eğitimi',
        description: 'Evde uygulayabileceğiniz duyusal stratejileri öğretiyoruz.'
      }
    ],
    stats: [
      { value: '88%', label: 'Duyusal Tolerans Artışı' },
      { value: '3-5 ay', label: 'İyileşme Süreci' },
      { value: '180+', label: 'Terapi Alan Çocuk' }
    ],
    reviewText: 'Kızım kıyafet etiketlerine, gürültülere çok hassastı ve sürekli rahatsızdı. Duyusal bütünleme terapisi hayatımızı değiştirdi. Artık çok daha rahat ve mutlu.',
    reviewAuthor: 'Zeynep T.',
    reviewRelation: 'Anne',
    reviewLocation: 'Bursa',
    icon: '🎨',
    image: '/images/services/duyusal-butunleme.png',
    category: ServiceCategory.CHILD_THERAPY,
    duration: 60,
    price: 1400,
    isActive: true,
    order: 4
  },
  {
    slug: 'yetiskin-rehabilitasyon',
    title: 'Yetişkin Nörolojik Rehabilitasyon',
    shortTitle: 'Yetişkin Rehabilitasyon',
    subtitle: 'İnme, yaralanma ve kronik hastalık sonrası iyileşme',
    description: 'İnme, kaza, ameliyat veya kronik hastalık sonrası yetişkinler için fonksiyonel bağımsızlığı geri kazandıran rehabilitasyon programı.',
    shortDesc: 'Nörolojik sorunlar sonrası hayat kalitenizi yükseltin.',
    longDescription: 'Yetişkin rehabilitasyon programımız, inme (felç), omurga yaralanması, Parkinson, MS gibi nörolojik durumlar veya ortopedik ameliyatlar sonrası fonksiyonel bağımsızlığınızı yeniden kazanmanıza yardımcı olur. Bilimsel temelli, bireyselleştirilmiş egzersiz ve terapi protokolleriyle iyileşme sürecinizi destekliyoruz.',
    highlights: [
      'Nörolojik değerlendirme ve izleme',
      'Mobilite ve denge eğitimi',
      'Güçlendirme egzersizleri',
      'Ağrı yönetimi',
      'Günlük yaşam aktiviteleri eğitimi',
      'Düşme önleme stratejileri'
    ],
    benefits: [
      'Mobilite ve bağımsızlıkta artış',
      'Ağrı ve spazmda azalma',
      'Denge ve koordinasyonda iyileşme',
      'Günlük aktivitelerde kolaylık',
      'Yaşam kalitesinde yükselme',
      'Özgüven ve moral artışı'
    ],
    process: [
      {
        title: 'Kapsamlı Değerlendirme',
        description: 'Mevcut durumunuz, fiziksel kapasiteleriniz ve hedeflerinizi belirliyoruz.'
      },
      {
        title: 'Kişisel Program',
        description: 'İhtiyaçlarınıza özel, bilimsel temelli egzersiz ve terapi programı tasarlıyoruz.'
      },
      {
        title: 'Düzenli Seanslar',
        description: 'Haftada 2-3 seans, kademeli olarak zorluk seviyesini artırarak ilerliyoruz.'
      },
      {
        title: 'Ev Programı',
        description: 'Evde yapabileceğiniz güvenli egzersizler öğretiyoruz.'
      },
      {
        title: 'İzleme ve Revizyon',
        description: 'Düzenli olarak ilerlemenizi değerlendiriyor ve programı güncelliyoruz.'
      }
    ],
    stats: [
      { value: '92%', label: 'İyileşme Oranı' },
      { value: '6-12 hafta', label: 'Fonksiyonel Gelişme' },
      { value: '30 yıl', label: 'Deneyim' }
    ],
    reviewText: 'İnme geçirdikten sonra yürümekte zorlanıyordum. Volkan Bey\'in rehabilitasyon programıyla 3 ayda bastonla yürümeye başladım. Şimdi desteksiz yürüyebiliyorum.',
    reviewAuthor: 'Ahmet D.',
    reviewRelation: 'Hasta',
    reviewLocation: 'İstanbul',
    icon: '💪',
    image: '/images/hero-bg.png',
    category: ServiceCategory.ADULT_REHAB,
    duration: 60,
    price: 1600,
    isActive: true,
    order: 5
  }
];

async function main() {
  console.log('🌱 Seeding services...\n');

  for (const service of services) {
    try {
      const created = await prisma.service.create({
        data: service
      });
      console.log(`✅ Created: ${created.title} (${created.slug})`);
    } catch (error) {
      console.error(`❌ Error creating ${service.title}:`, error);
    }
  }

  console.log('\n✨ Seeding completed!\n');

  // Verify
  const count = await prisma.service.count();
  console.log(`📊 Total services in database: ${count}`);
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
