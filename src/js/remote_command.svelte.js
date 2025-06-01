import { FC } from "./fc.svelte.js";

const CHANNELS = {
  ROLL: 0,
  PITCH: 1,
  YAW: 2,
  COLLECTIVE: 3,
  THROTTLE: 4,
};

const MAX_AUX_COUNT = 27;

function cyclic(channel) {
  const mappedChannel = FC.RC_MAP.indexOf(channel);
  const raw = FC.RX_CHANNELS[mappedChannel];
  if (!raw) {
    return null;
  }

  const deadband = FC.RC_CONFIG.rc_deadband;
  const deflection = raw - FC.RC_CONFIG.rc_center;
  const range = FC.RC_CONFIG.rc_deflection - deadband;

  if (deflection > deadband) {
    return {
      pwm: raw,
      percent: ((deflection - deadband) / range).clamp(-1, 1),
    };
  } else if (deflection < -deadband) {
    return {
      pwm: raw,
      percent: ((deflection + deadband) / range).clamp(-1, 1),
    };
  }

  return {
    pwm: raw,
    percent: 0,
  };
}

/**
 * Provides the current output of each receiver channel
 */
export const RemoteCommand = {
  get roll() {
    return cyclic(CHANNELS.ROLL);
  },
  get pitch() {
    return cyclic(CHANNELS.PITCH);
  },
  get yaw() {
    const mappedChannel = FC.RC_MAP.indexOf(CHANNELS.YAW);
    const raw = FC.RX_CHANNELS[mappedChannel];
    if (!raw) {
      return null;
    }

    const deadband = FC.RC_CONFIG.rc_yaw_deadband;
    const deflection = raw - FC.RC_CONFIG.rc_center;
    const range = FC.RC_CONFIG.rc_deflection - deadband;

    if (deflection > deadband) {
      return {
        pwm: raw,
        percent: ((deflection - deadband) / range).clamp(-1, 1),
      };
    } else if (deflection < -deadband) {
      return {
        pwm: raw,
        percent: ((deflection + deadband) / range).clamp(-1, 1),
      };
    }

    return {
      pwm: raw,
      percent: 0,
    };
  },
  get collective() {
    const mappedChannel = FC.RC_MAP.indexOf(CHANNELS.COLLECTIVE);
    const raw = FC.RX_CHANNELS[mappedChannel];
    if (!raw) {
      return null;
    }

    const deflection = raw - FC.RC_CONFIG.rc_center;
    const range = FC.RC_CONFIG.rc_deflection;

    return {
      pwm: raw,
      percent: (deflection / range).clamp(-1, 1),
    };
  },
  get throttle() {
    const mappedChannel = FC.RC_MAP.indexOf(CHANNELS.THROTTLE);
    const raw = FC.RX_CHANNELS[mappedChannel];
    if (!raw) {
      return null;
    }

    const deflection = raw - FC.RC_CONFIG.rc_min_throttle;
    const range = FC.RC_CONFIG.rc_max_throttle - FC.RC_CONFIG.rc_min_throttle;

    return {
      pwm: raw,
      percent: (deflection / range).clamp(0, 1),
    };
  },

  aux: [],
};

for (let i = 0; i < MAX_AUX_COUNT; i++) {
  RemoteCommand.aux.push({
    get pwm() {
      let mappedChannel = i;
      if (i < FC.RC_MAP.length - 5) {
        mappedChannel = FC.RC_MAP.indexOf(i + 5);
      }

      const raw = FC.RX_CHANNELS[mappedChannel];
      if (!raw) {
        return null;
      }

      return {
        pwm: raw,
      };
    },
  });
}
