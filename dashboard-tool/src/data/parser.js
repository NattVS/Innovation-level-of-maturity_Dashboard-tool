import * as XLSX from "xlsx";

export const parseExcel = async (file) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    const sheet1Name = workbook.SheetNames[0];
    const sheet1 = workbook.Sheets[sheet1Name];
    if (!sheet1) throw new Error("No se encontró ninguna hoja en el archivo");
    const rawData = XLSX.utils.sheet_to_json(sheet1);

    let rawCualitativos = [];
    if (workbook.SheetNames.length >= 3) {
        const sheet3Name = workbook.SheetNames[2];
        const sheet3 = workbook.Sheets[sheet3Name];
        rawCualitativos = XLSX.utils.sheet_to_json(sheet3, { header: 1 });
    }

    return { rawData, rawCualitativos };
};