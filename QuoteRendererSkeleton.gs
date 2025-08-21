/**
 * Quote Renderer Skeleton
 * - Loads a selected template sheet from the reference spreadsheet
 * - Maps fields into the quote generator pipeline
 * - Provides hooks for formatting and PDF export
 *
 * Note: This skeleton is a starting point to wire templates into the generator.
 */

const REFERENCE_SHEET_ID = '1MvIjmBMa2FDcRQhfU9HeDqwLlpsq4Juah-tI9CvshRA';

function renderQuoteFromTemplate(templateName, targetQuoteData) {
  // 1) Load template sheet data
  const templateData = loadTemplate(templateName);
  Logger.log('Loaded template: ' + templateName);

  // 2) Map template fields to quote data (stub)
  const mappedData = mapTemplateToQuoteData(templateData, targetQuoteData);
  Logger.log('Mapped data ready');

  // 3) Build quote content array using existing builder
  const quoteNumber = generateFinalQuoteNumber(mappedData);
  const content = buildQuoteContentArray(quoteNumber, mappedData);

  // 4) Create sheet and write content
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = createNewQuoteSheet(quoteNumber);
  writeAndFormatQuote(sheet, content);

  // 5) Optionally export to PDF
  // ...export logic can reuse existing prototype

  return { success: true, sheetName: sheet.getName() };
}

function loadTemplate(templateName) {
  const ss = SpreadsheetApp.openById(REFERENCE_SHEET_ID);
  const sheet = ss.getSheetByName(templateName);
  if (!sheet) throw new Error('Template sheet not found: ' + templateName);
  const data = sheet.getDataRange().getValues();
  return { name: templateName, data: data };
}

function mapTemplateToQuoteData(templateData, targetQuoteData) {
  // Very basic mapping: In the future this will parse header positions,
  // named ranges, and extract default pricing or descriptions.
  const mapped = targetQuoteData || {};
  mapped.templateName = templateData.name;
  // For now, preserve components and customer info
  mapped.components = mapped.components || [];
  mapped.customerInfo = mapped.customerInfo || {};
  mapped.projectInfo = mapped.projectInfo || {};
  return mapped;
}
