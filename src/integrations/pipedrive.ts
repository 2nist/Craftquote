// Minimal Pipedrive helpers (stubs + simple GET)
export interface PipedriveAuth { apiToken: string; baseUrl?: string; }

function getAuth(): PipedriveAuth | null {
  const props = PropertiesService.getScriptProperties();
  const token = (props.getProperty('PIPEDRIVE_API_TOKEN') || '').trim();
  if (!token) return null;
  const base = (props.getProperty('PIPEDRIVE_BASE_URL') || 'https://api.pipedrive.com/v1').trim();
  return { apiToken: token, baseUrl: base };
}

export function sanitizeFileName(name: string): string {
  return name.replace(/[\\/:*?"<>|]+/g, '-').slice(0, 120);
}

export function pushQuoteToPipedriveStub(dealId: string, pdfId: string): void {
  // Stub only: log the payload; do not send
  const auth = getAuth();
  const payload = { dealId, pdfId, hasToken: !!auth?.apiToken };
  console.log('Pipedrive push stub:', JSON.stringify(payload));
}

export function listDealFields(): string {
  const auth = getAuth();
  if (!auth) return 'PIPEDRIVE_API_TOKEN not configured';
  const url = `${auth.baseUrl}/dealFields?api_token=${encodeURIComponent(auth.apiToken)}`;
  const res = UrlFetchApp.fetch(url, { method: 'get', muteHttpExceptions: true });
  return res.getContentText();
}

/**
 * Upload a PDF file to a Pipedrive Deal as an attachment.
 * Uses multipart/form-data with the file blob and deal_id.
 */
export function uploadPdfToDeal(dealId: string, pdfFileId: string): string {
  const auth = getAuth();
  if (!auth) throw new Error('PIPEDRIVE_API_TOKEN not configured');
  if (!dealId) throw new Error('dealId is required');
  const file = DriveApp.getFileById(pdfFileId);
  const url = `${auth.baseUrl}/files?api_token=${encodeURIComponent(auth.apiToken)}`;
  const payload: GoogleAppsScript.URL_Fetch.Payload = {
    file: file.getBlob(),
    deal_id: dealId
  } as unknown as GoogleAppsScript.URL_Fetch.Payload;
  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    payload,
    muteHttpExceptions: true
  });
  const code = res.getResponseCode();
  if (code < 200 || code >= 300) throw new Error(`Pipedrive upload failed ${code}: ${res.getContentText()}`);
  return res.getContentText();
}
