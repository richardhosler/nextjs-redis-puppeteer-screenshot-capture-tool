export function parseURL(string: string) {
  if (string.match(/\s/)) {
    return false;
  }

  if (string.match(/\.(com|co\.uk|net|org)$/) == null) {
    return false;
  }

  let url = "";
  if (string.match(/^http[s]*:\/\//i) == null) {
    url = "https://";
  }

  url += string;
  return url;
}
