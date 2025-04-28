/**
 * GameHub - User Data
 * Mock user data for simulating user accounts in the GameHub application
 */

const userData = [
    {
        id: 'user1',
        username: 'GamerHero42',
        email: 'gamerhero42@example.com',
        password: 'hashed_password', // In a real app, passwords would be securely hashed
        profileName: 'The Hero',
        avatar: 'https://i.pravatar.cc/150?img=11',
        joinDate: '2022-02-15',
        level: 42,
        ownedGames: ['cyberpunk-2077', 'elden-ring', 'god-of-war', 'stardew-valley', 'counter-strike-2'],
        wishlist: ['hogwarts-legacy', 'starfield', 'final-fantasy-xvi'],
        friends: ['user2', 'user3', 'user5'],
        cart: [],
        purchaseHistory: [
            {
                orderId: 'ORD-2023-001',
                date: '2023-12-15',
                games: ['cyberpunk-2077', 'elden-ring'],
                totalAmount: 119.98
            },
            {
                orderId: 'ORD-2023-002',
                date: '2023-06-22',
                games: ['god-of-war'],
                totalAmount: 49.99
            }
        ],
        reviews: ['review1', 'review3', 'review5'],
        badges: ['early-adopter', '100-games-owned', 'community-leader'],
        status: 'online'
    },
    {
        id: 'user2',
        username: 'NoobMaster69',
        email: 'noobmaster@example.com',
        password: 'hashed_password',
        profileName: 'Noob Master',
        avatar: 'https://i.pravatar.cc/150?img=12',
        joinDate: '2022-04-10',
        level: 35,
        ownedGames: ['counter-strike-2', 'stardew-valley', 'hollow-knight', 'red-dead-redemption-2'],
        wishlist: ['elden-ring', 'baldurs-gate-3', 'cyberpunk-2077'],
        friends: ['user1', 'user4', 'user7'],
        cart: ['elden-ring'],
        purchaseHistory: [
            {
                orderId: 'ORD-2023-003',
                date: '2023-11-05',
                games: ['hollow-knight', 'stardew-valley'],
                totalAmount: 29.98
            }
        ],
        reviews: ['review2', 'review6'],
        badges: ['social-butterfly', 'achievement-hunter'],
        status: 'offline'
    },
    {
        id: 'user3',
        username: 'ElderScrollsFan',
        email: 'elder.scrolls@example.com',
        password: 'hashed_password',
        profileName: 'Dragonborn',
        avatar: 'https://i.pravatar.cc/150?img=13',
        joinDate: '2021-07-22',
        level: 67,
        ownedGames: ['red-dead-redemption-2', 'the-witcher-3', 'elden-ring', 'baldurs-gate-3', 'starfield'],
        wishlist: ['hogwarts-legacy'],
        friends: ['user1', 'user5', 'user8'],
        cart: [],
        purchaseHistory: [
            {
                orderId: 'ORD-2022-001',
                date: '2022-08-15',
                games: ['the-witcher-3', 'red-dead-redemption-2'],
                totalAmount: 69.98
            },
            {
                orderId: 'ORD-2023-004',
                date: '2023-08-04',
                games: ['baldurs-gate-3'],
                totalAmount: 59.99
            },
            {
                orderId: 'ORD-2023-005',
                date: '2023-09-07',
                games: ['starfield'],
                totalAmount: 69.99
            }
        ],
        reviews: ['review4', 'review7'],
        badges: ['rpg-master', 'early-adopter', '100-games-owned', 'big-spender'],
        status: 'in-game'
    },
    {
        id: 'user4',
        username: 'IndieGameDev',
        email: 'indie.dev@example.com',
        password: 'hashed_password',
        profileName: 'Indie Developer',
        avatar: 'https://i.pravatar.cc/150?img=14',
        joinDate: '2022-01-05',
        level: 28,
        ownedGames: ['stardew-valley', 'hollow-knight'],
        wishlist: ['counter-strike-2', 'elden-ring'],
        friends: ['user2', 'user6'],
        cart: ['cyberpunk-2077'],
        purchaseHistory: [
            {
                orderId: 'ORD-2022-002',
                date: '2022-02-25',
                games: ['hollow-knight'],
                totalAmount: 14.99
            }
        ],
        reviews: ['review8'],
        badges: ['indie-supporter', 'game-developer'],
        status: 'away'
    },
    {
        id: 'user5',
        username: 'FPSmaster',
        email: 'fps.master@example.com',
        password: 'hashed_password',
        profileName: 'Headshot Pro',
        avatar: 'https://i.pravatar.cc/150?img=15',
        joinDate: '2021-10-18',
        level: 73,
        ownedGames: ['counter-strike-2'],
        wishlist: ['cyberpunk-2077', 'starfield'],
        friends: ['user1', 'user3', 'user7'],
        cart: [],
        purchaseHistory: [],
        reviews: ['review9'],
        badges: ['fps-champion', 'competitive-player'],
        status: 'in-game'
    },
    {
        id: 'user6',
        username: 'StoryGamer',
        email: 'story.gamer@example.com',
        password: 'hashed_password',
        profileName: 'Narrative Explorer',
        avatar: 'https://i.pravatar.cc/150?img=16',
        joinDate: '2022-06-30',
        level: 31,
        ownedGames: ['red-dead-redemption-2', 'god-of-war', 'the-witcher-3', 'horizon-forbidden-west'],
        wishlist: ['baldurs-gate-3', 'final-fantasy-xvi'],
        friends: ['user4', 'user8'],
        cart: ['final-fantasy-xvi'],
        purchaseHistory: [
            {
                orderId: 'ORD-2022-003',
                date: '2022-07-15',
                games: ['god-of-war', 'the-witcher-3'],
                totalAmount: 59.98
            },
            {
                orderId: 'ORD-2023-006',
                date: '2023-03-22',
                games: ['red-dead-redemption-2'],
                totalAmount: 29.99
            },
            {
                orderId: 'ORD-2023-007',
                date: '2023-10-10',
                games: ['horizon-forbidden-west'],
                totalAmount: 54.99
            }
        ],
        reviews: ['review10', 'review11'],
        badges: ['story-lover', 'completionist'],
        status: 'online'
    },
    {
        id: 'user7',
        username: 'CasualPlayerX',
        email: 'casual.player@example.com',
        password: 'hashed_password',
        profileName: 'Weekend Warrior',
        avatar: 'https://i.pravatar.cc/150?img=17',
        joinDate: '2023-01-12',
        level: 15,
        ownedGames: ['stardew-valley', 'hollow-knight'],
        wishlist: ['hogwarts-legacy'],
        friends: ['user2', 'user5'],
        cart: ['hogwarts-legacy'],
        purchaseHistory: [
            {
                orderId: 'ORD-2023-008',
                date: '2023-02-05',
                games: ['stardew-valley'],
                totalAmount: 14.99
            },
            {
                orderId: 'ORD-2023-009',
                date: '2023-07-18',
                games: ['hollow-knight'],
                totalAmount: 14.99
            }
        ],
        reviews: ['review12'],
        badges: ['casual-gamer'],
        status: 'offline'
    },
    {
        id: 'user8',
        username: 'RPGwizard',
        email: 'rpg.wizard@example.com',
        password: 'hashed_password',
        profileName: 'Dragon Slayer',
        avatar: 'https://i.pravatar.cc/150?img=18',
        joinDate: '2021-05-10',
        level: 82,
        ownedGames: ['elden-ring', 'baldurs-gate-3', 'the-witcher-3', 'final-fantasy-xvi', 'hogwarts-legacy'],
        wishlist: ['starfield'],
        friends: ['user3', 'user6'],
        cart: [],
        purchaseHistory: [
            {
                orderId: 'ORD-2022-004',
                date: '2022-03-01',
                games: ['the-witcher-3'],
                totalAmount: 39.99
            },
            {
                orderId: 'ORD-2022-005',
                date: '2022-05-15',
                games: ['elden-ring'],
                totalAmount: 59.99
            },
            {
                orderId: 'ORD-2023-010',
                date: '2023-08-05',
                games: ['baldurs-gate-3'],
                totalAmount: 59.99
            },
            {
                orderId: 'ORD-2023-011',
                date: '2023-03-10',
                games: ['hogwarts-legacy'],
                totalAmount: 59.99
            },
            {
                orderId: 'ORD-2024-001',
                date: '2024-03-03',
                games: ['final-fantasy-xvi'],
                totalAmount: 69.99
            }
        ],
        reviews: ['review13', 'review14', 'review15'],
        badges: ['rpg-master', 'adventure-seeker', 'big-spender', '100-games-owned'],
        status: 'online'
    }
];

// Format for display or simulation purposes
const formatUserData = (user) => {
    // Remove sensitive information like password and email for display
    const { password, email, ...displayUser } = user;
    return displayUser;
};

// Get current user (for simulation)
const getCurrentUser = () => {
    // In a real app, this would check authentication
    const storedUserId = localStorage.getItem('currentUserId');
    if (storedUserId) {
        const user = userData.find(u => u.id === storedUserId);
        if (user) {
            return formatUserData(user);
        }
    }
    return null;
};

// Set current user (for simulation)
const setCurrentUser = (userId) => {
    if (userData.some(u => u.id === userId)) {
        localStorage.setItem('currentUserId', userId);
        return true;
    }
    return false;
};

// Clear current user (logout)
const clearCurrentUser = () => {
    localStorage.removeItem('currentUserId');
};

// Store the user data in localStorage for easier access
localStorage.setItem('gameHubUsers', JSON.stringify(userData));

// Export for module usage (future implementation)
// export { userData, getCurrentUser, setCurrentUser, clearCurrentUser };