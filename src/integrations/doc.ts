import { QuoteBlock } from '../core/builder';

export function buildDoc(title: string, blocks: QuoteBlock[]): GoogleAppsScript.Document.Document {
  const doc = DocumentApp.create(title);
  const body = doc.getBody();
  body.clear();
  body.appendParagraph(title).setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph(' ');
  blocks.forEach(b => {
    if (b.category) body.appendParagraph(String(b.category)).setHeading(DocumentApp.ParagraphHeading.HEADING3);
    body.appendParagraph(b.body);
    body.appendParagraph(' ');
  });
  return doc;
}
