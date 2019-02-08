// Copyright 2018-2019 the Deno authors. All rights reserved. MIT license.
import { Buffer, File, open, Reader, stat } from "deno";

// `off` is the offset into `dst` where it will at which to begin writing values
// from `src`.
// Returns the number of bytes copied.
export function copyBytes(dst: Uint8Array, src: Uint8Array, off = 0): number {
  off = Math.max(0, Math.min(off, dst.byteLength));
  const r = dst.byteLength - off;
  if (src.byteLength > r) {
    src = src.subarray(0, r);
  }
  dst.set(src, off);
  return src.byteLength;
}

export function charCode(s: string): number {
  return s.charCodeAt(0);
}

const encoder = new TextEncoder();
export function stringsReader(s: string): Reader {
  return new Buffer(encoder.encode(s).buffer);
}

export async function tempFile(
  dir: string,
  opts: {
    prefix?: string;
    postfix?: string;
  } = { prefix: "", postfix: "" }
): Promise<{ file: File; filepath: string }> {
  const r = ~~(Math.random() * 1000000);
  const filepath = `${dir}/${opts.prefix}${r}${opts.postfix}`;
  const file = await open(filepath);
  return { file, filepath };
}
