import {
  CELL_SIZE,
  HEADER_SIZE,
  NULL_PTR,
  PAGE_SIZE,
  type NodeId,
  type PageRole,
  type PageSnapshot,
  type RowValue,
} from "./types";

const ROLE_TAG: Record<PageRole, number> = { free: 0, leaf: 1, internal: 2, meta: 3 };

function encodeAscii(s: string, max: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < s.length && i < max; i++) out.push(s.charCodeAt(i) & 0xff);
  return out;
}

// A hex preview of a leaf row exactly as it is serialized on the page:
// [key: 4 bytes little-endian][userLen: 1][user ascii...]
export function cellPreviewHex(key: number, value: RowValue): string {
  const bytes: number[] = [
    key & 0xff,
    (key >>> 8) & 0xff,
    (key >>> 16) & 0xff,
    (key >>> 24) & 0xff,
  ];
  const user = encodeAscii(value.user, 5);
  bytes.push(user.length, ...user);
  return bytes
    .slice(0, 10)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
}

// Owns the byte-level pages — the "physical disk". Nodes are decoded/encoded
// through here, so snapshotPages() returns the genuine serialized bytes.
export class Pager {
  private pages: Uint8Array[] = [];
  private roles: PageRole[] = [];

  get pageCount(): number {
    return this.pages.length;
  }

  allocate(role: PageRole): NodeId {
    const id = this.pages.length;
    const page = new Uint8Array(PAGE_SIZE);
    page[0] = ROLE_TAG[role];
    this.pages.push(page);
    this.roles.push(role);
    return id;
  }

  free(id: NodeId): void {
    const page = new Uint8Array(PAGE_SIZE);
    page[0] = ROLE_TAG.free;
    this.pages[id] = page;
    this.roles[id] = "free";
  }

  private writeU16(page: Uint8Array, off: number, v: number): void {
    page[off] = v & 0xff;
    page[off + 1] = (v >>> 8) & 0xff;
  }

  private writeU32(page: Uint8Array, off: number, v: number): void {
    page[off] = v & 0xff;
    page[off + 1] = (v >>> 8) & 0xff;
    page[off + 2] = (v >>> 16) & 0xff;
    page[off + 3] = (v >>> 24) & 0xff;
  }

  // Leaf page layout:
  //   header: [roleTag:1][keyCount:2 LE][nextSibling:4 LE][pad:1]
  //   cells (CELL_SIZE each): [key:4 LE][userLen:1][user][emailLen:1][email][pad]
  writeLeaf(id: NodeId, keys: number[], values: RowValue[], next: NodeId | null): void {
    const page = new Uint8Array(PAGE_SIZE);
    page[0] = ROLE_TAG.leaf;
    this.writeU16(page, 1, keys.length);
    this.writeU32(page, 3, next == null ? NULL_PTR : next);
    let off = HEADER_SIZE;
    for (let i = 0; i < keys.length; i++) {
      this.writeU32(page, off, keys[i] >>> 0);
      const user = encodeAscii(values[i].user, 12);
      const email = encodeAscii(values[i].email, 13);
      let p = off + 4;
      page[p++] = user.length;
      for (const b of user) page[p++] = b;
      page[p++] = email.length;
      for (const b of email) page[p++] = b;
      off += CELL_SIZE;
    }
    this.pages[id] = page;
    this.roles[id] = "leaf";
  }

  // Internal page layout:
  //   header + [child0:4][key0:4][child1:4][key1:4]...[childN:4]
  writeInternal(id: NodeId, keys: number[], children: NodeId[]): void {
    const page = new Uint8Array(PAGE_SIZE);
    page[0] = ROLE_TAG.internal;
    this.writeU16(page, 1, keys.length);
    let off = HEADER_SIZE;
    this.writeU32(page, off, children[0] ?? NULL_PTR);
    off += 4;
    for (let i = 0; i < keys.length; i++) {
      this.writeU32(page, off, keys[i] >>> 0);
      off += 4;
      this.writeU32(page, off, children[i + 1] ?? NULL_PTR);
      off += 4;
    }
    this.pages[id] = page;
    this.roles[id] = "internal";
  }

  usedBytes(id: NodeId): number {
    const page = this.pages[id];
    const role = this.roles[id];
    const keyCount = page[1] | (page[2] << 8);
    if (role === "leaf") return HEADER_SIZE + keyCount * CELL_SIZE;
    if (role === "internal") return HEADER_SIZE + 4 + keyCount * 8;
    return HEADER_SIZE;
  }

  snapshotPages(): PageSnapshot[] {
    return this.pages.map((page, id) => ({
      pageId: id,
      role: this.roles[id],
      bytes: Array.from(page),
      usedBytes: this.usedBytes(id),
    }));
  }

  clear(): void {
    this.pages = [];
    this.roles = [];
  }
}
