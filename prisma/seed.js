const prisma = require("../prisma");
const { faker } = require("@faker-js/faker");
const seed = async (numUsers = 3, numPlaylists = 5) => {
for (let i = 0; i < numUsers; i++) {
        const playList = Array.from({ length: numPlaylists }, (_,j) => ({
            name: `Person ${i}${j}`,
            description: `${i}${j}`,
        }));
    
    await prisma.user.create({
        data: {
            username: faker.company.buzzAdjective() + " " + faker.company.buzzNoun(),
            playlists: {
                create: playList,
            },
        },
    });
}
};



seed()
.then(async () => await prisma.$disconnect())
.catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});