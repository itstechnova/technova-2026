export function getInitials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").toUpperCase().slice(0, 2);
}

export function stringToColor(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = value.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${hash % 360}, 60%, 45%)`;
}
