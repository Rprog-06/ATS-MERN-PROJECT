const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateOfferLetter = (applicant, job) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const fileName = `${applicant.name}_OfferLetter.pdf`;
    const filePath = path.join(__dirname, "../offers", fileName);

    // Create write stream
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Content
    doc.fontSize(18).text("Kanaka Software Solutions", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text(`Offer Letter`, { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Dear ${applicant.name},`);
    doc.moveDown();
    doc.text(`We are pleased to offer you the position of ${job.title} at Kanaka Software.`);
    doc.moveDown();
    doc.text(`Location: ${job.location || "Remote"}`);
    doc.text(`Technology: ${applicant.technology || "General Development"}`);
    doc.moveDown();
    doc.text(`Please confirm your acceptance by replying to this email.`);
    doc.moveDown();
    doc.text(`Regards,\nKanaka HR Team`);

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", (err) => reject(err));
  });
};

module.exports = generateOfferLetter;