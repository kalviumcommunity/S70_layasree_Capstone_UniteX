const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const DB_FILE = path.join(__dirname, "../mock_db.json");

async function seed() {
  const adminHash = await bcrypt.hash("admin123", 10);
  const orgHash = await bcrypt.hash("organizer123", 10);
  const userHash = await bcrypt.hash("user123", 10);

  const adminId = "admin001";
  const org1Id = "org001";
  const user1Id = "user001";

  const now = new Date().toISOString();

  const db = {
    users: [
      {
        _id: adminId,
        username: "admin",
        email: "admin@unitex.com",
        password: adminHash,
        role: "admin",
        createdAt: now,
        updatedAt: now
      },
      {
        _id: org1Id,
        username: "organizer1",
        email: "organizer1@unitex.com",
        password: orgHash,
        role: "organizer",
        createdAt: now,
        updatedAt: now
      },
      {
        _id: user1Id,
        username: "user1",
        email: "user1@unitex.com",
        password: userHash,
        role: "user",
        createdAt: now,
        updatedAt: now
      }
    ],
    events: [
      {
        _id: "evt001",
        title: "TechFest 2025 — Annual Tech Conference",
        description: "Join us for a day filled with inspiring talks from industry leaders, hands-on workshops, and amazing networking opportunities. Topics include AI/ML, Web3, Cloud Computing, and DevOps.\n\nExpect world-class speakers from top companies sharing the latest trends shaping the future of technology.",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Hyderabad International Convention Centre, Hyderabad",
        category: "Conference",
        imageUrl: "",
        maxCapacity: 500,
        organizer: org1Id,
        rsvps: [user1Id],
        createdAt: now,
        updatedAt: now
      },
      {
        _id: "evt002",
        title: "Summer Music Festival 2025",
        description: "A vibrant outdoor music festival featuring live performances from top local and international artists across three stages. Experience an unforgettable evening of indie rock, electronic beats, and acoustic performances under the stars.\n\nFood trucks, art installations, and activities for all ages!",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Necklace Road, Hussain Sagar Lake, Hyderabad",
        category: "Festival",
        imageUrl: "",
        maxCapacity: 2000,
        organizer: org1Id,
        rsvps: [],
        createdAt: now,
        updatedAt: now
      },
      {
        _id: "evt003",
        title: "Startup Pitch Night — Demo Day",
        description: "Watch 10 handpicked startups pitch their innovative ideas to a panel of VCs and angel investors. Network with founders, investors, and tech enthusiasts in an electrifying atmosphere.\n\nDoors open at 6 PM. Light refreshments provided.",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        location: "T-Hub, Raidurgam, Hyderabad",
        category: "Corporate",
        imageUrl: "",
        maxCapacity: 200,
        organizer: org1Id,
        rsvps: [],
        createdAt: now,
        updatedAt: now
      },
      {
        _id: "evt004",
        title: "Classical Carnatic Music Concert",
        description: "A mesmerizing evening of classical Carnatic music performed by renowned vocalist Pandit Suresh Kumar and accompanying musicians. Relive the rich heritage of Indian classical music in an intimate venue setting.",
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Ravindra Bharathi Auditorium, Hyderabad",
        category: "Concert",
        imageUrl: "",
        maxCapacity: 800,
        organizer: org1Id,
        rsvps: [],
        createdAt: now,
        updatedAt: now
      },
      {
        _id: "evt005",
        title: "Wedding Reception — Priya & Arjun",
        description: "Celebrate the union of Priya and Arjun with an elegant wedding reception. Guests are invited for an evening of dinner, dancing, and memorable celebrations.\n\nBlack-tie optional. RSVP by 15th July 2025.",
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Taj Krishna Hotel, Banjara Hills, Hyderabad",
        category: "Wedding",
        imageUrl: "",
        maxCapacity: 300,
        organizer: org1Id,
        rsvps: [],
        createdAt: now,
        updatedAt: now
      },
      {
        _id: "evt006",
        title: "Photography Workshop: Mastering DSLR",
        description: "A beginner to intermediate workshop covering composition, lighting, depth of field, and post-processing techniques. Bring your camera and leave with portfolio-worthy shots!\n\nLimited seats. Hands-on practice in a guided outdoor session included.",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Golconda Fort, Hyderabad",
        category: "Other",
        imageUrl: "",
        maxCapacity: 30,
        organizer: org1Id,
        rsvps: [],
        createdAt: now,
        updatedAt: now
      }
    ],
    bookings: [],
    messages: []
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  console.log("✅ Database seeded successfully!");
  console.log("\nTest Credentials:");
  console.log("  Admin:     admin@unitex.com / admin123");
  console.log("  Organizer: organizer1@unitex.com / organizer123");
  console.log("  User:      user1@unitex.com / user123");
}

seed().catch(console.error);
