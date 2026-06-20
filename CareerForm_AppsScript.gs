/**
 * Raj Marketing Agency - Careers Application System
 *
 * Deploy as Web App → Execute as "Me" → Who has access "Anyone"
 * For use with iframe POST (no CORS issues)
 *
 * Saves to "All Leads" sheet with Form Name = "Careers"
 * Sheet columns: Date | Form Name | Name | Phone | Email | Company | Message | Resume URL
 */

const SHEET_ID = "1QrUkOBonsod_g-cxCzG9gX5tG8ZWqhTqfAh7zI8TYTQ";
const SHEET_NAME = "All Leads";
const DRIVE_FOLDER_ID = "1GKhJDyZByaIsYpNm_PVLA9VeM6aKDBu3";

function doGet() {
  return HtmlService.createHtmlOutput('<h2>Careers API is running.</h2>');
}

function doPost(e) {
  try {
    const formName = "Careers";
    const name     = (e.parameter.name || "").trim();
    const email    = (e.parameter.email || "").trim();
    const phone    = (e.parameter.phone || "").trim();
    const position = (e.parameter.position || "").trim();
    const exp      = (e.parameter.experience || "").trim();
    const portfolio= (e.parameter.portfolio || "").trim();
    const message  = (e.parameter.message || "").trim();
    const resumeB64= (e.parameter.resumeBase64 || "").trim();
    const resumeFn = (e.parameter.resumeName || "").trim();

    const errors = [];
    if (!name)     errors.push("Full Name is required.");
    if (!email)    errors.push("Email is required.");
    if (!phone)    errors.push("Phone is required.");
    if (!position) errors.push("Position is required.");
    if (!exp)      errors.push("Experience is required.");
    if (!message)  errors.push("Message is required.");

    if (errors.length) {
      return respond({ success: false, errors });
    }

    let resumeUrl = "";
    if (resumeB64 && resumeFn) {
      const ext = resumeFn.toLowerCase().slice(resumeFn.lastIndexOf("."));
      const allowed = [".pdf", ".doc", ".docx"];
      if (!allowed.includes(ext)) {
        return respond({ success: false, errors: ["Only PDF, DOC, and DOCX files are allowed."] });
      }
      const raw  = Utilities.base64Decode(resumeB64);
      const blob = Utilities.newBlob(raw, getMime(ext), resumeFn);
      const file = DriveApp.getFolderById(DRIVE_FOLDER_ID).createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      resumeUrl = file.getUrl();
    }

    const company = position + (exp ? " (" + exp + ")" : "") + (portfolio ? " | Portfolio: " + portfolio : "");

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) return respond({ success: false, errors: ["Sheet 'All Leads' not found."] });

    const ts = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd-MM-yyyy HH:mm:ss");
    sheet.appendRow([ts, formName, name, phone, email, company, message, resumeUrl || "-"]);

    return respond({ success: true, message: "Application submitted successfully!" });

  } catch (err) {
    return respond({ success: false, errors: ["Error: " + err.message] });
  }
}

function respond(payload) {
  const json = JSON.stringify(payload);
  const b64  = Utilities.base64Encode(json);
  const html = '<!DOCTYPE html><html><body><script>' +
    'parent.postMessage(atob("' + b64 + '"),"*");' +
    '<\/script></body></html>';
  return HtmlService.createHtmlOutput(html);
}

function getMime(ext) {
  const m = { ".pdf":"application/pdf", ".doc":"application/msword", ".docx":"application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
  return m[ext] || "application/octet-stream";
}
