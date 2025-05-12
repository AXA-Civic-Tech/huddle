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
      user_id: 1,
      is_issue: false,
      images: null,
      title: "Community Garden Meetup",
      lat_location: 40.7128,
      long_location: -74.006,
      address: "123 Main St, Manhattan",
      borough: "Manhattan",
      zipcode: "10001",
      email: "gardenclub@example.com",
      phone: "555-123-0001",
      status: "Active", // Changed from "active"
      description: "Help us plant vegetables and beautify the garden!",
    },
    {
      user_id: 2,
      is_issue: true,
      images: null,
      title: "Broken Streetlight on Main",
      lat_location: 40.6782,
      long_location: -73.9442,
      address: "456 Flatbush Ave, Brooklyn",
      borough: "Brooklyn",
      zipcode: "11225",
      email: "reporter@example.com",
      phone: "555-234-1111",
      status: "Active", // Changed from "open"
      description:
        "Streetlight has been out for over a week near 3rd and Main.",
    },
    {
      user_id: 3,
      is_issue: false,
      images: null,
      title: "Neighborhood BBQ",
      lat_location: 40.7282,
      long_location: -73.7949,
      address: "789 Queens Blvd, Queens",
      borough: "Queens",
      zipcode: "11373",
      email: "bbqhost@example.com",
      phone: "555-987-6543",
      status: "Active", // Changed from "active"
      description: "Bring your favorite dish and join us for a block party!",
    },
    {
      user_id: 4,
      is_issue: true,
      images: null,
      title: "Trash Overflowing on 6th",
      lat_location: 40.5795,
      long_location: -74.1502,
      address: "321 Richmond Rd, Staten Island",
      borough: "Staten Island",
      zipcode: "10304",
      email: "trashwatch@example.com",
      phone: "555-444-7777",
      status: "Active", // Changed from "reported"
      description: "Multiple bags of trash have been left on the sidewalk.",
    },
    {
      user_id: 5,
      is_issue: false,
      images: null,
      title: "Graffiti Removal Day",
      lat_location: 40.8448,
      long_location: -73.8648,
      address: "654 Bronx River Pkwy, Bronx",
      borough: "Bronx",
      zipcode: "10453",
      email: "cleanup@example.com",
      phone: "555-202-3030",
      status: "Active", // Changed from "active"
      description: "Join us as we clean up graffiti in the underpass.",
    },
    {
      user_id: 6,
      is_issue: true,
      images: null,
      title: "Pothole on 5th Ave",
      lat_location: 40.758,
      long_location: -73.9855,
      address: "Times Square, Manhattan",
      borough: "Manhattan",
      zipcode: "10036",
      email: "potholereport@example.com",
      phone: "555-678-1122",
      status: "Active", // Kept as "open" but standardized capitalization
      description: "Deep pothole damaging cars near 5th and Elm.",
    },
    {
      user_id: 7,
      is_issue: false,
      images: null,
      title: "Park Yoga Session",
      lat_location: 40.67,
      long_location: -73.97,
      address: "Prospect Park, Brooklyn",
      borough: "Brooklyn",
      zipcode: "11225",
      email: "yogaclub@example.com",
      phone: "555-333-1212",
      status: "Active", // Changed from "active"
      description: "Free yoga class in Prospect Park, all levels welcome!",
    },
    {
      user_id: 8,
      is_issue: true,
      images: null,
      title: "Leaking Hydrant",
      lat_location: 40.817,
      long_location: -73.956,
      address: "Lincoln Ave, Bronx",
      borough: "Bronx",
      zipcode: "10461",
      email: "hydrantwatch@example.com",
      phone: "555-222-0909",
      status: "Active", // Kept as "in_progress" but standardized format
      description: "Fire hydrant leaking water constantly near Lincoln Ave.",
    },
    {
      user_id: 9,
      is_issue: false,
      images: null,
      title: "Local History Walking Tour",
      lat_location: 40.7359,
      long_location: -74.0036,
      address: "14th St & 8th Ave, Manhattan",
      borough: "Manhattan",
      zipcode: "10014",
      email: "historytour@example.com",
      phone: "555-101-2020",
      status: "Active", // Changed from "active"
      description: "Explore the neighborhood's hidden historical gems!",
    },
    {
      user_id: 10,
      is_issue: true,
      images: null,
      title: "Uncollected Bulk Trash",
      lat_location: 40.748,
      long_location: -73.9692,
      address: "2nd Ave & 34th St, Manhattan",
      borough: "Manhattan",
      zipcode: "10016",
      email: "bulkwatch@example.com",
      phone: "555-565-8585",
      status: "Active", // Changed from "reported"
      description: "Furniture and mattresses still on curb after pickup day.",
    },
    {
      user_id: 1,
      is_issue: false,
      images: null,
      title: "Street Food Festival",
      lat_location: 40.7295,
      long_location: -73.9965,
      address: "Washington Square Park, Manhattan",
      borough: "Manhattan",
      zipcode: "10012",
      email: "streetfood@example.com",
      phone: "555-987-5432",
      status: "Active", // Changed from "active"
      description:
        "Join us for a delicious street food festival in the heart of the city!",
    },
    {
      user_id: 2,
      is_issue: false,
      images: null,
      title: "Homeless Shelter Volunteer Drive",
      lat_location: 40.7115,
      long_location: -74.0125,
      address: "Battery Park, Manhattan",
      borough: "Manhattan",
      zipcode: "10004",
      email: "volunteer@example.com",
      phone: "555-987-3210",
      status: "Active", // Changed from "active"
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
