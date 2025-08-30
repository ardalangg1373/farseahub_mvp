const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash('demo123', 10);

  // Create demo users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@farseahub.com',
        name: 'Admin User',
        role: 'ADMIN',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        email: 'seller@farseahub.com',
        name: 'Demo Seller',
        role: 'SELLER',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        email: 'guide@farseahub.com',
        name: 'Tour Guide',
        role: 'GUIDE',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        email: 'user1@farseahub.com',
        name: 'Arman Ahmadi',
        role: 'USER',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        email: 'user2@farseahub.com',
        name: 'Neda Mohammadi',
        role: 'USER',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        email: 'user3@farseahub.com',
        name: 'Sina Karimi',
        role: 'USER',
        password: hashedPassword,
      },
    }),
  ]);

  console.log('👥 Created users:', users.length);

  // Create marketplace products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        sellerId: users[1].id, // seller user
        title: 'Demo Phone',
        description: 'A high-quality smartphone with advanced features',
        priceCents: 49999,
        stock: 10,
        images: JSON.stringify(['/images/phone1.jpg', '/images/phone2.jpg']),
        attrs: JSON.stringify({ brand: 'TechCorp', model: 'X1', color: 'Black' }),
      },
    }),
    prisma.product.create({
      data: {
        sellerId: users[1].id,
        title: 'Demo Shirt',
        description: 'Comfortable cotton t-shirt in various sizes',
        priceCents: 2999,
        stock: 25,
        images: JSON.stringify(['/images/shirt1.jpg']),
        attrs: JSON.stringify({ size: 'M', color: 'Blue', material: 'Cotton' }),
      },
    }),
    prisma.product.create({
      data: {
        sellerId: users[1].id,
        title: 'Demo Book', 
        description: 'An interesting novel about adventure and friendship',
        priceCents: 1999,
        stock: 50,
        images: JSON.stringify(['/images/book1.jpg']),
        attrs: JSON.stringify({ author: 'Famous Writer', pages: 320, language: 'English' }),
      },
    }),
  ]);

  console.log('📦 Created products:', products.length);

  // Create tourism places
  const places = await Promise.all([
    prisma.place.create({
      data: {
        title: 'Old Town Shiraz',
        description: 'Historic old town with traditional Persian architecture',
        city: 'Shiraz',
        country: 'IR',
        lat: 29.5918,
        lng: 52.5836,
        images: JSON.stringify(['/images/shiraz1.jpg', '/images/shiraz2.jpg']),
        tags: ['historic', 'architecture', 'culture'],
      },
    }),
    prisma.place.create({
      data: {
        title: 'Tehran Grand Bazaar',
        description: 'One of the oldest and largest bazaars in the Middle East',
        city: 'Tehran',
        country: 'IR',
        lat: 35.6892,
        lng: 51.3890,
        images: JSON.stringify(['/images/bazaar1.jpg']),
        tags: ['shopping', 'traditional', 'culture'],
      },
    }),
  ]);

  console.log('🏛️ Created places:', places.length);

  // Create tours
  const tours = await Promise.all([
    prisma.tour.create({
      data: {
        placeId: places[0].id,
        title: 'Old Town Walking Tour',
        description: 'Explore the historic streets and landmarks of old Shiraz',
        durationMin: 90,
        basePriceCents: 2499,
      },
    }),
    prisma.tour.create({
      data: {
        placeId: places[1].id,
        title: 'Bazaar Shopping Experience',
        description: 'Guided tour through the traditional bazaar with shopping tips',
        durationMin: 120,
        basePriceCents: 3499,
      },
    }),
  ]);

  console.log('🚶 Created tours:', tours.length);

  // Create tour sessions
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const sessions = await Promise.all([
    prisma.tourSession.create({
      data: {
        tourId: tours[0].id,
        guideId: users[2].id, // guide user
        startTime: tomorrow,
        capacity: 8,
        priceCents: 2499,
      },
    }),
    prisma.tourSession.create({
      data: {
        tourId: tours[1].id,
        guideId: users[2].id,
        startTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000), // +2 hours
        capacity: 12,
        priceCents: 3499,
      },
    }),
  ]);

  console.log('📅 Created tour sessions:', sessions.length);

  // Create dating profiles
  const profiles = await Promise.all([
    prisma.profile.create({
      data: {
        userId: users[3].id, // Arman
        displayName: 'Arman',
        age: 28,
        gender: 'male',
        bio: 'Love gaming and hiking. Looking for someone to explore the city with!',
        city: 'Tehran',
        interests: ['gaming', 'hiking', 'photography'],
        photos: JSON.stringify(['/images/profile1.jpg', '/images/profile1b.jpg']),
      },
    }),
    prisma.profile.create({
      data: {
        userId: users[4].id, // Neda
        displayName: 'Neda',
        age: 26,
        gender: 'female',
        bio: 'Art enthusiast and coffee lover. Always up for gallery visits and deep conversations.',
        city: 'Shiraz',
        interests: ['art', 'coffee', 'books', 'music'],
        photos: JSON.stringify(['/images/profile2.jpg']),
      },
    }),
    prisma.profile.create({
      data: {
        userId: users[5].id, // Sina
        displayName: 'Sina',
        age: 31,
        gender: 'male',
        bio: 'Photographer and cycling enthusiast. Let\'s capture some beautiful moments together!',
        city: 'Isfahan',
        interests: ['photography', 'cycling', 'travel', 'nature'],
        photos: JSON.stringify(['/images/profile3.jpg', '/images/profile3b.jpg']),
      },
    }),
  ]);

  console.log('💕 Created dating profiles:', profiles.length);

  // Create some sample likes and matches
  const likes = await Promise.all([
    prisma.like.create({
      data: {
        fromId: users[3].id, // Arman likes Neda
        toId: users[4].id,
      },
    }),
    prisma.like.create({
      data: {
        fromId: users[4].id, // Neda likes Arman back
        toId: users[3].id,
      },
    }),
  ]);

  // Create a match since they liked each other
  const match = await prisma.match.create({
    data: {
      userAId: users[3].id,
      userBId: users[4].id,
    },
  });

  // Create some sample messages
  await Promise.all([
    prisma.message.create({
      data: {
        matchId: match.id,
        senderId: users[3].id,
        content: 'Hi Neda! I love your photos, especially the one from the art gallery.',
      },
    }),
    prisma.message.create({
      data: {
        matchId: match.id,
        senderId: users[4].id,
        content: 'Thank you Arman! I saw you like hiking. Maybe we can explore some trails around Tehran?',
      },
    }),
  ]);

  console.log('💬 Created sample match and messages');

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });