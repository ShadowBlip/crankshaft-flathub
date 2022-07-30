import { SMM } from '../types/SMM';

// Returns whether or not we detect a Chimera installation
export const hasChimera = async (smm: SMM): Promise<boolean> => {
  const out = await smm.Exec.run('bash', [
    '-c',
    'ls $HOME/.local/share/chimera',
  ]);
  if (out.exitCode !== 0) {
    return false;
  }
  return true;
};
