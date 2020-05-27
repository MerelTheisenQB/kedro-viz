import { flags as flagsConfig } from '../config';

/**
 * Flag definitions
 */
export const Flags = {
  /**
   * Returns `true` if the flag is defined otherwise `false`
   * @param {string} name The flag name to test
   * @returns {boolean} The result
   */
  isDefined: name => Flags.names().includes(name),

  /**
   * Returns an array of defined flag names
   * @returns {array} The defined flag names
   */
  names: () => Object.keys(flagsConfig),

  /**
   * Returns an object mapping flag names to their default values
   * @returns {object} The defined flag defaults
   */
  defaults: () =>
    Flags.names().reduce(
      (result, flag) => Object.assign(result, { [flag]: flag.default }),
      {}
    )
};

/**
 * Returns an object with flags as set in the current URL using `enable` and `disable` parameters
 * @returns {object} An object with flags and their values
 */
export const getFlagsFromUrl = () => {
  const urlParams = new URL(document.location).searchParams;
  const enableNames = (urlParams.get('enable') || '').split(/\W/g);
  const disableNames = (urlParams.get('disable') || '').split(/\W/g);
  const flags = {};

  enableNames.forEach(name =>
    Flags.isDefined(name) ? (flags[name] = true) : null
  );

  disableNames.forEach(name =>
    Flags.isDefined(name) ? (flags[name] = false) : null
  );

  return flags;
};

/**
 * Returns a user info message describing the status of all defined flags
 * @param {object} flagsEnabled An object mapping of current flag's status
 * @returns {string} The info message
 */
export const getFlagsMessage = flagsEnabled => {
  const allNames = Flags.names();

  if (allNames.length > 0) {
    let info = 'Experimental features 🏄‍♂️\n';

    allNames.forEach(name => {
      const isEnabled = flagsEnabled[name];
      const status = isEnabled ? 'Enabled' : 'Disabled';
      const statusIcon = isEnabled ? '🟢' : '⚪️';
      const icon = flagsConfig[name].icon;
      const description = flagsConfig[name].description;
      info += `\n${statusIcon} ${icon} "${name}" · ${description} · ${status}`;
    });

    info += `\n\nSee docs for more info 📖`;

    return info;
  }
};
