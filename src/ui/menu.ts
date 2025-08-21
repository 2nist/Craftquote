import { validateConfig, getConfig } from '../core/config';
import { getQuoteBodyBlocks, sortQuote } from '../core/builder';
import { buildDoc } from '../integrations/doc';
import { saveDocAsPdfNextToSheet } from '../integrations/drive';
import { generateAndStampBaseNumber, incrementRevisionInPlace } from '../core/idgen';
import { pushQuoteToPipedriveStub, listDealFields } from '../integrations/pipedrive';

export function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Quote Tools')
    .addItem('Validate Panel Config', 'global_validateConfig')
    .addItem('Build PDF Preview', 'global_buildPdfPreview')
    .addSeparator()
    .addItem('Generate Quote # (Rev 00)', 'global_generateQuoteNumber')
    .addItem('Increment Revision', 'global_incrementRevision')
    .addSeparator()
    .addItem('Push to Pipedrive (stub)', 'global_pushPipedriveStub')
    .addItem('List Pipedrive Deal Fields', 'global_listDealFields')
    .addToUi();
}

export function global_validateConfig() {
  const errs = validateConfig();
  if (errs.length) SpreadsheetApp.getUi().alert('Missing fields: ' + errs.join(', '));
  else SpreadsheetApp.getUi().alert('Config looks good.');
}

export function global_buildPdfPreview() {
  const cfg = getConfig();
  const blocks = sortQuote(getQuoteBodyBlocks(cfg));
  const doc = buildDoc(cfg.projectName || cfg.quoteNumber || 'Quote Preview', blocks);
  const pdfId = saveDocAsPdfNextToSheet(doc.getId());
  const url = 'https://drive.google.com/file/d/' + pdfId + '/view';
  SpreadsheetApp.getUi().alert('PDF saved: ' + url + '\nDoc: ' + doc.getUrl());
}

export function global_generateQuoteNumber() {
  const qn = generateAndStampBaseNumber();
  SpreadsheetApp.getUi().alert('Generated: ' + qn);
}

export function global_incrementRevision() {
  const qn = incrementRevisionInPlace();
  SpreadsheetApp.getUi().alert('Revision -> ' + qn);
}

export function global_pushPipedriveStub() {
  const cfg = getConfig();
  const dealId = String(cfg.dealId || '').trim() || '(none)';
  pushQuoteToPipedriveStub(dealId, '(no-pdf-id-in-stub)');
  SpreadsheetApp.getUi().alert('Pipedrive push stub logged to executions.');
}

export function global_listDealFields() {
  const json = listDealFields();
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(`<pre style="white-space:pre-wrap">${json.replace(/[<&>]/g, (m)=>({"<":"&lt;",">":"&gt;","&":"&amp;"}[m] as string))}</pre>`).setWidth(600).setHeight(400), 'Pipedrive Deal Fields');
}
