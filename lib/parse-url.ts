export function parseURL(input: string): string | boolean {
  if (input.match(/\s/)) {
    return false;
  }

  const urlWithProtocol =
    input.startsWith("http://") || input.startsWith("https://")
      ? input
      : `https://${input}`;

  try {
    const url = new URL(urlWithProtocol);

    if (!url.hostname.includes(".")) {
      return false;
    }

    return url.href;
  } catch {
    return false;
  }
}
