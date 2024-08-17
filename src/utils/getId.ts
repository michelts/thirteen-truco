let currentId = 0;

export function getId() {
  currentId++;
  return currentId;
}
