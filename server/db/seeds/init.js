const User = require("../../models/User");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const Upvote = require("../../models/Upvote");

/**
 * @param { import("knex").Knex }
 * @returns { Promise<void> }
 */
exports.seed = async (knex) => {
  // ========= 1. Clear and reset all tables =========
  // Drop in reverse order of dependency (same as migrations down function)
  await knex("upvote").del();
  await knex.raw("ALTER SEQUENCE upvote_id_seq RESTART WITH 1");

  await knex("comments").del();
  await knex.raw("ALTER SEQUENCE comments_id_seq RESTART WITH 1");

  await knex("event").del();
  await knex.raw("ALTER SEQUENCE event_id_seq RESTART WITH 1");

  await knex("users").del();
  await knex.raw("ALTER SEQUENCE users_id_seq RESTART WITH 1");

  // ========= 2. Create users =========
  // User table fields in order: id, first_name, last_name, email, username, password_hash
  await User.create("cool_cat", "1234", {
    first_name: "Cool",
    last_name: "Cat",
    email: "coolcat@example.com",
  });
  await User.create("l33t-guy", "1234", {
    first_name: "Leet",
    last_name: "Guy",
    email: "leet@example.com",
  });
  await User.create("wowow", "1234", {
    first_name: "Wo",
    last_name: "Wow",
    email: "wowow@example.com",
  });
  await User.create("sunny_bunny", "carrots123", {
    first_name: "Sunny",
    last_name: "Bunny",
    email: "sunnybunny@example.com",
  });
  await User.create("techno_tiger", "meowmix456", {
    first_name: "Techno",
    last_name: "Tiger",
    email: "technotiger@example.com",
  });
  await User.create("jazzy_jelly", "groove789", {
    first_name: "Jazzy",
    last_name: "Jelly",
    email: "jazzyjelly@example.com",
  });
  await User.create("noodle_fox", "ramen4life", {
    first_name: "Noodle",
    last_name: "Fox",
    email: "noodlefox@example.com",
  });
  await User.create("rocket_raccoon", "spacebandit", {
    first_name: "Rocket",
    last_name: "Raccoon",
    email: "rocketraccoon@example.com",
  });
  await User.create("maple_moose", "canadadry", {
    first_name: "Maple",
    last_name: "Moose",
    email: "maplemoose@example.com",
  });
  await User.create("puzzle_penguin", "icebreaker99", {
    first_name: "Puzzle",
    last_name: "Penguin",
    email: "puzzlepenguin@example.com",
  });

  // ========= 3. Create events =========
  // Event table fields in order: id, user_id, date_created, is_issue, images, title,
  // lat_location, long_location, address, borough, zipcode, email, phone, status, description
  const events = [
    {
      id: 1,
      user_id: 1,
      date_created: "2025-04-15T14:30:00Z",
      is_issue: false,
      images: [
        "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=600&h=400&fit=crop",
      ],
      title: "Community Garden Meetup",
      lat_location: 40.7128,
      long_location: -74.006,
      address: "321 West 23rd Street",
      borough: "Manhattan",
      zipcode: "10011",
      email: "gardenclub@example.com",
      phone: "555-123-0001",
      status: "Active",
      description: "Help us plant vegetables and beautify the garden!",
    },
    {
      id: 2,
      user_id: 2,
      date_created: "2025-05-01T09:15:00Z",
      is_issue: true,
      images: [
        "https://images.unsplash.com/photo-1544733422-251e532ca221?w=600&h=400&fit=crop",
      ],
      title: "Broken Streetlight on Eastern Parkway",
      lat_location: 40.6782,
      long_location: -73.9442,
      address: "456 Eastern Parkway",
      borough: "Brooklyn",
      zipcode: "11225",
      email: "reporter@example.com",
      phone: "555-234-1111",
      status: "Active",
      description:
        "Streetlight has been out for over a week near Bedford Ave intersection.",
    },
    {
      id: 3,
      user_id: 3,
      date_created: "2025-05-10T16:45:00Z",
      is_issue: false,
      images: [
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop",
      ],
      title: "Neighborhood BBQ",
      lat_location: 40.7282,
      long_location: -73.7949,
      address: "87-34 Queens Boulevard",
      borough: "Queens",
      zipcode: "11373",
      email: "bbqhost@example.com",
      phone: "555-987-6543",
      status: "Active",
      description: "Bring your favorite dish and join us for a block party!",
    },
    {
      id: 4,
      user_id: 4,
      date_created: "2025-04-28T11:20:00Z",
      is_issue: true,
      images: [
        "https://images.unsplash.com/photo-1605600659876-5b2cf235bd3d?w=600&h=400&fit=crop",
      ],
      title: "Trash Overflowing on Victory Boulevard",
      lat_location: 40.5795,
      long_location: -74.1502,
      address: "321 Victory Boulevard",
      borough: "Staten Island",
      zipcode: "10301",
      email: "trashwatch@example.com",
      phone: "555-444-7777",
      status: "Active",
      description:
        "Multiple bags of trash have been left on the sidewalk for days.",
    },
    {
      id: 5,
      user_id: 5,
      date_created: "2025-05-02T13:00:00Z",
      is_issue: false,
      images: [
        "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=600&h=400&fit=crop",
      ],
      title: "Graffiti Removal Day",
      lat_location: 40.8448,
      long_location: -73.8648,
      address: "1460 Grand Concourse",
      borough: "Bronx",
      zipcode: "10456",
      email: "cleanup@example.com",
      phone: "555-202-3030",
      status: "Active",
      description:
        "Join us as we clean up graffiti in the 167th Street underpass.",
    },
    {
      id: 6,
      user_id: 6,
      date_created: "2025-05-08T08:30:00Z",
      is_issue: true,
      images: [
        "https://images.unsplash.com/photo-1597421744523-4951d8e65a3a?w=600&h=400&fit=crop",
      ],
      title: "Pothole on 5th Ave",
      lat_location: 40.758,
      long_location: -73.9855,
      address: "1552 5th Avenue",
      borough: "Manhattan",
      zipcode: "10036",
      email: "potholereport@example.com",
      phone: "555-678-1122",
      status: "Active",
      description: "Deep pothole damaging cars near 46th Street intersection.",
    },
    {
      id: 7,
      user_id: 7,
      date_created: "2025-05-12T07:00:00Z",
      is_issue: false,
      images: [
        "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&h=400&fit=crop",
      ],
      title: "Park Yoga Session",
      lat_location: 40.67,
      long_location: -73.97,
      address: "95 Prospect Park West",
      borough: "Brooklyn",
      zipcode: "11215",
      email: "yogaclub@example.com",
      phone: "555-333-1212",
      status: "Active",
      description: "Free yoga class in Prospect Park, all levels welcome!",
    },
    {
      id: 8,
      user_id: 8,
      date_created: "2025-04-25T15:15:00Z",
      is_issue: true,
      images: [
        "https://images.unsplash.com/photo-1530099486328-e021101a494a?w=600&h=400&fit=crop",
      ],
      title: "Leaking Hydrant",
      lat_location: 40.817,
      long_location: -73.956,
      address: "2341 Westchester Avenue",
      borough: "Bronx",
      zipcode: "10461",
      email: "hydrantwatch@example.com",
      phone: "555-222-0909",
      status: "Active",
      description:
        "Fire hydrant leaking water constantly near Castle Hill Avenue.",
    },
    {
      id: 9,
      user_id: 9,
      date_created: "2025-05-13T10:00:00Z",
      is_issue: false,
      images: [
        "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=600&h=400&fit=crop",
      ],
      title: "Local History Walking Tour",
      lat_location: 40.7359,
      long_location: -74.0036,
      address: "75 9th Avenue",
      borough: "Manhattan",
      zipcode: "10011",
      email: "historytour@example.com",
      phone: "555-101-2020",
      status: "Active",
      description: "Explore the Meatpacking District's hidden historical gems!",
    },
    {
      id: 10,
      user_id: 10,
      date_created: "2025-05-06T12:45:00Z",
      is_issue: true,
      images: [
        "https://images.unsplash.com/photo-1563477710521-5a8a3587767b?w=600&h=400&fit=crop",
      ],
      title: "Uncollected Bulk Trash",
      lat_location: 40.748,
      long_location: -73.9692,
      address: "685 2nd Avenue",
      borough: "Manhattan",
      zipcode: "10016",
      email: "bulkwatch@example.com",
      phone: "555-565-8585",
      status: "Active",
      description: "Furniture and mattresses still on curb after pickup day.",
    },
    {
      id: 11,
      user_id: 1,
      date_created: "2025-05-15T11:30:00Z",
      is_issue: false,
      images: [
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop",
      ],
      title: "Street Food Festival",
      lat_location: 40.7295,
      long_location: -73.9965,
      address: "5 Washington Square North",
      borough: "Manhattan",
      zipcode: "10012",
      email: "streetfood@example.com",
      phone: "555-987-5432",
      status: "Active",
      description:
        "Join us for a delicious street food festival in the heart of the city!",
    },
    {
      id: 12,
      user_id: 2,
      date_created: "2025-05-09T09:00:00Z",
      is_issue: false,
      images: [
        "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?w=600&h=400&fit=crop",
      ],
      title: "Homeless Shelter Volunteer Drive",
      lat_location: 40.7115,
      long_location: -74.0125,
      address: "17 State Street",
      borough: "Manhattan",
      zipcode: "10004",
      email: "volunteer@example.com",
      phone: "555-987-3210",
      status: "Active",
      description:
        "Help us collect items for homeless shelters across the city.",
    },
  ];

  for (let event of events) {
    await knex("event").insert({
      user_id: event.user_id,
      date_created: knex.fn.now(),
      is_issue: event.is_issue,
      images: event.images,
      title: event.title,
      lat_location: event.lat_location,
      long_location: event.long_location,
      address: event.address,
      borough: event.borough,
      zipcode: event.zipcode,
      email: event.email,
      phone: event.phone,
      status: event.status,
      description: event.description,
    });
  }

  // ========= 4. Create comments =========
  // Comments table fields in order: id, event_id, user_id, contents, time
  const commentContents = [
    "Excited to join!",
    "This definitely needs fixing.",
    "Love this idea!",
    "I saw this issue too.",
    "I'll bring snacks.",
    "Count me in!",
    "Hope it's resolved soon.",
    "Great initiative.",
    "I'll spread the word.",
    "This has been bothering me for days!",
    "Can't wait for this event!",
    "I'll definitely participate!",
  ];

  const createdEvents = await knex("event").select("id");
  for (let i = 0; i < createdEvents.length; i++) {
    await Comment.create({
      event_id: createdEvents[i].id,
      user_id: ((i + 3) % 10) + 1,
      contents: commentContents[i % commentContents.length],
      time: knex.fn.now(),
    });
  }

  // ========= 5. Create upvotes =========
  // Upvote table fields in order: id, event_id, user_id, favorited_time
  for (let i = 0; i < createdEvents.length; i++) {
    await Upvote.create({
      event_id: createdEvents[i].id,
      user_id: ((i + 2) % 10) + 1,
      favorited_time: knex.fn.now(),
    });
  }
};
