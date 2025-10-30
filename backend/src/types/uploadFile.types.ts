import { Readable } from 'stream';

export interface UploadedFile {
	type: 'file';
	fieldname: string;
	filename: string;
	encoding: string;
	mimetype: string;
	file: Readable;
	_buf?: Buffer;
	toBuffer?: () => Promise<Buffer>;
}
