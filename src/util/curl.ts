import { SMM } from '../types/SMM';

export const curl = async (smm: SMM, url: string): Promise<string> => {
  const out = await smm.Exec.run('curl', ['-s', url]);
  return out.stdout;
};

// TODO: Is there a safer way to do this?
export const curlBase64 = async (smm: SMM, url: string): Promise<string> => {
  const out = await smm.Exec.run('bash', [
    '-c',
    `curl -s ${url} | base64 -w 0`,
  ]);
  return out.stdout;
};
