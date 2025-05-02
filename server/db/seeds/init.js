const User = require("../../models/User");

/**
 * @param { import("knex").Knex }
 * @returns { Promise<void> }
 */
exports.seed = async (knex) => {
  await knex("users").del();

  await knex.raw("ALTER SEQUENCE users_id_seq RESTART WITH 1");

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
};
