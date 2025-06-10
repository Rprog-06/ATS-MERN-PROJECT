// utils/resumeParser.js
const fs = require("fs");
const pdfParse = require("pdf-parse");

// You can later fetch this from job description
const requiredKeywords = ["JavaScript", "React", "Node.js", "MongoDB", "Express"];

const parseResumeAndScore = async (filePath,keywords) => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  const resumeText = data.text.toLowerCase();

  const matchedKeywords = keywords.filter(keyword =>
    resumeText.includes(keyword.toLowerCase())
  );

  const score = Math.round((matchedKeywords.length /  keywords.length) * 100);

  return { score, matchedKeywords,totalKeywords: keywords.length };
};

module.exports = parseResumeAndScore;