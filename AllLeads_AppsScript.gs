/**
 * Raj Marketing Agency - All Leads Collection
 *
 * Handles ALL forms: Hero, Contact, Unlock Pricing, Careers via GET or POST.
 *
 * IMPORTANT:
 * 1) Share the Google Sheet with the Apps Script owner email (Editor access).
 * 2) Deploy as Web App → Execute as "Me" → Who has access "Anyone"
 *
 * Sheet columns: Date | Form Name | Name | Phone | Email | Company | Message | Resume URL
 */

const SHEET_ID = "1QrUkOBonsod_g-cxCzG9gX5tG8ZWqhTqfAh7zI8TYTQ";
const SHEET_NAME = "All Leads";

function doGet(e) {
  return handleRequest(e && e.parameter ? e.parameter : {});
}

function doPost(e) {
  return handleRequest(e && e.parameter ? e.parameter : {});
}

function handleRequest(params) {
  try {
    const formName = (params.formName || "").trim();
    const name     = (params.name || "").trim();
    const phone    = (params.phone || "").trim();
    const email    = (params.email || "").trim();
    const company  = (params.company || params.service || params.budget || "").trim();
    const message  = (params.message || "").trim();
    const resumeUrl= (params.resumeUrl || "").trim();

    if (!name && !phone) {
      return ContentService.createTextOutput("Error: name or phone is required");
    }

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) return ContentService.createTextOutput("Error: Sheet 'All Leads' not found");

    const ts = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd-MM-yyyy HH:mm:ss");
    sheet.appendRow([ts, formName, name, phone, email, company, message, resumeUrl]);

    return ContentService.createTextOutput("OK");

  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.message);
  }
}
