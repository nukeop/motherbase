const configDir = process.env.XDG_CONFIG_HOME ?? `${process.env.HOME}/.config`;

export const motherbaseDir = `${configDir}/motherbase`;
export const configPath = `${motherbaseDir}/config.json`;
export const dbPath = `${motherbaseDir}/motherbase.db`;
