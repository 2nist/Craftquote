/**
 * @OnlyCurrentDoc
 * Pipedrive integration: upload the current spreadsheet as a PDF to a Deal via Pipedrive Files API.
 */

/**
 * Open the small uploader UI.
 */
function showPipedriveUploader() {
  const html = HtmlService.createHtmlOutputFromFile('PipedriveUploader')
    .setWidth(520)
    .setHeight(420);
  SpreadsheetApp.getUi().showModalDialog(html, '📎 Upload Quote to Pipedrive');
}

/**
 * Return whether an API token is saved in Script Properties.
 */
function hasPipedriveToken() {
  const token = PropertiesService.getScriptProperties().getProperty('PIPEDRIVE_API_TOKEN');
  return !!token;
}

/**
 * Save or update the Pipedrive API token in Script Properties.
 */
function savePipedriveToken(token) {
  if (!token || !token.trim()) throw new Error('API token is required');
  PropertiesService.getScriptProperties().setProperty('PIPEDRIVE_API_TOKEN', token.trim());
  return { success: true, message: 'Token saved.' };
}

/**
 * Upload a PDF to a Pipedrive deal.
 * @param {number|string} dealId The Pipedrive Deal ID.
 * @param {string} fileName Desired file name without extension (optional).
 */
function uploadPdfToPipedrive(dealId, fileName) {
  try {
    if (!dealId) throw new Error('Deal ID is required');
    const token = PropertiesService.getScriptProperties().getProperty('PIPEDRIVE_API_TOKEN');
    if (!token) throw new Error('Pipedrive API token is not set. Save it first.');

    const name = (fileName && fileName.trim()) ? fileName.trim() : `Quote-${Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmm')}`;
    const pdfBlob = getSpreadsheetPdfBlob_(name + '.pdf');

    const url = `https://api.pipedrive.com/v1/files?api_token=${encodeURIComponent(token)}`;
    const payload = {
      deal_id: String(dealId),
      file: pdfBlob
      // optionally: file_name: name + '.pdf', visible_to: 3
    };

    const res = UrlFetchApp.fetch(url, {
      method: 'post',
      payload: payload,
      muteHttpExceptions: true
    });

    const code = res.getResponseCode();
    const text = res.getContentText();
    if (code >= 200 && code < 300) {
      return { success: true, message: `Uploaded ${name}.pdf to Deal ${dealId}.` };
    }
    // Try parse error
    let errMsg = text;
    try {
      const obj = JSON.parse(text);
      if (obj && obj.error) errMsg = obj.error;
      if (obj && obj.data && obj.data.error) errMsg = obj.data.error;
    } catch (ignore) {}
    return { success: false, message: `Upload failed (${code}): ${errMsg}` };
  } catch (e) {
    return { success: false, message: `Error: ${e.message}` };
  }
}

/**
 * Export the entire spreadsheet as a PDF blob.
 * For finer control (single sheet), we can switch to the export URL pattern later.
 */
function getSpreadsheetPdfBlob_(targetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const blob = ss.getAs(MimeType.PDF);
  blob.setName(targetName);
  return blob;
}
