import { from } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import * as fs from 'fs';
import { promisify } from 'util';

export class MailerLoader {
  constructor(private path: string) {}

  public loadMailsTemplates(): Observable<object> {
    return from(promisify(fs.readdir)(this.path)).pipe();
  }
}
