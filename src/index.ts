import { ChatClient } from "dank-twitch-irc";
import { config } from "./config";
import chroma from "chroma-js";
import { changeHueColor } from "./hue";

const client = new ChatClient();

client.on("ready", () => console.log("Successfully connected to chat"));
client.on("close", (error) => {
    if (error != null) {
        console.error("Client closed due to error", error);
    }
});

client.on("PRIVMSG", (msg) => {
    const message = msg.messageText;
    if (!message.startsWith("!hue ")) return;

    const color = message.split(" ")[1];
    changeHueColor(color);
    console.log("change color:", color);
});

client.connect();
client.join(config.twitch.channel_name);
