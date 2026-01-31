import { prisma } from './libs/prisma.js';

async function main() {
    // Create a new user with a post
    const user = await prisma.user.create({
        data: {
            name: 'Alice',
            email: 'alice@prisma.io',
            posts: {
                create: {
                    title: 'Hello World',
                    content: 'This is my first post!',
                    published: true,
                },
            },
        },
        include: {
            posts: true,
        },
    });

    // Fetch all users with their posts
    const allUsers = await prisma.user.findMany({
        include: {
            posts: true,
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
