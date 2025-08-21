export function saveDocAsPdfNextToSheet(docId: string): string {
  const doc = DriveApp.getFileById(docId);
  const ss = SpreadsheetApp.getActive();
  const scriptProps = PropertiesService.getScriptProperties();
  const overrideId = (scriptProps.getProperty('DOC_OUTPUT_PARENT_ID') || '').trim();
  let parent: GoogleAppsScript.Drive.Folder;
  if (overrideId) {
    try { parent = DriveApp.getFolderById(overrideId); } catch (e) { parent = DriveApp.getRootFolder(); }
  } else {
    const ssFile = DriveApp.getFileById(ss.getId());
    parent = ssFile.getParents().hasNext() ? ssFile.getParents().next() : DriveApp.getRootFolder();
  }
  const blob = doc.getAs('application/pdf');
  const pdf = parent.createFile(blob).setName(doc.getName() + '.pdf');
  return pdf.getId();
}
