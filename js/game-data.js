/**
 * GameHub - Game Data
 * Mock data for games in the GameHub application
 */

const gameData = [
    {
        id: 'cyberpunk-2077',
        title: 'Cyberpunk 2077',
        description: 'Cyberpunk 2077 is an open-world, action-adventure RPG set in Night City, a megalopolis obsessed with power, glamour and body modification.',
        developer: 'CD Projekt Red',
        publisher: 'CD Projekt',
        releaseDate: '2020-12-10',
        price: 59.99,
        discountPercent: 0,
        genres: ['RPG', 'Open World', 'Action', 'Sci-fi'],
        tags: ['Cyberpunk', 'RPG', 'Open World', 'Sci-fi', 'Futuristic'],
        features: ['Single-player', 'Full controller support', 'Cloud saves', 'Steam achievements'],
        images: {
            thumbnail: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg',
            header: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
            screenshots: [
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_b529b0abc43f55fc0067526a78cb6ca385e90cb4.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_87cad6f0fec2de3d09857d86043a8ddc3eb481ab.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_5339a74c4563d40a1d8a5638db2a9a249d0b4d6f.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_b5c0a10df1a39fd95b843d5f261a0e919e9f2d71.jpg'
            ]
        },
        videos: ['https://cdn.cloudflare.steamstatic.com/steam/apps/256820714/movie480_vp9.webm'],
        systemRequirements: {
            minimum: {
                os: 'Windows 10 (64-bit)',
                processor: 'Intel Core i5-3570K or AMD FX-8310',
                memory: '8 GB RAM',
                graphics: 'NVIDIA GeForce GTX 970 or AMD Radeon RX 470',
                storage: '70 GB available space'
            },
            recommended: {
                os: 'Windows 10 (64-bit)',
                processor: 'Intel Core i7-4790 or AMD Ryzen 3 3200G',
                memory: '12 GB RAM',
                graphics: 'NVIDIA GeForce GTX 1060 or AMD Radeon R9 Fury',
                storage: '70 GB SSD available space'
            }
        },
        rating: 4.2,
        reviewCount: 1423
    },
    {
        id: 'elden-ring',
        title: 'Elden Ring',
        description: 'Elden Ring is an action RPG which takes place in the Lands Between, sometime after the Shattering of the titular Elden Ring. As a Tarnished, the player must traverse the realm to repair the Elden Ring and become the Elden Lord.',
        developer: 'FromSoftware',
        publisher: 'Bandai Namco',
        releaseDate: '2022-02-25',
        price: 59.99,
        discountPercent: 0,
        genres: ['RPG', 'Souls-like', 'Open World', 'Fantasy'],
        tags: ['Souls-like', 'RPG', 'Fantasy', 'Open World', 'Difficult'],
        features: ['Single-player', 'Online Co-op', 'Full controller support', 'Cloud saves'],
        images: {
            thumbnail: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/capsule_616x353.jpg',
            header: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
            screenshots: [
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_e80a45c84c5f7cd303d6679b771af8fe55570726.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_c372274f9ed163e46a1a4c79995d647a9e31bb09.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_928e6e3f52c3f15b89c3e22bbb9096b31c35bd3b.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_c83d7816bb6c4088e1af3fc3f0a5731c3b19febc.jpg'
            ]
        },
        videos: ['https://cdn.cloudflare.steamstatic.com/steam/apps/256889456/movie480_vp9.webm'],
        systemRequirements: {
            minimum: {
                os: 'Windows 10 (64-bit)',
                processor: 'Intel Core i5-8400 or AMD Ryzen 3 3300X',
                memory: '12 GB RAM',
                graphics: 'NVIDIA GeForce GTX 1060 3GB or AMD Radeon RX 580 4GB',
                storage: '60 GB available space'
            },
            recommended: {
                os: 'Windows 10/11 (64-bit)',
                processor: 'Intel Core i7-8700K or AMD Ryzen 5 3600X',
                memory: '16 GB RAM',
                graphics: 'NVIDIA GeForce GTX 1070 8GB or AMD Radeon RX Vega 56 8GB',
                storage: '60 GB SSD available space'
            }
        },
        rating: 4.8,
        reviewCount: 2857
    },
    {
        id: 'god-of-war',
        title: 'God of War',
        description: 'His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive… and teach his son to do the same.',
        developer: 'Santa Monica Studio',
        publisher: 'PlayStation PC LLC',
        releaseDate: '2022-01-14',
        price: 49.99,
        discountPercent: 0,
        genres: ['Action', 'Adventure', 'RPG'],
        tags: ['Action', 'Adventure', 'Mythology', 'Story Rich', 'Single-player'],
        features: ['Single-player', 'Full controller support', 'Steam achievements'],
        images: {
            thumbnail: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/capsule_616x353.jpg',
            header: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg',
            screenshots: [
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/ss_914f6dfdccca61b7e5c9a89cd1f37ba9fd2db9cb.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/ss_555f4143596c9625eb28ac7edbc1a30672fe9b3d.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/ss_f6bdfb7e45c3e205e363e31c7bdff9f0c79dbd10.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/ss_da8c664a39773635eaa78aabaad671475e63621f.jpg'
            ]
        },
        videos: ['https://cdn.cloudflare.steamstatic.com/steam/apps/256864471/movie480_vp9.webm'],
        systemRequirements: {
            minimum: {
                os: 'Windows 10 (64-bit)',
                processor: 'Intel i5-2500k (4 core 3.3 GHz) or AMD Ryzen 3 1200 (4 core 3.1 GHz)',
                memory: '8 GB RAM',
                graphics: 'NVIDIA GTX 960 (4 GB) or AMD R9 290X (4 GB)',
                storage: '70 GB available space'
            },
            recommended: {
                os: 'Windows 10 (64-bit)',
                processor: 'Intel i5-6600k (4 core 3.5 GHz) or AMD Ryzen 5 2400 G (4 core 3.6 GHz)',
                memory: '8 GB RAM',
                graphics: 'NVIDIA GTX 1060 (6 GB) or AMD RX 570 (4 GB)',
                storage: '70 GB SSD available space'
            }
        },
        rating: 4.9,
        reviewCount: 3156
    },
    {
        id: 'horizon-forbidden-west',
        title: 'Horizon Forbidden West',
        description: 'Join Aloy as she braves the Forbidden West – a majestic but dangerous frontier that conceals mysterious new threats.',
        developer: 'Guerrilla Games',
        publisher: 'PlayStation PC LLC',
        releaseDate: '2023-10-05',
        price: 54.99,
        discountPercent: 0,
        genres: ['Action', 'RPG', 'Open World', 'Adventure'],
        tags: ['Open World', 'Post-apocalyptic', 'Female Protagonist', 'Action RPG'],
        features: ['Single-player', 'Full controller support', 'Steam achievements'],
        images: {
            thumbnail: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2420340/capsule_616x353.jpg',
            header: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2420340/header.jpg',
            screenshots: [
                'https://cdn.cloudflare.steamstatic.com/steam/apps/2420340/ss_41cebb4b1ab3cf836c62ae969782626a1ef5ee27.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/2420340/ss_b1b3d15eb5bb1a523f3f67a939fbc5de950ca63f.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/2420340/ss_ec56ad4abdf4a9fc6cd9aa31c1b8cbe80ea9d5c3.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/2420340/ss_0fc90cb749e6eefe97f7dc14b5a60a3cbb12d77d.jpg'
            ]
        },
        videos: ['https://cdn.cloudflare.steamstatic.com/steam/apps/256963390/movie480_vp9.webm'],
        systemRequirements: {
            minimum: {
                os: 'Windows 10 (64-bit)',
                processor: 'Intel Core i3-8100 or AMD Ryzen 3 1300X',
                memory: '16 GB RAM',
                graphics: 'NVIDIA GeForce GTX 1650 or AMD Radeon RX 5500 XT',
                storage: '150 GB available space'
            },
            recommended: {
                os: 'Windows 10 (64-bit)',
                processor: 'Intel Core i5-8600 or AMD Ryzen 5 3600',
                memory: '16 GB RAM',
                graphics: 'NVIDIA GeForce RTX 3060 or AMD Radeon RX 5700',
                storage: '150 GB SSD available space'
            }
        },
        rating: 4.6,
        reviewCount: 1865
    },
    {
        id: 'stardew-valley',
        title: 'Stardew Valley',
        description: 'You\'ve inherited your grandfather\'s old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life. Can you learn to live off the land and turn these overgrown fields into a thriving home?',
        developer: 'ConcernedApe',
        publisher: 'ConcernedApe',
        releaseDate: '2016-02-26',
        price: 14.99,
        discountPercent: 0,
        genres: ['Simulation', 'RPG', 'Indie', 'Farming Sim'],
        tags: ['Farming', 'Life Sim', 'Relaxing', 'Pixel Graphics', 'Multiplayer'],
        features: ['Single-player', 'Online Co-op', 'Local Co-op', 'Steam Workshop'],
        images: {
            thumbnail: 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/capsule_616x353.jpg',
            header: 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg',
            screenshots: [
                'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/ss_b887651a93b0525739049eb4194f633de2d9d0c5.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/ss_271feae3f11bf6b16a8a6c3a36ee12f28dba2b8d.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/ss_b9df4ddb32f0970a735a53deb8f9f06c02e5bc7d.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/ss_6e4e5d927848286acbf5017b37ef3042f058ba37.jpg'
            ]
        },
        videos: ['https://cdn.cloudflare.steamstatic.com/steam/apps/256660296/movie480.webm'],
        systemRequirements: {
            minimum: {
                os: 'Windows Vista or greater',
                processor: '2 GHz',
                memory: '2 GB RAM',
                graphics: '256 MB video memory, shader model 3.0+',
                storage: '500 MB available space'
            },
            recommended: {
                os: 'Windows 7 or greater',
                processor: '2.4 GHz',
                memory: '4 GB RAM',
                graphics: '512 MB video memory, shader model 3.0+',
                storage: '500 MB available space'
            }
        },
        rating: 4.9,
        reviewCount: 5623
    },
    {
        id: 'red-dead-redemption-2',
        title: 'Red Dead Redemption 2',
        description: 'America, 1899. Arthur Morgan and the Van der Linde gang are outlaws on the run. With federal agents and the best bounty hunters in the nation massing on their heels, the gang must rob, steal and fight their way across the rugged heartland of America in order to survive.',
        developer: 'Rockstar Games',
        publisher: 'Rockstar Games',
        releaseDate: '2019-12-05',
        price: 59.99,
        discountPercent: 50,
        genres: ['Action', 'Adventure', 'Open World'],
        tags: ['Western', 'Open World', 'Story Rich', 'Action'],
        features: ['Single-player', 'Online Co-op', 'Full controller support', 'Steam achievements'],
        images: {
            thumbnail: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/capsule_616x353.jpg',
            header: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg',
            screenshots: [
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_bac60bacbf5da8945103648c08d27d5e202444ca.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_66b5fcf36e9d4d1d00fb294673ae893748fed93a.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_6bec7d9e69723864abb6fb1758216ea574b1e970.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_d1a8f5a69155c3186c7166b9d6db9109f82c5853.jpg'
            ]
        },
        videos: ['https://cdn.cloudflare.steamstatic.com/steam/apps/256768371/movie480.webm'],
        systemRequirements: {
            minimum: {
                os: 'Windows 10 (64-bit)',
                processor: 'Intel Core i5-2500K / AMD FX-6300',
                memory: '8 GB RAM',
                graphics: 'Nvidia GeForce GTX 770 2GB / AMD Radeon R9 280 3GB',
                storage: '150 GB available space'
            },
            recommended: {
                os: 'Windows 10 (64-bit)',
                processor: 'Intel Core i7-4770K / AMD Ryzen 5 1500X',
                memory: '12 GB RAM',
                graphics: 'Nvidia GeForce GTX 1060 6GB / AMD Radeon RX 480 4GB',
                storage: '150 GB available space'
            }
        },
        rating: 4.7,
        reviewCount: 4258
    },
    {
        id: 'the-witcher-3',
        title: 'The Witcher 3: Wild Hunt',
        description: 'The Witcher 3: Wild Hunt is a story-driven, next-generation open world role-playing game set in a visually stunning fantasy universe full of meaningful choices and impactful consequences.',
        developer: 'CD Projekt Red',
        publisher: 'CD Projekt',
        releaseDate: '2015-05-18',
        price: 39.99,
        discountPercent: 75,
        genres: ['RPG', 'Open World', 'Story Rich'],
        tags: ['RPG', 'Open World', 'Fantasy', 'Story Rich', 'Atmospheric'],
        features: ['Single-player', 'Full controller support', 'Steam achievements'],
        images: {
            thumbnail: 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/capsule_616x353.jpg',
            header: 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg',
            screenshots: [
                'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_107600c1337accc09104f7a8aa7f275f23cad096.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_90e33dd724a3c7f28be5a8da729766854fe1601d.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_64eb760f9a2b67f6731a71cce3a8fb684b9af267.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_d5b8566a05662b4c53a9c2e0e4c5302193302c5f.jpg'
            ]
        },
        videos: ['https://cdn.cloudflare.steamstatic.com/steam/apps/256658589/movie480.webm'],
        systemRequirements: {
            minimum: {
                os: '64-bit Windows 7, 64-bit Windows 8 (8.1) or 64-bit Windows 10',
                processor: 'Intel CPU Core i5-2500K 3.3GHz / AMD CPU Phenom II X4 940',
                memory: '6 GB RAM',
                graphics: 'Nvidia GPU GeForce GTX 660 / AMD GPU Radeon HD 7870',
                storage: '50 GB available space'
            },
            recommended: {
                os: '64-bit Windows 7, 64-bit Windows 8 (8.1) or 64-bit Windows 10',
                processor: 'Intel CPU Core i7 3770 3.4 GHz / AMD CPU AMD FX-8350 4 GHz',
                memory: '8 GB RAM',
                graphics: 'Nvidia GPU GeForce GTX 770 / AMD GPU Radeon R9 290',
                storage: '50 GB available space'
            }
        },
        rating: 4.8,
        reviewCount: 6982
    },
    {
        id: 'baldurs-gate-3',
        title: 'Baldur\'s Gate 3',
        description: 'Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power. Mysterious abilities are awakening inside you, drawn from a Mind Flayer parasite planted in your brain.',
        developer: 'Larian Studios',
        publisher: 'Larian Studios',
        releaseDate: '2023-08-03',
        price: 59.99,
        discountPercent: 0,
        genres: ['RPG', 'Turn-Based', 'Fantasy', 'Story Rich'],
        tags: ['RPG', 'Turn-Based', 'Fantasy', 'D&D', 'Co-op'],
        features: ['Single-player', 'Online Co-op', 'Full controller support', 'Cross-platform multiplayer'],
        images: {
            thumbnail: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/capsule_616x353.jpg',
            header: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg',
            screenshots: [
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/ss_c839c98dd4d8ee16fcc3c9a9c2bc404e69d21bae.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/ss_d93930a2f2f6d3d9bcc1ffc10626baad3c52bb73.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/ss_7aac1fa634066edc644eb34c4e5b47022a5bfc53.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/ss_92c5869aff8df06d683966d8ca504e4df76bb0ed.jpg'
            ]
        },
        videos: ['https://cdn.cloudflare.steamstatic.com/steam/apps/256923671/movie480_vp9.webm'],
        systemRequirements: {
            minimum: {
                os: 'Windows 10 (64-bit)',
                processor: 'Intel i5-4690 / AMD FX 8350',
                memory: '8 GB RAM',
                graphics: 'NVIDIA GTX 970 / RX 480 (4GB+ of VRAM)',
                storage: '150 GB available space'
            },
            recommended: {
                os: 'Windows 10 (64-bit)',
                processor: 'Intel i7 8700K / AMD r5 3600',
                memory: '16 GB RAM',
                graphics: 'NVIDIA 2060 Super / RX 5700 XT (8GB+ of VRAM)',
                storage: '150 GB SSD available space'
            }
        },
        rating: 4.9,
        reviewCount: 4857
    },
    {
        id: 'final-fantasy-xvi',
        title: 'Final Fantasy XVI',
        description: 'The 16th standalone entry in the legendary Final Fantasy series. An epic dark fantasy world where the fate of the land is decided by the mighty Eikons and the Dominants who wield them.',
        developer: 'Square Enix',
        publisher: 'Square Enix',
        releaseDate: '2024-03-02',
        price: 69.99,
        discountPercent: 0,
        genres: ['RPG', 'Action', 'Fantasy', 'Story Rich'],
        tags: ['RPG', 'Action', 'Fantasy', 'JRPG', 'Story Rich'],
        features: ['Single-player', 'Full controller support', 'Steam achievements'],
        images: {
            thumbnail: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2324650/capsule_616x353.jpg',
            header: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2324650/header.jpg',
            screenshots: [
                'https://cdn.cloudflare.steamstatic.com/steam/apps/2324650/ss_9ce332cf4a3c4fc9ade0c1e41b45604b46c43141.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/2324650/ss_e5c03c48c18b562dafd1778f5e70be0cd593f4ac.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/2324650/ss_fee03b5f0e4c314d54c3d6ea46cbbb2a1df3dc00.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/2324650/ss_b91cae6aac3b2d3f294d36ac7c1efebfb2b0b7b5.jpg'
            ]
        },
        videos: ['https://cdn.cloudflare.steamstatic.com/steam/apps/256977500/movie480_vp9.webm'],
        systemRequirements: {
            minimum: {
                os: 'Windows 10 64-bit / Windows 11 64-bit',
                processor: 'AMD Ryzen 5 1600 / Intel Core i7-3770',
                memory: '16 GB RAM',
                graphics: 'AMD Radeon RX 5600 XT (8GB) / NVIDIA GeForce GTX 1080 (8GB)',
                storage: '170 GB available space'
            },
            recommended: {
                os: 'Windows 10 64-bit / Windows 11 64-bit',
                processor: 'AMD Ryzen 5 3600 / Intel Core i7-8700K',
                memory: '16 GB RAM',
                graphics: 'AMD Radeon RX 6700 XT (12GB) / NVIDIA GeForce RTX 2080 (8GB)',
                storage: '170 GB SSD available space'
            }
        },
        rating: 4.5,
        reviewCount: 1246
    },
    {
        id: 'hogwarts-legacy',
        title: 'Hogwarts Legacy',
        description: 'Hogwarts Legacy is an immersive, open-world action RPG. Now you can take control of the action and be at the center of your own adventure in the wizarding world.',
        developer: 'Avalanche Software',
        publisher: 'Warner Bros. Games',
        releaseDate: '2023-02-10',
        price: 59.99,
        discountPercent: 40,
        genres: ['RPG', 'Open World', 'Adventure', 'Fantasy'],
        tags: ['Magic', 'RPG', 'Open World', 'Fantasy', 'Adventure'],
        features: ['Single-player', 'Full controller support', 'Steam achievements'],
        images: {
            thumbnail: 'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/capsule_616x353.jpg',
            header: 'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg',
            screenshots: [
                'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/ss_8f3f4ef12a5cfae47d7557556e9dba3357338765.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/ss_8f0fc375046ad6833248de2c3a9b08b272aed067.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/ss_4995040fe27b0415c8b7ffe1a86607a3964b5bf7.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/ss_dca3f998bb2eaff89b35a255d60fcd89eb4eb6a3.jpg'
            ]
        },
        videos: ['https://cdn.cloudflare.steamstatic.com/steam/apps/256923952/movie480_vp9.webm'],
        systemRequirements: {
            minimum: {
                os: 'Windows 10',
                processor: 'Intel Core i5-8400 OR AMD Ryzen 5 3600',
                memory: '16 GB RAM',
                graphics: 'NVIDIA GeForce GTX 1070 or AMD RX Vega 56',
                storage: '85 GB available space'
            },
            recommended: {
                os: 'Windows 10',
                processor: 'Intel Core i7-8700 OR AMD Ryzen 5 3600X',
                memory: '16 GB RAM',
                graphics: 'NVIDIA GeForce 1080 Ti or AMD RX 5700 XT',
                storage: '85 GB SSD available space'
            }
        },
        rating: 4.6,
        reviewCount: 3679
    },
    {
        id: 'starfield',
        title: 'Starfield',
        description: 'Starfield is the first new universe in 25 years from Bethesda Game Studios, the award-winning creators of The Elder Scrolls V: Skyrim and Fallout 4.',
        developer: 'Bethesda Game Studios',
        publisher: 'Bethesda Softworks',
        releaseDate: '2023-09-06',
        price: 69.99,
        discountPercent: 20,
        genres: ['RPG', 'Open World', 'Space', 'Exploration'],
        tags: ['Space', 'RPG', 'Open World', 'Exploration', 'Sci-fi'],
        features: ['Single-player', 'Full controller support', 'Steam achievements'],
        images: {
            thumbnail: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/capsule_616x353.jpg',
            header: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg',
            screenshots: [
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/ss_c310f2e8b3a981c37dfd548540543c78ff1dfb2d.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/ss_a1c4cabb4b929b267b45acb92b994067a76fb017.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/ss_d8a1498f3910a496c27a058e4ec1f0e92ddcce76.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/ss_f94c8e53e0e6070a61e4dc3e92b88c52b4f5ff68.jpg'
            ]
        },
        videos: ['https://cdn.cloudflare.steamstatic.com/steam/apps/256950272/movie480_vp9.webm'],
        systemRequirements: {
            minimum: {
                os: 'Windows 10 version 21H1 (10.0.19043)',
                processor: 'AMD Ryzen 5 2600X, Intel Core i7-6800K',
                memory: '16 GB RAM',
                graphics: 'AMD Radeon RX 5700, NVIDIA GeForce 1070 Ti',
                storage: '125 GB available space'
            },
            recommended: {
                os: 'Windows 10/11 with updates',
                processor: 'AMD Ryzen 5 3600X, Intel i5-10600K',
                memory: '16 GB RAM',
                graphics: 'AMD Radeon RX 6800 XT, NVIDIA GeForce RTX 2080',
                storage: '125 GB SSD available space'
            }
        },
        rating: 4.1,
        reviewCount: 2785
    },
    {
        id: 'hollow-knight',
        title: 'Hollow Knight',
        description: 'Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes. Explore twisting caverns, battle tainted creatures and befriend bizarre bugs, all in a classic, hand-drawn 2D style.',
        developer: 'Team Cherry',
        publisher: 'Team Cherry',
        releaseDate: '2017-02-24',
        price: 14.99,
        discountPercent: 0,
        genres: ['Metroidvania', 'Souls-like', 'Action', 'Platformer'],
        tags: ['Metroidvania', 'Souls-like', 'Platformer', 'Difficult', 'Atmospheric'],
        features: ['Single-player', 'Full controller support', 'Steam achievements'],
        images: {
            thumbnail: 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/capsule_616x353.jpg',
            header: 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg',
            screenshots: [
                'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/ss_ec76ccc96c90b28c614a1b87a95669c2fae0d51a.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/ss_9cfd428f15d4075a7bae7a9bc09844c1647612d4.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/ss_0255ca53e2e9d4e3d52639fd4a3c60b24ce98f9f.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/ss_11adcc65f5487b72be3c7f80b8efb5cf4bd7ae22.jpg'
            ]
        },
        videos: ['https://cdn.cloudflare.steamstatic.com/steam/apps/256685445/movie480.webm'],
        systemRequirements: {
            minimum: {
                os: 'Windows 7 (64bit)',
                processor: 'Intel Core 2 Duo E5200',
                memory: '4 GB RAM',
                graphics: 'GeForce 9800GTX+ (1GB)',
                storage: '9 GB available space'
            },
            recommended: {
                os: 'Windows 10 (64bit)',
                processor: 'Intel Core i5',
                memory: '8 GB RAM',
                graphics: 'GeForce GTX 560+',
                storage: '9 GB available space'
            }
        },
        rating: 4.9,
        reviewCount: 7865
    },
    {
        id: 'counter-strike-2',
        title: 'Counter-Strike 2',
        description: 'For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players from across the globe. And now the next chapter in the CS story is about to begin. This is Counter-Strike 2.',
        developer: 'Valve',
        publisher: 'Valve',
        releaseDate: '2023-09-27',
        price: 0,
        discountPercent: 0,
        genres: ['FPS', 'Shooter', 'Multiplayer', 'Competitive'],
        tags: ['FPS', 'Shooter', 'Multiplayer', 'Competitive', 'Team-Based'],
        features: ['Multiplayer', 'PvP', 'Full controller support', 'Steam achievements'],
        images: {
            thumbnail: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/capsule_616x353.jpg',
            header: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
            screenshots: [
                'https://cdn.cloudflare.steamstatic.com/steam/apps/730/ss_2b9e362287b509bb3864fa7bad654fe2fba8936f.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/730/ss_855c016c73e8d96337bc5c76be0214514a2fb606.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/730/ss_74c1a0264ceae4cfee6ad2b3ea884ba62fe42e21.jpg',
                'https://cdn.cloudflare.steamstatic.com/steam/apps/730/ss_cfcbf46896be6643f18cf1a9ea9127b0662e4a2b.jpg'
            ]
        },
        videos: ['https://cdn.cloudflare.steamstatic.com/steam/apps/256950899/movie480_vp9.webm'],
        systemRequirements: {
            minimum: {
                os: 'Windows 10',
                processor: 'Intel Core i5-3470 / AMD FX-8370',
                memory: '8 GB RAM',
                graphics: 'NVIDIA GeForce GTX 780 / AMD Radeon HD 7730',
                storage: '85 GB available space'
            },
            recommended: {
                os: 'Windows 10',
                processor: 'Intel Core i5-10600K / AMD Ryzen 5 3600',
                memory: '12 GB RAM',
                graphics: 'NVIDIA GeForce GTX 1650 / AMD Radeon RX 570',
                storage: '85 GB SSD available space'
            }
        },
        rating: 4.3,
        reviewCount: 12456
    }
];

// Store the game data in localStorage for easier access
localStorage.setItem('gameHubGames', JSON.stringify(gameData));

// Export for module usage (future implementation)
// export default gameData;