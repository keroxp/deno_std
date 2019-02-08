import { Buffer, Closer, read, Reader, ReadResult, Writer } from "deno";

const encoder = new TextEncoder();

export class StringReader implements Reader {
  private offs = 0;
  private buf = new Uint8Array(encoder.encode(this.s));

  constructor(private readonly s: string) {}

  async read(p: Uint8Array): Promise<ReadResult> {
    const n = Math.min(p.byteLength, this.buf.byteLength - this.offs);
    p.set(this.buf.slice(this.offs, this.offs + n));
    this.offs += n;
    return { nread: n, eof: this.offs === this.buf.byteLength };
  }
}

export class MultiReader implements Reader {
  private readonly readers: Reader[];
  private currentIndex = 0;

  constructor(...readers: Reader[]) {
    this.readers = readers;
  }

  async read(p: Uint8Array): Promise<ReadResult> {
    const r = this.readers[this.currentIndex];
    if (!r) return { nread: 0, eof: true };
    const { nread, eof } = await r.read(p);
    if (eof) {
      this.currentIndex++;
    }
    return { nread, eof: false };
  }
}
