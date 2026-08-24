const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Sarthi database seeding...');

  // 1. Clean existing records in safe order
  await prisma.jobTimeline.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.savedWorker.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.adminAction.deleteMany({});
  await prisma.serviceRequest.deleteMany({});
  await prisma.workerService.deleteMany({});
  await prisma.workerProfile.deleteMany({});
  await prisma.customerProfile.deleteMany({});
  await prisma.serviceCategory.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPasswordHash = await bcrypt.hash('Password@123', 10);

  // 2. Seed Service Categories
  const categoriesData = [
    {
      name: 'Plumbing',
      slug: 'plumber',
      description: 'Pipe repairs, tap fitting, leakages, bathroom & sanitary fixtures',
      iconName: 'Wrench',
      colorScheme: 'teal',
      startingPrice: 199,
      activeWorkersCount: 4,
    },
    {
      name: 'Electrician',
      slug: 'electrician',
      description: 'Switchboard wiring, fan repair, MCB tripping, inverter & lighting',
      iconName: 'Zap',
      colorScheme: 'blue',
      startingPrice: 249,
      activeWorkersCount: 3,
    },
    {
      name: 'Mason / Mistri',
      slug: 'mason',
      description: 'Tile work, plastering, wall repair, brick masonry & civil work',
      iconName: 'Hammer',
      colorScheme: 'brick',
      startingPrice: 399,
      activeWorkersCount: 2,
    },
    {
      name: 'Carpenter',
      slug: 'carpenter',
      description: 'Furniture repair, door hinges, modular fittings & lock installation',
      iconName: 'Layers',
      colorScheme: 'purple',
      startingPrice: 299,
      activeWorkersCount: 2,
    },
    {
      name: 'Painter',
      slug: 'painter',
      description: 'Interior & exterior painting, putty, texture & seepage waterproofing',
      iconName: 'Paintbrush',
      colorScheme: 'rose',
      startingPrice: 499,
      activeWorkersCount: 2,
    },
    {
      name: 'AC & Cooling Repair',
      slug: 'ac-repair',
      description: 'Split & window AC servicing, gas refilling, cooling issues & installation',
      iconName: 'AirVent',
      colorScheme: 'teal',
      startingPrice: 399,
      activeWorkersCount: 3,
    },
    {
      name: 'Appliance Repair',
      slug: 'appliance-repair',
      description: 'Washing machine, refrigerator, microwave & kitchen appliance repair',
      iconName: 'Tv',
      colorScheme: 'blue',
      startingPrice: 299,
      activeWorkersCount: 2,
    },
    {
      name: 'Deep Cleaning',
      slug: 'cleaner',
      description: 'Full home deep sanitization, kitchen & bathroom cleaning',
      iconName: 'Sparkles',
      colorScheme: 'green',
      startingPrice: 499,
      activeWorkersCount: 2,
    },
    {
      name: 'RO Water Purifier',
      slug: 'ro-technician',
      description: 'Filter replacement, membrane service, TDS adjustment & UV repair',
      iconName: 'Droplets',
      colorScheme: 'teal',
      startingPrice: 249,
      activeWorkersCount: 2,
    },
    {
      name: 'CCTV & Security',
      slug: 'cctv-technician',
      description: 'Camera installation, DVR setup, Wi-Fi camera & smart lock security',
      iconName: 'ShieldCheck',
      colorScheme: 'slate',
      startingPrice: 350,
      activeWorkersCount: 2,
    },
    {
      name: 'Auto / Bike Mechanic',
      slug: 'mechanic',
      description: 'Doorstep 2-wheeler & 4-wheeler servicing, battery & puncture help',
      iconName: 'Compass',
      colorScheme: 'amber',
      startingPrice: 199,
      activeWorkersCount: 3,
    },
    {
      name: 'Welder & Fabrication',
      slug: 'welder',
      description: 'Iron gates, grill repair, sheet metal welding & window shades',
      iconName: 'Shield',
      colorScheme: 'slate',
      startingPrice: 300,
      activeWorkersCount: 1,
    },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const created = await prisma.serviceCategory.create({ data: cat });
    categoryMap[cat.slug] = created;
  }

  // 3. Seed Demo Admin
  const adminUser = await prisma.user.create({
    data: {
      name: 'Sarthi Admin Staff',
      email: 'demo.admin@sarthi.local',
      phone: '+91 98765 00001',
      passwordHash: defaultPasswordHash,
      role: 'ADMIN',
      city: 'Prayagraj',
      locality: 'Civil Lines',
    },
  });

  // 4. Seed Demo Customer (Priya Singh)
  const customerUser = await prisma.user.create({
    data: {
      name: 'Priya Singh',
      email: 'demo.customer@sarthi.local',
      phone: '+91 98765 11111',
      passwordHash: defaultPasswordHash,
      role: 'CUSTOMER',
      city: 'Prayagraj',
      locality: 'Civil Lines',
      customerProfile: {
        create: {
          defaultAddress: 'Flat 402, Ganga Heights, MG Marg, Civil Lines, Prayagraj',
          preferredLanguage: 'Hindi / English',
        },
      },
    },
  });

  // 5. Seed Demo Worker (Rahul Kumar - Electrician)
  const demoWorkerUser = await prisma.user.create({
    data: {
      name: 'Rahul Kumar',
      email: 'demo.worker@sarthi.local',
      phone: '+91 98765 22222',
      passwordHash: defaultPasswordHash,
      role: 'WORKER',
      city: 'Prayagraj',
      locality: 'Civil Lines',
      workerProfile: {
        create: {
          primaryCategoryId: categoryMap['electrician'].id,
          bio: 'Certified master electrician with 8+ years experience in domestic and commercial electrical repairs, smart switchboards, and fan winding.',
          experienceYears: 8,
          startingPrice: 250,
          serviceRadiusKm: 12.0,
          rating: 4.9,
          reviewCount: 48,
          completedJobs: 128,
          responseRate: 99,
          isAvailable: true,
          isVerified: true,
          identityVerified: true,
          professionVerified: true,
          workingHours: '7:30 AM - 9:30 PM',
          emergency24x7: true,
          latitude: 25.4358,
          longitude: 81.8463,
          services: {
            create: [
              {
                serviceCategoryId: categoryMap['electrician'].id,
                customTitle: 'Ceiling Fan & Exhaust Fan Repair',
                price: 250,
                description: 'Complete inspection, capacitor replacement, wiring fix & hanging',
              },
              {
                serviceCategoryId: categoryMap['electrician'].id,
                customTitle: 'Switchboard & Socket Installation',
                price: 199,
                description: 'Modular switch replacement, MCB tripping resolution',
              },
              {
                serviceCategoryId: categoryMap['electrician'].id,
                customTitle: 'Inverter & Battery Wiring',
                price: 450,
                description: 'Dual line wiring, heavy inverter setup & earthing test',
              },
            ],
          },
        },
      },
    },
    include: { workerProfile: true },
  });

  // Additional 12+ Indian Workers across categories
  const otherWorkersData = [
    {
      name: 'Suresh Kumar',
      email: 'suresh.plumber@sarthi.local',
      phone: '+91 98765 22201',
      category: 'plumber',
      locality: 'Katra, Prayagraj',
      bio: 'Expert plumber for leakages, motor pumps, and sanitary bathroom fittings.',
      exp: 6,
      price: 200,
      rating: 4.8,
      jobs: 94,
      reviews: 32,
      avail: true,
      verified: true,
      emergency: true,
      lat: 25.4421,
      lng: 81.8541,
    },
    {
      name: 'Vinod Mistri',
      email: 'vinod.plumber@sarthi.local',
      phone: '+91 98765 22202',
      category: 'plumber',
      locality: 'Naini, Prayagraj',
      bio: 'Reliable plumbing expert with fast doorstep resolution for drain clogs & taps.',
      exp: 5,
      price: 180,
      rating: 4.7,
      jobs: 65,
      reviews: 21,
      avail: true,
      verified: true,
      emergency: false,
      lat: 25.3892,
      lng: 81.8624,
    },
    {
      name: 'Anil Sharma',
      email: 'anil.electrician@sarthi.local',
      phone: '+91 98765 22203',
      category: 'electrician',
      locality: 'George Town, Prayagraj',
      bio: 'Fast and safe electrical repairs, wiring maintenance & lighting setups.',
      exp: 7,
      price: 220,
      rating: 4.8,
      jobs: 87,
      reviews: 29,
      avail: true,
      verified: true,
      emergency: false,
      lat: 25.4485,
      lng: 81.8612,
    },
    {
      name: 'Ramesh Verma',
      email: 'ramesh.mason@sarthi.local',
      phone: '+91 98765 22204',
      category: 'mason',
      locality: 'Ashok Nagar, Prayagraj',
      bio: 'Civil construction, tiles, marble cutting, plaster and boundary repair expert.',
      exp: 11,
      price: 450,
      rating: 4.9,
      jobs: 142,
      reviews: 51,
      avail: true,
      verified: true,
      emergency: false,
      lat: 25.4512,
      lng: 81.8389,
    },
    {
      name: 'Mohd. Arif',
      email: 'arif.carpenter@sarthi.local',
      phone: '+91 98765 22205',
      category: 'carpenter',
      locality: 'Chowk, Prayagraj',
      bio: 'Master carpenter specializing in modular kitchen fitting, beds, and lock repair.',
      exp: 9,
      price: 300,
      rating: 4.8,
      jobs: 110,
      reviews: 38,
      avail: true,
      verified: true,
      emergency: false,
      lat: 25.4312,
      lng: 81.8321,
    },
    {
      name: 'Sunil Pal',
      email: 'sunil.painter@sarthi.local',
      phone: '+91 98765 22206',
      category: 'painter',
      locality: 'Tagore Town, Prayagraj',
      bio: 'Professional wall painter with Royal touch finishing, texture and waterproofing.',
      exp: 6,
      price: 450,
      rating: 4.7,
      jobs: 58,
      reviews: 19,
      avail: true,
      verified: true,
      emergency: false,
      lat: 25.4578,
      lng: 81.8592,
    },
    {
      name: 'Deepak Maurya',
      email: 'deepak.ac@sarthi.local',
      phone: '+91 98765 22207',
      category: 'ac-repair',
      locality: 'Civil Lines, Prayagraj',
      bio: 'HVAC technician for Daikin, Voltas, LG, Samsung AC gas refill & jet cleaning.',
      exp: 10,
      price: 399,
      rating: 4.9,
      jobs: 210,
      reviews: 84,
      avail: true,
      verified: true,
      emergency: true,
      lat: 25.4389,
      lng: 81.8491,
    },
    {
      name: 'Rajesh Tiwari',
      email: 'rajesh.appliance@sarthi.local',
      phone: '+91 98765 22208',
      category: 'appliance-repair',
      locality: 'Allahpur, Prayagraj',
      bio: 'Refrigerator and front/top load washing machine circuit and motor specialist.',
      exp: 8,
      price: 299,
      rating: 4.8,
      jobs: 76,
      reviews: 26,
      avail: true,
      verified: true,
      emergency: false,
      lat: 25.4498,
      lng: 81.8741,
    },
    {
      name: 'Vikas Gupta',
      email: 'vikas.ro@sarthi.local',
      phone: '+91 98765 22209',
      category: 'ro-technician',
      locality: 'Mumfordganj, Prayagraj',
      bio: 'Certified Kent & Aquaguard water purifier repair and genuine filter replacement.',
      exp: 5,
      price: 249,
      rating: 4.9,
      jobs: 89,
      reviews: 31,
      avail: true,
      verified: true,
      emergency: false,
      lat: 25.4641,
      lng: 81.8472,
    },
    {
      name: 'Amit Srivastava',
      email: 'amit.cctv@sarthi.local',
      phone: '+91 98765 22210',
      category: 'cctv-technician',
      locality: 'Lukerganj, Prayagraj',
      bio: 'Hikvision & CP Plus CCTV camera setup, cloud recording & mobile monitoring.',
      exp: 7,
      price: 350,
      rating: 4.8,
      jobs: 64,
      reviews: 23,
      avail: true,
      verified: true,
      emergency: false,
      lat: 25.4329,
      lng: 81.8219,
    },
    {
      name: 'Manoj Yadav',
      email: 'manoj.mechanic@sarthi.local',
      phone: '+91 98765 22211',
      category: 'mechanic',
      locality: 'Kareli, Prayagraj',
      bio: 'Doorstep 2-wheeler breakdown help, oil change, brake tuneup and jump start.',
      exp: 9,
      price: 199,
      rating: 4.7,
      jobs: 102,
      reviews: 36,
      avail: true,
      verified: true,
      emergency: true,
      lat: 25.4215,
      lng: 81.8285,
    },
    {
      name: 'Pooja Devi',
      email: 'pooja.cleaner@sarthi.local',
      phone: '+91 98765 22212',
      category: 'cleaner',
      locality: 'Civil Lines, Prayagraj',
      bio: 'Deep house cleaning, kitchen scrubbing, bathroom stain removal with eco chemicals.',
      exp: 6,
      price: 499,
      rating: 4.9,
      jobs: 115,
      reviews: 44,
      avail: true,
      verified: true,
      emergency: false,
      lat: 25.4411,
      lng: 81.8415,
    },
  ];

  for (const w of otherWorkersData) {
    const user = await prisma.user.create({
      data: {
        name: w.name,
        email: w.email,
        phone: w.phone,
        passwordHash: defaultPasswordHash,
        role: 'WORKER',
        city: 'Prayagraj',
        locality: w.locality.split(',')[0].trim(),
        workerProfile: {
          create: {
            primaryCategoryId: categoryMap[w.category].id,
            bio: w.bio,
            experienceYears: w.exp,
            startingPrice: w.price,
            rating: w.rating,
            completedJobs: w.jobs,
            reviewCount: w.reviews,
            responseRate: 96,
            isAvailable: w.avail,
            isVerified: w.verified,
            identityVerified: true,
            professionVerified: true,
            workingHours: '8:00 AM - 8:00 PM',
            emergency24x7: w.emergency,
            latitude: w.lat,
            longitude: w.lng,
            services: {
              create: [
                {
                  serviceCategoryId: categoryMap[w.category].id,
                  customTitle: `${categoryMap[w.category].name} Standard Inspection & Fix`,
                  price: w.price,
                  description: 'Standard doorstep diagnostic and quick fixes',
                },
              ],
            },
          },
        },
      },
      include: { workerProfile: true },
    });
  }

  // 6. Create a past completed request + review for Rahul Kumar from Priya Singh
  const completedReq = await prisma.serviceRequest.create({
    data: {
      customerId: customerUser.id,
      workerId: demoWorkerUser.id,
      serviceCategoryId: categoryMap['electrician'].id,
      problemTitle: 'Ceiling Fan Regulator Sparking & Noise',
      problemDescription: 'The 5-speed fan regulator was sparking whenever turned to speed 3 and fan was wobbling.',
      urgency: 'ASAP',
      scheduledTime: 'Immediate',
      locationAddress: 'Flat 402, Ganga Heights, MG Marg, Civil Lines, Prayagraj',
      locationCity: 'Prayagraj',
      locationLocality: 'Civil Lines',
      estimatedBudget: 350,
      status: 'COMPLETED',
      timeline: {
        create: [
          { status: 'REQUESTED', note: 'Request placed by customer' },
          { status: 'ACCEPTED', note: 'Rahul Kumar accepted the request' },
          { status: 'ON_THE_WAY', note: 'Worker is traveling to location' },
          { status: 'ARRIVED', note: 'Worker reached the premises' },
          { status: 'IN_PROGRESS', note: 'Regulator replaced and fan balanced' },
          { status: 'COMPLETED', note: 'Job completed successfully' },
        ],
      },
      review: {
        create: {
          customerId: customerUser.id,
          workerId: demoWorkerUser.id,
          ratingOverall: 5.0,
          ratingPunctuality: 5.0,
          ratingQuality: 5.0,
          ratingValue: 5.0,
          comment: 'Rahul arrived within 20 minutes! Replaced the faulty regulator cleanly and balanced our old ceiling fan. Extremely courteous, professional and fair pricing. Highly recommended!',
        },
      },
    },
  });

  // Seed sample welcome notification
  await prisma.notification.create({
    data: {
      userId: customerUser.id,
      title: 'Welcome to Sarthi!',
      message: 'Find verified electricians, plumbers, mechanics & technicians in Prayagraj with upfront pricing.',
      type: 'SYSTEM',
      link: '/',
    },
  });

  await prisma.notification.create({
    data: {
      userId: demoWorkerUser.id,
      title: 'Profile Active & Verified',
      message: 'Your Sarthi Electrician profile is live in Civil Lines, Prayagraj. You are receiving instant leads.',
      type: 'SYSTEM',
      link: '/worker/dashboard',
    },
  });

  console.log('✅ Sarthi database successfully seeded with demo accounts, categories, and verified local workers!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
