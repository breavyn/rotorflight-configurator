import semver from "semver";

import { FC } from "@/js/fc.svelte.js";
import { API_VERSION_12_8 } from "@/js/data_storage";

let throttleProtocols = $derived([
  "PWM",
  "ONESHOT125",
  "ONESHOT42",
  "MULTISHOT",
  "BRUSHED",
  "DSHOT150",
  "DSHOT300",
  "DSHOT600",
  "PROSHOT",
  ...(semver.gte(FC.CONFIG.apiVersion, API_VERSION_12_8) ? ["CASTLE"] : []),
  "DISABLED",
]);

let telemetryProtocols = $derived([
  "Disabled",
  "BLHeli32",
  "Hobbywing Platinum V4 / FlyFun V5",
  "Hobbywing Platinum V5",
  "Scorpion",
  "Kontronik",
  "OMPHobby",
  "ZTW",
  "APD",
  "OpenYGE",
  "FLYROTOR",
  "Graupner",
  ...(semver.gte(FC.CONFIG.apiVersion, API_VERSION_12_8) ? ["XDFLY"] : []),
]);

let throttleEnabled = $derived(
  throttleProtocols[FC.MOTOR_CONFIG.motor_pwm_protocol] !== "DISABLED",
);
let isDshot = $derived(
  throttleProtocols[FC.MOTOR_CONFIG.motor_pwm_protocol].startsWith("DSHOT"),
);
let isCastleLink = $derived(
  throttleProtocols[FC.MOTOR_CONFIG.motor_pwm_protocol] === "CASTLE",
);
let hasTelemPort = $derived(FC.ESC_SENSOR_CONFIG.protocol > 0);
let telemEnabled = $derived(hasTelemPort || isCastleLink);

export const State = {
  get throttleProtocols() {
    return throttleProtocols;
  },

  get throttleEnabled() {
    return throttleEnabled;
  },

  get isDshot() {
    return isDshot;
  },

  get isCastleLink() {
    return isCastleLink;
  },

  get telemetryProtocols() {
    return telemetryProtocols;
  },

  get hasTelemPort() {
    return hasTelemPort;
  },

  get telemEnabled() {
    return telemEnabled;
  },

  /**
   * Sets the correct features and config based on the state of CastleLink
   */
  fixConfig() {
    FC.FEATURE_CONFIG.features.ESC_SENSOR = telemEnabled;
    if (isCastleLink) {
      FC.ESC_SENSOR_CONFIG.protocol = 0;
    }
  },
};
