import {
  ChooksCommand,
  ChooksCommandOption,
  ChooksInteractionCommand,
  DiscordCommand,
  DiscordCommandOption,
  DiscordCommandOptionType,
  DiscordCommandType,
} from '@chookscord/types';
import { Logger } from '../utils';

function condAppend<T, K extends keyof T>(
  object: T,
  key: K,
  value: T[K] | undefined,
): T {
  return value === undefined
    ? object
    : { ...object, [key]: value };
}

function prepareOption(option: ChooksCommandOption): DiscordCommandOption {
  let appOption = {} as DiscordCommandOption;

  appOption = condAppend(appOption, 'name', option.name);
  appOption = condAppend(appOption, 'description', option.description);
  appOption = condAppend(appOption, 'type', DiscordCommandOptionType[option.type]);
  appOption = condAppend(appOption, 'choices', option.choices);
  appOption = condAppend(appOption, 'required', option.required);
  appOption = condAppend(appOption, 'options', option.options?.length
    ? option.options.map(prepareOption)
    : undefined);

  return appOption;
}

function prepareCommand(command: ChooksCommand): DiscordCommand {
  let appCommand = { type: DiscordCommandType.CHAT_INPUT } as DiscordCommand;

  appCommand = condAppend(appCommand, 'type', DiscordCommandType[command.type ?? 'CHAT_INPUT']);
  appCommand = condAppend(appCommand, 'name', command.name);
  appCommand = condAppend(appCommand, 'description', command.description);
  appCommand = condAppend(appCommand, 'default_permission', command.defaultPermission);
  appCommand = condAppend(appCommand, 'options', command.options?.map(prepareOption));

  return appCommand;
}

export function prepareCommands(
  commands: Iterable<ChooksCommand | ChooksInteractionCommand>,
  options: Partial<Logger> = {},
): DiscordCommand[] {
  options.logger?.info('Preparing commands...');
  let counter = 0;
  const preparedCommands: DiscordCommand[] = [];
  for (const command of commands) {
    const appCommand = prepareCommand(command);
    preparedCommands.push(appCommand);
    options.logger?.debug(`Prepared ${++counter} commands.`);
  }
  options.logger?.info(`${counter} commands prepared.`);
  return preparedCommands;
}