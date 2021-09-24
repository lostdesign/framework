import type * as types from '@chookscord/types';
import { eq } from '../../utils';

export function didChoiceChanged(
  choice1: types.ChooksCommandOptionChoice,
  choice2: types.ChooksCommandOptionChoice | null,
): boolean {
  return (
    eq(choice2, null) ||
    !eq(choice1.name, choice2.name) ||
    !eq(choice1.value, choice2.value)
  );
}