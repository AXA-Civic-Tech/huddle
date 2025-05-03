const User = require("../../models/User");
const Post = require("../../models/Post");

/**
 * @param { import("knex").Knex }
 * @returns { Promise<void> }
 */
exports.seed = async (knex) => {
  //clear and reset users table
  await knex("users").del();
  await knex.raw("ALTER SEQUENCE users_id_seq RESTART WITH 1");

  //clear and reset events table
  await knex("event").del();
  await knex.raw("ALTER SEQUENCE event_id_seq RESTART WITH 1");

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

  await Post.create({
    title: "Community Garden Meetup",
    description: "Help us plant vegetables and beautify the garden!",
    user_id: 1,
    is_issue: false,
    email: "gardenclub@example.com",
    phone: "555-123-0001",
    status: "active",
  });

  await Post.create({
    title: "Broken Streetlight on Main",
    description: "Streetlight has been out for over a week near 3rd and Main.",
    user_id: 2,
    is_issue: true,
    email: "reporter@example.com",
    phone: "555-234-1111",
    status: "open",
  });

  await Post.create({
    title: "Neighborhood BBQ",
    description: "Bring your favorite dish and join us for a block party!",
    user_id: 3,
    is_issue: false,
    email: "bbqhost@example.com",
    phone: "555-987-6543",
    status: "active",
  });

  await Post.create({
    title: "Trash Overflowing on 6th",
    description: "Multiple bags of trash have been left on the sidewalk.",
    user_id: 4,
    is_issue: true,
    email: "trashwatch@example.com",
    phone: "555-444-7777",
    status: "reported",
  });

  await Post.create({
    title: "Graffiti Removal Day",
    description: "Join us as we clean up graffiti in the underpass.",
    user_id: 5,
    is_issue: false,
    email: "cleanup@example.com",
    phone: "555-202-3030",
    status: "active",
  });

  await Post.create({
    title: "Pothole on 5th Ave",
    description: "Deep pothole damaging cars near 5th and Elm.",
    user_id: 6,
    is_issue: true,
    email: "potholereport@example.com",
    phone: "555-678-1122",
    status: "open",
  });

  await Post.create({
    title: "Park Yoga Session",
    description: "Free yoga class in Prospect Park, all levels welcome!",
    user_id: 7,
    is_issue: false,
    email: "yogaclub@example.com",
    phone: "555-333-1212",
    status: "active",
  });

  await Post.create({
    title: "Leaking Hydrant",
    description: "Fire hydrant leaking water constantly near Lincoln Ave.",
    user_id: 8,
    is_issue: true,
    email: "hydrantwatch@example.com",
    phone: "555-222-0909",
    status: "in_progress",
  });

  await Post.create({
    title: "Local History Walking Tour",
    description: "Explore the neighborhood’s hidden historical gems!",
    user_id: 9,
    is_issue: false,
    email: "historytour@example.com",
    phone: "555-101-2020",
    status: "active",
  });

  await Post.create({
    title: "Uncollected Bulk Trash",
    description: "Furniture and mattresses still on curb after pickup day.",
    user_id: 10,
    is_issue: true,
    email: "bulkwatch@example.com",
    phone: "555-565-8585",
    status: "reported",
  });
};
