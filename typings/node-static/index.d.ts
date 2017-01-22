declare module "node-static" {
  import { ServerRequest, ServerResponse } from "http";
  import { EventEmitter } from "events";
  import { Stats } from "fs";

  export class Server {
    constructor(path?: string, options?: ServerOptions);
    finish(status: number, headers: any, req: ServerRequest, res: ServerResponse, promise: Promise<any>, cb?: (err: Error, result: any) => void): void;
    gzipOk(req: ServerRequest, contentType: string): boolean;
    parseByteRange(req: ServerRequest, stat: Stats): { from: number, to: number, valid: boolean };
    resolve(path: string): string;
    respond(path: string, status: number, headers: any, files: string[], stat: Stats, req: ServerRequest, res: ServerResponse, finish: FinishResponse): void;
    respondGzip(path: string, status: number, contentType: string, headers: any, files: string[], stat: Stats, req: ServerRequest, res: ServerResponse, finish: FinishResponse): void;
    respondNoGzip(path: string, status: number, contentType: string, headers: any, files: string[], stat: Stats, req: ServerRequest, res: ServerResponse, finish: FinishResponse): void;
    serve(req: ServerRequest, res: ServerResponse, cb?: (err: any, result: any) => void): EventEmitter;
    serveDir(dirPath: string, request: ServerRequest, response: ServerResponse, cb: FinishResponse): EventEmitter;
    serveFile(filePath: string, status: number, headers: any, request: ServerRequest, response: ServerResponse): void;
    servePath(path: string, status: number, headers: any, request: ServerRequest, response: ServerResponse, cb: FinishResponse): EventEmitter;
    stream(path: string, files: string[], length: number, startByte: number, res: ServerResponse, cb?: (err: Error, offset: number) => void): void;
  }

  interface FinishResponse {
    (status: number, headers: any): void;
  }

  interface ServerOptions {
    cache?: number;
    serverInfo?: string;
    headers?: any;
    gzip?: boolean | RegExp;
    indexFile?: string;
  }

  export var version: number[];
  export var mine: any;
}
