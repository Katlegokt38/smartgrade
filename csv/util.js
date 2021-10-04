const CsvParser = require("json2csv").Parser;

export const downloadResource = (res, fileName, fields, data) => {
  const json2csv = new CsvParser({ fields });
  const csv = json2csv.parse(data);
  res.header('Content-Type', 'text/csv');
  res.attachment(fileName);
  return res.send(csv);
}

