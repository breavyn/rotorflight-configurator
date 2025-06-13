import { FC } from "./fc.svelte.js";
import { RemoteCommand } from "./remote_command.svelte.js";

function betaflightRates(x, rate, rcRate, rcExpo, superExpo, limit) {
  const xAbs = Math.abs(x);

  if (rcRate > 2) {
    rcRate = rcRate + (rcRate - 2) * 14.54;
  }

  const expoPower = 3;
  const rcRateConstant = 200;

  if (rcExpo > 0) {
    x = x * Math.pow(xAbs, expoPower) * rcExpo + x * (1 - rcExpo);
  }

  let angularVel;
  if (superExpo) {
    const rcFactor = 1 / this.constrain(1 - xAbs * rate, 0.01, 1);
    angularVel = rcRateConstant * rcRate * x;
    angularVel = angularVel * rcFactor;
  } else {
    angularVel = ((rate * 100 + 27) * x) / 16 / 4.1; // Only applies to old versions ?
  }

  angularVel = this.constrain(angularVel, -1 * limit, limit); // Rate limit from profile

  return angularVel;
}

function raceflightRates(x, rate, rcRate, rcExpo) {
  rate *= 100;
  rcRate *= 1000;
  rcExpo *= 100;

  const expo = (1 + 0.01 * rcExpo * (x * x - 1.0)) * x;
  return expo * (rcRate + Math.abs(expo) * rcRate * rate * 0.01);
}

function kissRates(x, rate, rcRate, rcExpo) {
  const expo = (x * x * x * rcExpo + x * (1 - rcExpo)) * (rcRate / 10);
  return 2000.0 * (1.0 / (1 - Math.abs(x) * rate)) * expo;
}

function actualRates(x, rate, rcRate, rcExpo) {
  rate *= 1000;
  rcRate *= 1000;

  const expo = Math.abs(x) * (Math.pow(x, 5) * rcExpo + x * (1 - rcExpo));
  return x * rcRate + Math.max(0, rate - rcRate) * expo;
}

function quickRates(x, rate, rcRate, rcExpo) {
  rate *= 1000;
  rcRate *= 200;
  rate = Math.max(rate, rcRate);

  const xAbs = Math.abs(x);
  const expo = (rate / rcRate - 1) / (rate / rcRate);
  const curve = Math.pow(xAbs, 3) * rcExpo + xAbs * (1 - rcExpo);
  return (x * rcRate * 1.0) / (1.0 - curve * expo);
}

const curves = [
  (x) => x * 500,
  betaflightRates,
  raceflightRates,
  kissRates,
  actualRates,
  quickRates,
];

export const Setpoint = {
  get roll() {
    const curve = curves[FC.RC_TUNING.rates_type];
    return curve(
      RemoteCommand.roll.percent,
      FC.RC_TUNING.roll_rate,
      FC.RC_TUNING.RC_RATE,
      FC.RC_TUNING.RC_EXPO,
      FC.RC_TUNING.superexpo,
      FC.RC_TUNING.roll_rate_limit,
    );
  },
  get pitch() {
    const curve = curves[FC.RC_TUNING.rates_type];
    return curve(
      RemoteCommand.pitch.percent,
      FC.RC_TUNING.pitch_rate,
      FC.RC_TUNING.rcPitchRate,
      FC.RC_TUNING.RC_PITCH_EXPO,
      FC.RC_TUNING.superexpo,
      FC.RC_TUNING.pitch_rate_limit,
    );
  },
  get yaw() {
    const curve = curves[FC.RC_TUNING.rates_type];
    return curve(
      RemoteCommand.yaw.percent,
      FC.RC_TUNING.yaw_rate,
      FC.RC_TUNING.rcYawRate,
      FC.RC_TUNING.RC_YAW_EXPO,
      FC.RC_TUNING.superexpo,
      FC.RC_TUNING.yaw_rate_limit,
    );
  },
};
