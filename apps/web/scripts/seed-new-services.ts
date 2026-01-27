import { PrismaClient, ServiceCategory } from '@prisma/client';

const prisma = new PrismaClient();

const newServices = [
  // ==================== YETİŞKİN HİZMETLERİ ====================
  {
    slug: 'ortopedik-rehabilitasyon',
    title: 'Ortopedik Rehabilitasyon',
    shortTitle: 'Ortopedik Rehab',
    subtitle: 'Kırık, ameliyat ve yaralanma sonrası iyileşme',
    description: 'Kırık, ortopedik ameliyat veya kas-iskelet sistemi yaralanmaları sonrası tam fonksiyonel iyileşmeyi hedefleyen kapsamlı rehabilitasyon programı.',
    shortDesc: 'Ameliyat ve yaralanma sonrası güvenli ve etkili iyileşme programı.',
    longDescription: 'Ortopedik rehabilitasyon programımız, diz protezi, kalça protezi, omuz ameliyatı, kırık tedavisi veya spor yaralanmaları sonrası hareket kabiliyetinizi ve gücünüzü geri kazanmanızı sağlar. Bireysel ihtiyaçlarınıza göre tasarlanan egzersiz programları ve manuel terapi teknikleriyle ağrısız ve fonksiyonel bir yaşama dönmenizi destekliyoruz.',
    highlights: [
      'Ameliyat sonrası erken mobilizasyon',
      'Eklem hareket açıklığı çalışmaları',
      'Kas güçlendirme egzersizleri',
      'Manuel terapi ve yumuşak doku teknikleri',
      'Proprioseptif eğitim',
      'Günlük aktivitelere dönüş programı'
    ],
    benefits: [
      'Ağrı ve şişlikte hızlı azalma',
      'Eklem hareketlerinde tam iyileşme',
      'Kas gücünün yeniden kazanılması',
      'Yürüme ve merdiven inme-çıkmada rahatlık',
      'Günlük aktivitelere güvenli dönüş',
      'Tekrar yaralanma riskinin azalması'
    ],
    process: [
      {
        title: 'Ameliyat Sonrası Değerlendirme',
        description: 'Cerrahınızın önerileri doğrultusunda mevcut durumunuzu ve kısıtlamalarınızı değerlendiriyoruz.'
      },
      {
        title: 'Kademeli Mobilizasyon',
        description: 'İlk haftalarda şişlik kontrolü, ağrı yönetimi ve nazik hareket açıklığı çalışmaları yapıyoruz.'
      },
      {
        title: 'Güçlendirme Fazı',
        description: 'Kas gücünü artırmak için direnç egzersizleri ve fonksiyonel hareketler ekliyoruz.'
      },
      {
        title: 'Fonksiyonel Eğitim',
        description: 'Yürüme, merdiven, oturma-kalkma gibi günlük aktiviteleri güvenle yapabilmenizi sağlıyoruz.'
      },
      {
        title: 'Spora/İşe Dönüş',
        description: 'Hedeflerinize göre tam fonksiyonel kapasiteye ulaşmanız için son aşama programı uyguluyoruz.'
      }
    ],
    stats: [
      { value: '96%', label: 'Tam İyileşme Oranı' },
      { value: '8-12 hafta', label: 'Ortalama Süre' },
      { value: '500+', label: 'Başarılı Vaka' }
    ],
    reviewText: 'Diz protezi ameliyatından sonra yürüyemeyeceğimi düşünüyordum. Volkan Bey ile 10 haftalık rehabilitasyon sonrası artık ağrısız yürüyebiliyorum ve hatta hafif spor yapabiliyorum.',
    reviewAuthor: 'Fatma H.',
    reviewRelation: 'Hasta',
    reviewLocation: 'İstanbul',
    icon: '🦴',
    image: '/images/services/ortopedik-rehabilitasyon.png',
    category: ServiceCategory.ADULT_REHAB,
    duration: 60,
    price: 1400,
    isActive: true,
    order: 6
  },
  {
    slug: 'geriatrik-fizyoterapi',
    title: 'Geriatrik Fizyoterapi',
    shortTitle: 'Yaşlı Fizyoterapisi',
    subtitle: 'Yaşlılıkta aktif ve bağımsız yaşam',
    description: '65 yaş üstü bireyler için denge, güç, esneklik ve günlük yaşam becerilerini geliştiren özel fizyoterapi programı.',
    shortDesc: 'Yaşlılıkta mobilite, denge ve yaşam kalitesini artıran program.',
    longDescription: 'Geriatrik fizyoterapi programımız, yaşlanmayla birlikte ortaya çıkan kas kaybı (sarkopeni), denge bozuklukları, eklem sertlikleri ve düşme riskini azaltmaya odaklanır. Yaşlı bireylerin günlük aktivitelerini bağımsız olarak sürdürebilmeleri ve yaşam kalitelerini yükseltmeleri için güvenli, etkili ve keyifli egzersiz programları sunuyoruz.',
    highlights: [
      'Denge ve düşme önleme eğitimi',
      'Kas güçlendirme (sarkopeni önleme)',
      'Eklem esnekliği çalışmaları',
      'Yürüme ve mobilite eğitimi',
      'Günlük yaşam aktiviteleri desteği',
      'Ev güvenliği danışmanlığı'
    ],
    benefits: [
      'Düşme riskinde önemli azalma',
      'Kas gücü ve dayanıklılıkta artış',
      'Daha rahat ve güvenli yürüme',
      'Eklem ağrılarında hafiflik',
      'Günlük işlerde bağımsızlık',
      'Özgüven ve yaşam kalitesinde artış'
    ],
    process: [
      {
        title: 'Kapsamlı Geriatrik Değerlendirme',
        description: 'Denge, yürüme, kas gücü ve günlük aktivite kapasitesini değerlendiriyoruz.'
      },
      {
        title: 'Düşme Riski Analizi',
        description: 'Ev ortamı ve kişisel risk faktörlerini inceleyerek önleyici stratejiler belirliyoruz.'
      },
      {
        title: 'Bireysel Egzersiz Programı',
        description: 'Güvenli ve yapılabilir egzersizlerle kas gücü ve dengeyi artırıyoruz.'
      },
      {
        title: 'Fonksiyonel Pratikler',
        description: 'Sandalyeden kalkma, merdiven, banyo kullanımı gibi günlük aktiviteleri çalışıyoruz.'
      },
      {
        title: 'Ev Programı ve Takip',
        description: 'Evde güvenle yapabileceğiniz egzersizler öğretiyor ve düzenli takip ediyoruz.'
      }
    ],
    stats: [
      { value: '70%', label: 'Düşme Riskinde Azalma' },
      { value: '4-8 hafta', label: 'İlk Sonuçlar' },
      { value: '200+', label: 'Desteklenen Yaşlı' }
    ],
    reviewText: 'Annem 78 yaşında ve birkaç kez düşmüştü. Volkan Bey ile çalışmaya başladıktan sonra dengesi çok düzeldi ve artık evde daha güvenli hareket ediyor. Biz de çok rahatladık.',
    reviewAuthor: 'Selin K.',
    reviewRelation: 'Kızı',
    reviewLocation: 'İstanbul',
    icon: '🧓',
    image: '/images/services/geriatrik-fizyoterapi.png',
    category: ServiceCategory.ADULT_REHAB,
    duration: 50,
    price: 1200,
    isActive: true,
    order: 7
  },
  {
    slug: 'bel-boyun-fitigi',
    title: 'Bel ve Boyun Fıtığı Tedavisi',
    shortTitle: 'Fıtık Tedavisi',
    subtitle: 'Ameliyatsız ağrı yönetimi ve iyileşme',
    description: 'Bel fıtığı ve boyun fıtığı için ameliyatsız tedavi yaklaşımları, ağrı yönetimi ve fonksiyonel iyileşme programı.',
    shortDesc: 'Disk hernisi için ameliyatsız, etkili fizyoterapi yaklaşımı.',
    longDescription: 'Bel ve boyun fıtığı (disk hernisi) tedavisinde, ameliyat gerektirmeyen vakalarda fizyoterapi birinci basamak tedavi olarak önerilmektedir. Manuel terapi, terapötik egzersizler, postür eğitimi ve ağrı yönetimi teknikleriyle fıtık semptomlarını azaltıyor, omurga sağlığınızı koruyacak stratejiler öğretiyoruz.',
    highlights: [
      'Manuel terapi ve mobilizasyon',
      'McKenzie yöntemi',
      'Core stabilizasyon egzersizleri',
      'Postür düzeltme eğitimi',
      'Sinir mobilizasyonu',
      'Ergonomi danışmanlığı'
    ],
    benefits: [
      'Ağrı ve uyuşmada belirgin azalma',
      'Hareket kabiliyetinde artış',
      'Günlük aktivitelere dönüş',
      'Tekrarlayan atakların önlenmesi',
      'Ameliyat ihtiyacının azalması',
      'Doğru duruş ve hareket alışkanlıkları'
    ],
    process: [
      {
        title: 'Detaylı Değerlendirme',
        description: 'MR bulgularınız ve fiziksel muayene ile fıtığın tipini ve şiddetini belirliyoruz.'
      },
      {
        title: 'Akut Dönem Yönetimi',
        description: 'Ağrı ve iltihabı azaltmak için manuel teknikler ve pozisyonlama stratejileri uyguluyoruz.'
      },
      {
        title: 'Mobilizasyon ve Egzersiz',
        description: 'Omurga hareketliliğini artıran ve disk basıncını azaltan egzersizler öğretiyoruz.'
      },
      {
        title: 'Core Güçlendirme',
        description: 'Omurgayı destekleyen derin kasları güçlendirerek uzun vadeli koruma sağlıyoruz.'
      },
      {
        title: 'Yaşam Tarzı Eğitimi',
        description: 'İş yerinde ve evde omurganızı koruyacak duruş ve hareket alışkanlıkları kazandırıyoruz.'
      }
    ],
    stats: [
      { value: '85%', label: 'Ameliyatsız İyileşme' },
      { value: '6-12 hafta', label: 'Tedavi Süresi' },
      { value: '400+', label: 'Tedavi Edilen Hasta' }
    ],
    reviewText: 'Bel fıtığı nedeniyle ameliyat önerilmişti ama önce fizyoterapi denemek istedim. Volkan Bey ile 3 aylık tedavi sonrası ağrım geçti ve ameliyata gerek kalmadı. 2 yıl oldu hiç nüksetmedi.',
    reviewAuthor: 'Murat Ö.',
    reviewRelation: 'Hasta',
    reviewLocation: 'Ankara',
    icon: '🔙',
    image: '/images/services/bel-boyun-fitigi.png',
    category: ServiceCategory.ADULT_REHAB,
    duration: 45,
    price: 1300,
    isActive: true,
    order: 8
  },

  // ==================== ÇOCUK HİZMETLERİ ====================
  {
    slug: 'serebral-palsi',
    title: 'Serebral Palsi Rehabilitasyonu',
    shortTitle: 'Serebral Palsi',
    subtitle: 'Hareket ve fonksiyonel bağımsızlık desteği',
    description: 'Serebral palsi (CP) tanılı çocuklar için motor gelişim, hareket kalitesi ve fonksiyonel bağımsızlığı destekleyen kapsamlı rehabilitasyon programı.',
    shortDesc: 'CP tanılı çocuklar için bireyselleştirilmiş motor rehabilitasyon.',
    longDescription: 'Serebral palsi rehabilitasyonunda, çocuğunuzun motor gelişimini desteklemek, kas tonusunu düzenlemek, hareket kalitesini artırmak ve günlük yaşam becerilerinde bağımsızlık kazandırmak için çalışıyoruz. Nöroplastisite prensiplerinden yararlanarak, tekrarlı ve anlamlı aktivitelerle beynin yeniden organize olmasını destekliyoruz.',
    highlights: [
      'Nörogelişimsel terapi (NDT/Bobath)',
      'Motor öğrenme stratejileri',
      'Spastisite yönetimi',
      'Fonksiyonel mobilite eğitimi',
      'Ortez ve yardımcı cihaz danışmanlığı',
      'Aile eğitimi ve ev programı'
    ],
    benefits: [
      'Hareket kalitesinde iyileşme',
      'Oturma, ayakta durma ve yürümede gelişme',
      'Kas gerginliğinde azalma',
      'El fonksiyonlarında ilerleme',
      'Günlük aktivitelerde daha fazla bağımsızlık',
      'Kontraktür ve deformite önleme'
    ],
    process: [
      {
        title: 'Kapsamlı Motor Değerlendirme',
        description: 'GMFCS seviyesi, kas tonusu, hareket kalitesi ve fonksiyonel becerileri değerlendiriyoruz.'
      },
      {
        title: 'Hedef Belirleme',
        description: 'Aile ile birlikte gerçekçi ve anlamlı kısa-uzun vadeli hedefler belirliyoruz.'
      },
      {
        title: 'Yoğun Terapi Programı',
        description: 'Haftada 2-3 seans, oyun temelli ve fonksiyonel aktivitelerle motor becerileri çalışıyoruz.'
      },
      {
        title: 'Ev Programı Entegrasyonu',
        description: 'Günlük rutine entegre edilebilecek pozisyonlama ve aktiviteler öğretiyoruz.'
      },
      {
        title: 'Düzenli Değerlendirme',
        description: 'Her 3 ayda bir ilerlemeyi değerlendiriyor ve programı güncelliyoruz.'
      }
    ],
    stats: [
      { value: '90%', label: 'Fonksiyonel Gelişim' },
      { value: 'Sürekli', label: 'Destek Programı' },
      { value: '150+', label: 'Tedavi Edilen Çocuk' }
    ],
    reviewText: 'Oğlum 3 yaşında CP tanısı aldı ve oturamıyordu bile. 2 yıllık düzenli terapiyle şimdi destekli yürüyebiliyor. Volkan Bey çok sabırlı ve umut veriyor.',
    reviewAuthor: 'Derya A.',
    reviewRelation: 'Anne',
    reviewLocation: 'İstanbul',
    icon: '🧠',
    image: '/images/services/serebral-palsi.png',
    category: ServiceCategory.CHILD_THERAPY,
    duration: 60,
    price: 1500,
    isActive: true,
    order: 5
  },
  {
    slug: 'motor-gelisim-gecikmesi',
    title: 'Gecikmiş Motor Gelişim Terapisi',
    shortTitle: 'Motor Gelişim',
    subtitle: 'Hareket kilometre taşlarını yakalama desteği',
    description: 'Motor gelişim basamaklarında gecikme yaşayan bebekler ve çocuklar için erken müdahale ve gelişim destek programı.',
    shortDesc: 'Geç oturma, emekleme veya yürüme için erken müdahale programı.',
    longDescription: 'Motor gelişim gecikmesi yaşayan çocuklar için erken müdahale çok önemlidir. Dönme, oturma, emekleme, ayağa kalkma ve yürüme gibi motor becerilerde yaşıtlarından geri kalan çocuklara, gelişimsel fizyoterapi yaklaşımlarıyla destek oluyoruz. Ne kadar erken başlanırsa sonuçlar o kadar iyi olmaktadır.',
    highlights: [
      'Gelişimsel değerlendirme',
      'Tummy time ve pozisyonlama',
      'Denge ve koordinasyon çalışmaları',
      'Kas gücü geliştirme aktiviteleri',
      'Motor planlama egzersizleri',
      'Oyun temelli terapi yaklaşımı'
    ],
    benefits: [
      'Motor becerilerde hızlı ilerleme',
      'Yaşıtlarına yetişme imkanı',
      'Kas gücü ve koordinasyonda artış',
      'Özgüven gelişimi',
      'Daha iyi oyun ve keşif becerileri',
      'İleriki dönem sorunlarının önlenmesi'
    ],
    process: [
      {
        title: 'Gelişimsel Tarama',
        description: 'Denver, AIMS gibi standart testlerle motor gelişim düzeyini belirliyoruz.'
      },
      {
        title: 'Erken Müdahale Başlangıcı',
        description: 'Gecikme nedenine göre uygun terapi yaklaşımını belirliyoruz.'
      },
      {
        title: 'Haftalık Terapi Seansları',
        description: 'Oyun temelli, eğlenceli aktivitelerle motor becerileri çalışıyoruz.'
      },
      {
        title: 'Aile Katılımlı Ev Programı',
        description: 'Evde günlük yapılacak aktiviteler ve pozisyonlar konusunda aileyi eğitiyoruz.'
      },
      {
        title: 'Aylık İlerleme Takibi',
        description: 'Her ay gelişimi değerlendiriyor ve hedefleri güncelliyoruz.'
      }
    ],
    stats: [
      { value: '95%', label: 'Başarılı Sonuç' },
      { value: '3-6 ay', label: 'Ortalama Süre' },
      { value: '250+', label: 'Desteklenen Bebek' }
    ],
    reviewText: 'Kızım 10 aylık olduğunda hala oturamıyordu. Doktorumuz erken müdahale önerdi. Volkan Bey ile 4 ay çalıştık ve şimdi 14 aylık, kendi başına yürüyor! Çok mutluyuz.',
    reviewAuthor: 'Burcu M.',
    reviewRelation: 'Anne',
    reviewLocation: 'İzmir',
    icon: '👶',
    image: '/images/services/motor-gelisim.png',
    category: ServiceCategory.CHILD_THERAPY,
    duration: 45,
    price: 1200,
    isActive: true,
    order: 6
  }
];

async function main() {
  console.log('🌱 Adding new services...\n');

  for (const service of newServices) {
    try {
      // Check if service already exists
      const existing = await prisma.service.findUnique({
        where: { slug: service.slug }
      });

      if (existing) {
        console.log(`⏭️  Skipped (already exists): ${service.title}`);
        continue;
      }

      const created = await prisma.service.create({
        data: service
      });
      console.log(`✅ Created: ${created.title} (${created.slug})`);
    } catch (error) {
      console.error(`❌ Error creating ${service.title}:`, error);
    }
  }

  console.log('\n✨ New services added!\n');

  // Show summary
  const childCount = await prisma.service.count({ where: { category: 'CHILD_THERAPY' } });
  const adultCount = await prisma.service.count({ where: { category: 'ADULT_REHAB' } });
  const total = await prisma.service.count();

  console.log('📊 Service Summary:');
  console.log(`   Çocuk Terapisi: ${childCount}`);
  console.log(`   Yetişkin Rehabilitasyon: ${adultCount}`);
  console.log(`   Toplam: ${total}`);
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
