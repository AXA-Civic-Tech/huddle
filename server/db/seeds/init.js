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
  await knex("upvote").del();
  await knex.raw("ALTER SEQUENCE upvote_id_seq RESTART WITH 1");

  await knex("comments").del();
  await knex.raw("ALTER SEQUENCE comments_id_seq RESTART WITH 1");

  await knex("event").del();
  await knex.raw("ALTER SEQUENCE event_id_seq RESTART WITH 1");

  await knex("users").del();
  await knex.raw("ALTER SEQUENCE users_id_seq RESTART WITH 1");

  // ========= 2. Create users =========
  await User.create("cool_cat", "1234", {
    email: "coolcat@example.com",
    first_name: "Cool",
    last_name: "Cat",
  });
  await User.create("l33t-guy", "1234", {
    email: "leet@example.com",
    first_name: "Leet",
    last_name: "Guy",
  });
  await User.create("wowow", "1234", {
    email: "wowow@example.com",
    first_name: "Wo",
    last_name: "Wow",
  });
  await User.create("sunny_bunny", "carrots123", {
    email: "sunnybunny@example.com",
    first_name: "Sunny",
    last_name: "Bunny",
  });
  await User.create("techno_tiger", "meowmix456", {
    email: "technotiger@example.com",
    first_name: "Techno",
    last_name: "Tiger",
  });
  await User.create("jazzy_jelly", "groove789", {
    email: "jazzyjelly@example.com",
    first_name: "Jazzy",
    last_name: "Jelly",
  });
  await User.create("noodle_fox", "ramen4life", {
    email: "noodlefox@example.com",
    first_name: "Noodle",
    last_name: "Fox",
  });
  await User.create("rocket_raccoon", "spacebandit", {
    email: "rocketraccoon@example.com",
    first_name: "Rocket",
    last_name: "Raccoon",
  });
  await User.create("maple_moose", "canadadry", {
    email: "maplemoose@example.com",
    first_name: "Maple",
    last_name: "Moose",
  });
  await User.create("puzzle_penguin", "icebreaker99", {
    email: "puzzlepenguin@example.com",
    first_name: "Puzzle",
    last_name: "Penguin",
  });

  // ========= 3. Create events =========
  const events = [
    {
      title: "Community Garden Meetup",
      description: "Help us plant vegetables and beautify the garden!",
      user_id: 1,
      is_issue: false,
      email: "gardenclub@example.com",
      phone: "555-123-0001",
      status: "active",
      lat_location: 40.7128,
      long_location: -74.006,
      address: "123 Main St, Manhattan",
      borough: "Manhattan",
    },
    {
      title: "Broken Streetlight on Main",
      description: "Streetlight has been out for over a week near 3rd and Main.",
      user_id: 2,
      is_issue: true,
      email: "reporter@example.com",
      phone: "555-234-1111",
      status: "open",
      lat_location: 40.6782,
      long_location: -73.9442,
      address: "456 Flatbush Ave, Brooklyn",
      borough: "Brooklyn",
    },
    {
      title: "Neighborhood BBQ",
      description: "Bring your favorite dish and join us for a block party!",
      user_id: 3,
      is_issue: false,
      email: "bbqhost@example.com",
      phone: "555-987-6543",
      status: "active",
      lat_location: 40.7282,
      long_location: -73.7949,
      address: "789 Queens Blvd, Queens",
      borough: "Queens",
    },
    {
      title: "Trash Overflowing on 6th",
      description: "Multiple bags of trash have been left on the sidewalk.",
      user_id: 4,
      is_issue: true,
      email: "trashwatch@example.com",
      phone: "555-444-7777",
      status: "reported",
      lat_location: 40.5795,
      long_location: -74.1502,
      address: "321 Richmond Rd, Staten Island",
      borough: "Staten Island",
    },
    {
      title: "Graffiti Removal Day",
      description: "Join us as we clean up graffiti in the underpass.",
      user_id: 5,
      is_issue: false,
      email: "cleanup@example.com",
      phone: "555-202-3030",
      status: "active",
      lat_location: 40.8448,
      long_location: -73.8648,
      address: "654 Bronx River Pkwy, Bronx",
      borough: "Bronx",
    },
    {
      title: "Pothole on 5th Ave",
      description: "Deep pothole damaging cars near 5th and Elm.",
      user_id: 6,
      is_issue: true,
      email: "potholereport@example.com",
      phone: "555-678-1122",
      status: "open",
      lat_location: 40.758,
      long_location: -73.9855,
      address: "Times Square, Manhattan",
      borough: "Manhattan",
    },
    {
      title: "Park Yoga Session",
      description: "Free yoga class in Prospect Park, all levels welcome!",
      user_id: 7,
      is_issue: false,
      email: "yogaclub@example.com",
      phone: "555-333-1212",
      status: "active",
      lat_location: 40.6700,
      long_location: -73.9700,
      address: "Prospect Park, Brooklyn",
      borough: "Brooklyn",
    },
    {
      title: "Leaking Hydrant",
      description: "Fire hydrant leaking water constantly near Lincoln Ave.",
      user_id: 8,
      is_issue: true,
      email: "hydrantwatch@example.com",
      phone: "555-222-0909",
      status: "in_progress",
      lat_location: 40.8170,
      long_location: -73.9560,
      address: "Lincoln Ave, Bronx",
      borough: "Bronx",
    },
    {
      title: "Local History Walking Tour",
      description: "Explore the neighborhood’s hidden historical gems!",
      user_id: 9,
      is_issue: false,
      email: "historytour@example.com",
      phone: "555-101-2020",
      status: "active",
      lat_location: 40.7359,
      long_location: -74.0036,
      address: "14th St & 8th Ave, Manhattan",
      borough: "Manhattan",
    },
    {
      title: "Uncollected Bulk Trash",
      description: "Furniture and mattresses still on curb after pickup day.",
      user_id: 10,
      is_issue: true,
      email: "bulkwatch@example.com",
      phone: "555-565-8585",
      status: "reported",
      lat_location: 40.7480,
      long_location: -73.9692,
      address: "2nd Ave & 34th St, Manhattan",
      borough: "Manhattan",
    },
    {
      title: "Street Food Festival",
      description: "Join us for a delicious street food festival in the heart of the city!",
      user_id: 1,
      is_issue: false,
      email: "streetfood@example.com",
      phone: "555-987-5432",
      status: "active",
      lat_location: 40.7295,
      long_location: -73.9965,
      address: "Washington Square Park, Manhattan",
      borough: "Manhattan",
    },
    {
      title: "Homeless Shelter Volunteer Drive",
      description: "Help us collect items for homeless shelters across the city.",
      user_id: 2,
      is_issue: false,
      email: "volunteer@example.com",
      phone: "555-987-3210",
      status: "active",
      lat_location: 40.7115,
      long_location: -74.0125,
      address: "Battery Park, Manhattan",
      borough: "Manhattan",
    },
  ];

  // Insert events into the database
  for (let event of events) {
    await knex("event").insert({
      title: event.title,
      description: event.description,
      date_created: knex.fn.now(),
      user_id: event.user_id,
      is_issue: event.is_issue,
      email: event.email,
      phone: event.phone,
      status: event.status,
      lat_location: event.lat_location,
      long_location: event.long_location,
      address: event.address,
      borough: event.borough,
    });
  }

  // ========= 4. Create comments =========
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
    "I’ll definitely participate!",
  ];

  const createdEvents = await knex("event").select("id");
  for (let i = 0; i < createdEvents.length; i++) {
    await Comment.create({
      user_id: ((i + 3) % 10) + 1,
      contents: commentContents[i % commentContents.length],
      event_id: createdEvents[i].id,
    });
  }

  // ========= 5. Create upvotes =========
  for (let i = 0; i < createdEvents.length; i++) {
    await Upvote.create({
      user_id: (i + 2) % 10 + 1,
      event_id: createdEvents[i].id,
    });
  }
};
