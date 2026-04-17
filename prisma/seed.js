// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');
const prisma = new PrismaClient();

const categories = ['Action', 'Adventure', 'Racing', 'Sports', 'RPG', 'Simulation',
  'Multiplayer', 'Single-Player', 'Open World', 'Survival', 'Shooter'];

const games = [
  {
    title: 'Spider-Man 2',
    magnetUri: 'magnet:?xt=urn:btih:PLACEHOLDER_SPIDERMAN2&dn=Spider-Man+2+PC',
    fileSize: '72 GB',
    description: 'Peter Parker and Miles Morales face their greatest challenge. As the monstrous Venom and the formidable Kraven the Hunter threaten their lives, their loved ones, and an expanded open-world New York City.',
    thumbnailUrl: '/images/spiderman2-thumb.jpg',
    bannerUrl: '/images/spiderman2-banner.gif',
    platform: 'PC / PS5',
    testedOn: 'Windows 10',
    architecture: 'x64',
    version: '1.0.0',
    isFeatured: true,
    categories: ['Action', 'Adventure'],
    requirements: {
      minOs: 'Windows 10 64-bit',
      minCpu: 'Intel Core i5-4670K / AMD Ryzen 5 1600',
      minGpu: 'NVIDIA GTX 1060 6GB / AMD RX 580 8GB',
      minRam: '16 GB',
      minStorage: '72 GB SSD',
      minDirectX: 'DirectX 12',
      recOs: 'Windows 11 64-bit',
      recCpu: 'Intel Core i7-11700K / AMD Ryzen 7 5800X',
      recGpu: 'NVIDIA RTX 3070 / AMD RX 6800 XT',
      recRam: '16 GB',
      recStorage: '72 GB NVMe SSD',
      recDirectX: 'DirectX 12',
      fixNotes: '• Update your graphics drivers\n• Install DirectX 12\n• Run the game as Administrator\n• Disable background apps\n• Install Visual C++ Redistributable'
    }
  },
  {
    title: 'Call of Duty: Black Ops',
    magnetUri: 'magnet:?xt=urn:btih:PLACEHOLDER_COD&dn=Call+of+Duty+PC',
    fileSize: '175 GB',
    description: 'Call of Duty is a long-running video game franchise centered on first-person shooter combat, with single-player campaigns following soldiers in various wars and highly popular multiplayer modes.',
    thumbnailUrl: '/images/callofduty-thumb.jpg',
    bannerUrl: '/images/callofduty-banner.gif',
    platform: 'PC',
    testedOn: 'Windows 10 / Windows 11',
    architecture: 'x64',
    isFeatured: true,
    categories: ['Action', 'Shooter', 'Multiplayer'],
    requirements: {
      minOs: 'Windows 10 64-bit',
      minCpu: 'Intel Core i3-6100 / AMD Ryzen 5 1400',
      minGpu: 'NVIDIA GTX 1060 / AMD RX 580',
      minRam: '8 GB',
      minStorage: '175 GB',
      minDirectX: 'DirectX 12',
      recOs: 'Windows 11 64-bit',
      recCpu: 'Intel Core i7-8700K / AMD Ryzen 7 2700X',
      recGpu: 'NVIDIA RTX 2060 / AMD RX 6700 XT',
      recRam: '16 GB',
      recStorage: '175 GB SSD',
      recDirectX: 'DirectX 12',
      fixNotes: '• Update DirectX and Visual C++\n• Run as Administrator\n• Verify game files if crashing\n• Disable antivirus temporarily during install'
    }
  },
  {
    title: 'Fortnite',
    magnetUri: 'magnet:?xt=urn:btih:PLACEHOLDER_FORTNITE&dn=Fortnite+PC',
    fileSize: '26 GB',
    description: 'Fortnite is a multiplayer game platform featuring multiple game modes, with its most popular being the free-to-play Battle Royale mode where up to 100 players fight to be the last one standing on a shrinking island, building structures for defense.',
    thumbnailUrl: '/images/fortnite-thumb.jpg',
    bannerUrl: '/images/fortnite-banner.gif',
    platform: 'PC / Mobile / Console',
    testedOn: 'Windows 10',
    architecture: 'x64',
    categories: ['Action', 'Multiplayer', 'Shooter'],
    requirements: {
      minOs: 'Windows 7/8/10 64-bit',
      minCpu: 'Intel Core i3-3225 3.3GHz',
      minGpu: 'Intel HD 4000 / AMD Radeon Vega 8',
      minRam: '8 GB',
      minStorage: '26 GB',
      minDirectX: 'DirectX 11',
      recOs: 'Windows 10 64-bit',
      recCpu: 'Intel Core i7-8700 / AMD Ryzen 7 3700X',
      recGpu: 'NVIDIA RTX 3070 / AMD RX 5700 XT',
      recRam: '16 GB',
      recStorage: '26 GB SSD',
      recDirectX: 'DirectX 12',
      fixNotes: '• Run Epic Games Launcher as Administrator\n• Check firewall settings\n• Reinstall Visual C++ packages'
    }
  },
  {
    title: 'Sekiro: Shadows Die Twice',
    magnetUri: 'magnet:?xt=urn:btih:PLACEHOLDER_SEKIRO&dn=Sekiro+Shadows+Die+Twice+PC',
    fileSize: '14 GB',
    description: 'Sekiro: Shadows Die Twice is an action-adventure game set in a fantasy version of 1500s Sengoku-era Japan, following a shinobi named Wolf who is tasked with protecting a young lord named Kuro.',
    thumbnailUrl: '/images/sekiro-thumb.jpg',
    bannerUrl: '/images/sekiro-banner.gif',
    platform: 'PC',
    testedOn: 'Windows 10',
    architecture: 'x64',
    categories: ['Action', 'Single-Player', 'Adventure'],
    requirements: {
      minOs: 'Windows 7 SP1 64-bit',
      minCpu: 'Intel Core i3-2100 / AMD FX-6300',
      minGpu: 'NVIDIA GeForce GTX 760 / AMD Radeon R9 270',
      minRam: '4 GB',
      minStorage: '14 GB',
      minDirectX: 'DirectX 11',
      recOs: 'Windows 10 64-bit',
      recCpu: 'Intel Core i7-7700K / AMD Ryzen 5 1600',
      recGpu: 'NVIDIA GeForce GTX 1070 8GB / AMD RX Vega 56',
      recRam: '8 GB',
      recStorage: '14 GB SSD',
      recDirectX: 'DirectX 11',
      fixNotes: '• Install DirectX and Visual C++ Redistributable\n• Use Flawless Widescreen for ultrawide support\n• Disable Steam overlay if crashing'
    }
  },
  {
    title: 'The Witcher 3: Wild Hunt',
    magnetUri: 'magnet:?xt=urn:btih:PLACEHOLDER_WITCHER3&dn=The+Witcher+3+Wild+Hunt+PC',
    fileSize: '50 GB',
    description: 'The Witcher 3: Wild Hunt is a 2015 action role-playing game where players control Geralt of Rivia, a monster slayer, as he searches for his adoptive daughter, Ciri, who is being pursued by the Wild Hunt, a spectral, otherworldly force.',
    thumbnailUrl: '/images/witcher3-thumb.jpg',
    bannerUrl: '/images/witcher3-banner.gif',
    platform: 'PC / PS5 / Xbox',
    testedOn: 'Windows 10 / Windows 11',
    architecture: 'x64',
    isFeatured: true,
    categories: ['RPG', 'Adventure', 'Single-Player', 'Open World'],
    requirements: {
      minOs: 'Windows 7 64-bit',
      minCpu: 'Intel Core i5-2500K / AMD Phenom II X4 940',
      minGpu: 'NVIDIA GeForce GTX 660 / AMD Radeon R9 280',
      minRam: '6 GB',
      minStorage: '50 GB',
      minDirectX: 'DirectX 11',
      recOs: 'Windows 10 64-bit',
      recCpu: 'Intel Core i7-3770 / AMD FX-8350',
      recGpu: 'NVIDIA GeForce GTX 770 / AMD Radeon R9 290',
      recRam: '8 GB',
      recStorage: '50 GB SSD',
      recDirectX: 'DirectX 11',
      fixNotes: '• Update GPU drivers for Ray Tracing support\n• Install the latest patch (4.04)\n• Disable mods if experiencing crashes'
    }
  },
  {
    title: 'Elden Ring',
    magnetUri: 'magnet:?xt=urn:btih:PLACEHOLDER_ELDENRING&dn=Elden+Ring+PC',
    fileSize: '44 GB',
    description: 'Elden Ring is set in the Lands Between, a realm ruled by the demigod children of Queen Marika the Eternal after she shattered the Elden Ring and disappeared. Explore a massive open world filled with dungeons, bosses, and lore.',
    thumbnailUrl: '/images/eldenring-thumb.jpg',
    bannerUrl: '/images/eldenring-banner.gif',
    platform: 'PC',
    testedOn: 'Windows 10',
    architecture: 'x64',
    isFeatured: true,
    categories: ['Action', 'RPG', 'Single-Player', 'Open World'],
    requirements: {
      minOs: 'Windows 10 / 11',
      minCpu: 'INTEL CORE I5-8600K / AMD RYZEN 5 3600X',
      minGpu: 'NVIDIA GEFORCE GTX 1070 8GB / AMD RADEON RX VEGA 56 8GB',
      minRam: '12 GB',
      minStorage: '60 GB SSD',
      minDirectX: 'DirectX 12',
      recOs: 'Windows 10 / 11',
      recCpu: 'INTEL CORE I7-8700K / AMD RYZEN 5 3600X',
      recGpu: 'NVIDIA GEFORCE GTX 1080 / AMD RADEON RX 5700 XT',
      recRam: '16 GB',
      recStorage: '60 GB SSD',
      recDirectX: 'DirectX 12',
      fixNotes: '• Use Elden Ring Seamless Co-op mod for multiplayer\n• Install Easy Anti-Cheat if prompted\n• Stutter fix: Set power mode to High Performance'
    }
  },
  {
    title: 'Red Dead Redemption 2',
    magnetUri: 'magnet:?xt=urn:btih:PLACEHOLDER_RDR2&dn=Red+Dead+Redemption+2+PC',
    fileSize: '120 GB',
    description: 'Red Dead Redemption 2 is a 2018 action-adventure game set in 1899 American West. Play as Arthur Morgan, an outlaw navigating the decline of the Wild West era alongside the Van der Linde gang.',
    thumbnailUrl: '/images/rdr2-thumb.jpg',
    bannerUrl: '/images/rdr2-banner.gif',
    platform: 'PC',
    testedOn: 'Windows 10',
    architecture: 'x64',
    categories: ['Action', 'Adventure', 'Open World', 'Single-Player'],
    requirements: {
      minOs: 'Windows 10 64-bit',
      minCpu: 'Intel Core i5-2500K / AMD FX-6300',
      minGpu: 'Nvidia GeForce GTX 770 2GB / AMD Radeon R9 280',
      minRam: '8 GB',
      minStorage: '150 GB',
      minDirectX: 'DirectX 11',
      recOs: 'Windows 10 64-bit',
      recCpu: 'Intel Core i7-4770K / AMD Ryzen 5 1500X',
      recGpu: 'Nvidia GeForce GTX 1060 6GB / AMD Radeon RX 480 4GB',
      recRam: '12 GB',
      recStorage: '150 GB SSD',
      recDirectX: 'DirectX 12',
      fixNotes: '• Install all Rockstar prerequisites\n• Run Rockstar Games Launcher as Administrator\n• Disable MSAA on lower-end GPUs\n• Set Virtual Memory to at least 8GB'
    }
  },
  {
    title: 'Forza Horizon 5',
    magnetUri: 'magnet:?xt=urn:btih:PLACEHOLDER_FH5&dn=Forza+Horizon+5+PC',
    fileSize: '103 GB',
    description: "Forza Horizon 5 is a racing video game where players take on the role of a driver expanding the Horizon Festival in a massive, fictionalized Mexico. Features hundreds of cars and stunning open-world environments.",
    thumbnailUrl: '/images/forza5-thumb.jpg',
    bannerUrl: '/images/forza5-banner.gif',
    platform: 'PC / Xbox',
    testedOn: 'Windows 10',
    architecture: 'x64',
    categories: ['Racing', 'Open World', 'Multiplayer'],
    requirements: {
      minOs: 'Windows 10 version 15063.0',
      minCpu: 'Intel i5-4460 / AMD Ryzen 3 1200',
      minGpu: 'NVidia GTX 970 / AMD RX 470',
      minRam: '8 GB',
      minStorage: '110 GB SSD',
      minDirectX: 'DirectX 12',
      recOs: 'Windows 10 version 15063.0 or higher',
      recCpu: 'Intel i7-8700K / AMD Ryzen 7 5800X',
      recGpu: 'NVidia RTX 3080 / AMD RX 6800 XT',
      recRam: '16 GB',
      recStorage: '110 GB SSD',
      recDirectX: 'DirectX 12',
      fixNotes: '• Enable Xbox Game Bar for streaming\n• Update Windows to latest version\n• Repair DirectX via command line if crashing on launch'
    }
  },
  {
    title: 'The Last of Us Part I',
    magnetUri: 'magnet:?xt=urn:btih:PLACEHOLDER_TLOU&dn=The+Last+of+Us+Part+I+PC',
    fileSize: '72 GB',
    description: 'The Last of Us is a post-apocalyptic story about a smuggler named Joel who escorts a teenage girl named Ellie across a devastated United States. A masterpiece of storytelling and character development.',
    thumbnailUrl: '/images/tlou-thumb.jpg',
    bannerUrl: '/images/tlou-banner.gif',
    platform: 'PC / PS5',
    testedOn: 'Windows 10',
    architecture: 'x64',
    categories: ['Action', 'Adventure', 'Survival', 'Single-Player'],
    requirements: {
      minOs: 'Windows 10 64-bit',
      minCpu: 'Intel Core i7-8700 / AMD Ryzen 5 3600',
      minGpu: 'NVIDIA GeForce GTX 970 / AMD Radeon RX 470',
      minRam: '16 GB',
      minStorage: '72 GB SSD',
      minDirectX: 'DirectX 12',
      recOs: 'Windows 11 64-bit',
      recCpu: 'Intel Core i9-9900K / AMD Ryzen 9 3950X',
      recGpu: 'NVIDIA GeForce RTX 2080 / AMD Radeon RX 6800',
      recRam: '16 GB',
      recStorage: '72 GB NVMe SSD',
      recDirectX: 'DirectX 12',
      fixNotes: '• Patch 1.0.2 fixes most stuttering issues\n• Lower shader quality if experiencing freezes on launch\n• Disable Ray Tracing on mid-range GPUs'
    }
  }
];

async function main() {
  console.log('🌱 Seeding database...');

  // Upsert categories
  for (const name of categories) {
    await prisma.category.upsert({
      where: { slug: slugify(name, { lower: true }) },
      update: {},
      create: {
        name,
        slug: slugify(name, { lower: true })
      }
    });
  }
  console.log(`✅ ${categories.length} categories created`);

  // Insert games
  for (const g of games) {
    const slug = slugify(g.title, { lower: true, strict: true });
    const { categories: cats, requirements, ...gameData } = g;

    const game = await prisma.game.upsert({
      where: { slug },
      update: {},
      create: {
        ...gameData,
        slug,
        requirements: { create: requirements }
      }
    });

    // Link categories
    for (const catName of cats) {
      const cat = await prisma.category.findUnique({
        where: { slug: slugify(catName, { lower: true }) }
      });
      if (cat) {
        await prisma.gameCategory.upsert({
          where: { gameId_categoryId: { gameId: game.id, categoryId: cat.id } },
          update: {},
          create: { gameId: game.id, categoryId: cat.id }
        });
      }
    }
  }
  console.log(`✅ ${games.length} games seeded`);
  console.log('🎮 Database ready!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
