import * as XLSX from "xlsx";

export const parseExcel = async (file) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    // intenta con el nombre real de tu hoja
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
        throw new Error("No se encontró ninguna hoja en el archivo");
    }

    const json = XLSX.utils.sheet_to_json(sheet);

    return json;
};