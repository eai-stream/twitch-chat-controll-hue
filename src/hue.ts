import chroma from "chroma-js";
import { v3 } from "node-hue-api";
import { config } from "./config";

/**
 * Convert RGB to XY
 * stolen from https://stackoverflow.com/a/36061908/8618093
 */
function RGBtoXY(red: number, green: number, blue: number) {
    red =
        red > 0.04045
            ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4)
            : red / 12.92;
    green =
        green > 0.04045
            ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4)
            : green / 12.92;
    blue =
        blue > 0.04045
            ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4)
            : blue / 12.92;
    var X = red * 0.664511 + green * 0.154324 + blue * 0.162028;
    var Y = red * 0.283881 + green * 0.668433 + blue * 0.047685;
    var Z = red * 0.000088 + green * 0.07231 + blue * 0.986039;
    var fx = X / (X + Y + Z);
    var fy = Y / (X + Y + Z);
    return [fx, fy];
}

export const changeHueColor = async (color: string) => {
    if (!chroma.valid(color)) return;

    const [r, g, b] = chroma(color).rgb();
    console.log("rgb:", r, g, b);

    const [x, y] = RGBtoXY(r, g, b);
    console.log("xy:", x, y);

    const bridge = await v3.api
        .createLocal(config.hue.ip)
        .connect(config.hue.apikey);
    const state = new v3.lightStates.GroupLightState().on().xy(x, y);
    bridge.groups.setGroupState(config.hue.lightGroup, state);
};
