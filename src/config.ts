import config from "../config.json";


if (config.twitch === undefined) {
  throw new Error("config.twitch is not set!");
}
if (config.twitch.channel_name === undefined) {
  throw new Error("config.twitch.channel_name is not set!");
}

export { config };
