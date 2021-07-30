export function getBredName(data = [], pathname, parentName) {
  for (const i of data) {
    if (pathname === i.path) return parentName ? [i.name, parentName] : [i.name];
    if (i.children && i.children.length > 0) {
      const [findName, openName] = getBredName(i.children, pathname, i.name) || [];
      if (findName) return [findName, openName];
      continue;
    }
  }
  return [];
}
