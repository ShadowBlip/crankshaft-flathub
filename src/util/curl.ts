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

const md5sum = async (smm: SMM, data: string): Promise<string> => {
  const output = await smm.Exec.run('bash', ['-c', `echo '${data}' | md5sum`]);
  return output.stdout.split(' ')[0];
};

// Caches response data and returns the cached result.
export const cachedCurlBase64 = async (
  smm: SMM,
  url: string
): Promise<string> => {
  // Get the cache directory
  const pluginsDir = await smm.FS.getPluginsPath();
  const cacheDir = `${pluginsDir}/crankshaft-flathub/.cache`;
  await smm.FS.mkDir(cacheDir, true);

  // Hash the URL we're fetching and check if we've already cached this.
  const hash = await md5sum(smm, url);
  const cached = (await smm.FS.listDir(cacheDir)).filter((file) => {
    return file.name === hash;
  });

  // Return the cached contents
  if (cached.length > 0) {
    return await smm.FS.readFile(`${cacheDir}/${hash}`);
  }

  // If not, actually fetch the url data and cache it.
  const response = await curlBase64(smm, url);
  await smm.Exec.run('bash', [
    '-c',
    `echo '${response}' > ${cacheDir}/${hash}`,
  ]);

  return response;
};
