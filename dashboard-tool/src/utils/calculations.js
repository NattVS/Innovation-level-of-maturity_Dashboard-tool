export const getGlobalAverage = (data) => {
    const values = data.flatMap(row =>
        Object.keys(row)
            .filter(k => k.startsWith("D"))
            .map(k => Number(row[k]))
    );

    return values.reduce((a, b) => a + b, 0) / values.length;
};

export const getDimensionAverages = (data) => {
    const dimensions = {};

    data.forEach(row => {
        Object.keys(row).forEach(key => {
            if (key.startsWith("D")) {
                const dim = key.split(".")[0];
                if (!dimensions[dim]) dimensions[dim] = [];
                dimensions[dim].push(Number(row[key]));
            }
        });
    });

    return Object.fromEntries(
        Object.entries(dimensions).map(([k, v]) => [
            k,
            v.reduce((a, b) => a + b, 0) / v.length
        ])
    );
};

export const getHierarchyAverages = (data) => {
    const groups = {
        Estratégico: [],
        Táctico: [],
        Operativo: []
    };

    data.forEach(row => {
        const level = row["JERARQUÍA"];
        if (groups[level]) {
            groups[level].push(row);
        }
    });

    const calcAvg = (rows) => {
        if (rows.length === 0) return 0;

        const values = rows.flatMap(r =>
            Object.keys(r)
                .filter(k => k.startsWith("D"))
                .map(k => Number(r[k]))
        );

        return values.reduce((a, b) => a + b, 0) / values.length;
    };

    return {
        estratégico: calcAvg(groups["Estratégico"]),
        táctico: calcAvg(groups["Táctico"]),
        operativo: calcAvg(groups["Operativo"])
    };
};

export const getGap = (hierarchy) => {
    const valores = [hierarchy.estratégico, hierarchy.táctico, hierarchy.operativo];
    return Math.max(...valores) - Math.min(...valores);
};

export const getRadarAndGapData = (data, dimensionAverages) => {
    const dimensions = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'];
    const hierarchies = ['Estratégico', 'Táctico', 'Operativo'];

    const radarData = dimensions.map(dim => {
        let result = { subject: dim };
        hierarchies.forEach(h => {
            const hRecords = data.filter(r => r.JERARQUÍA === h);
            const values = hRecords.flatMap(r =>
                Object.keys(r).filter(k => k.startsWith(`${dim}.`)).map(k => Number(r[k]) || 0)
            );
            result[h] = values.length > 0 ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)) : 0;
        });
        return result;
    });

    const gapsPerDimension = radarData.map(item => {
        const valores = [item['Estratégico'], item['Táctico'], item['Operativo']];
        const maximaDesconexion = Math.max(...valores) - Math.min(...valores);

        const dimAvg = dimensionAverages ? dimensionAverages[item.subject] : 0;

        let severidadBrecha = "BAJA";
        if (dimAvg < 3) {
            severidadBrecha = "ALTA";
        } else if (dimAvg <= 4.49) {
            severidadBrecha = "MEDIA";
        }

        return {
            dim: item.subject,
            estAvg: item['Estratégico'],
            tacAvg: item['Táctico'],
            opeAvg: item['Operativo'],
            gap: Number(maximaDesconexion.toFixed(2)),
            dimAvg: dimAvg,
            severidadBrecha: severidadBrecha
        };
    }).sort((a, b) => b.gap - a.gap);

    return { radarData, gapsPerDimension };
};

export const getQualitativeMatrix = (rawCualitativos) => {
    const matrix = {};
    if (!rawCualitativos || rawCualitativos.length === 0) return matrix;

    let startRow = -1;
    for (let i = 0; i < rawCualitativos.length; i++) {
        if (rawCualitativos[i][0] === "RÚBRICA DE BRECHAS CRÍTICAS ENTRE DIMENSIONES") {
            startRow = i + 1;
            break;
        }
    }

    if (startRow === -1 || startRow >= rawCualitativos.length) return matrix;

    const headers = rawCualitativos[startRow];

    const colKeys = headers.map(h => (typeof h === 'string' ? h.split(' ')[0] : null));

    for (let i = startRow + 1; i < rawCualitativos.length; i++) {
        const row = rawCualitativos[i];
        if (!row || !row[0] || typeof row[0] !== 'string') continue;

        const rowDimKey = row[0].split(' ')[0];
        if (!rowDimKey.startsWith('D')) continue;

        matrix[rowDimKey] = {};

        for (let j = 1; j < row.length; j++) {
            const colDimKey = colKeys[j];
            if (colDimKey && colDimKey.startsWith('D')) {
                matrix[rowDimKey][colDimKey] = row[j];
            }
        }
    }
    return matrix;
};

export const getAnalysisData = (rawCualitativos) => {
    const analysis = {
        fortalezas: [],
        debilidades: [],
        recomendaciones: [],
        practicas: []
    };
    if (!rawCualitativos || rawCualitativos.length === 0) return analysis;

    let fortalezasIdx = -1;
    let debilidadesIdx = -1;
    let rubricaIdx = -1;

    let recomendacionesIdx = -1;
    let recomCol = -1;

    let practicasIdx = -1;
    let practCol = -1;

    rawCualitativos.forEach((row, i) => {
        row.forEach((cell, j) => {
            const cellText = String(cell || "").toUpperCase().trim();

            if (cellText.includes("FORTALEZAS IDENTIFICADAS") && j === 0) {
                fortalezasIdx = i;
            }
            if ((cellText.includes("DEBILIDADES IDENTIFICADAS") || cellText.includes("DEBIBILIDADES IDENTIFICADAS")) && j === 0) {
                debilidadesIdx = i;
            }
            if (cellText.includes("RÚBRICA DE BRECHAS CRÍTICAS")) {
                rubricaIdx = i;
            }
            if (cellText.includes("RECOMENDACIONES - POR HORIZONTE TEMPORAL")) {
                recomendacionesIdx = i;
                recomCol = j;
            }
            if (cellText.includes("PRÁCTICAS METODOLÓGICAS TRANSFERIBLES")) {
                practicasIdx = i;
                practCol = j;
            }
        });
    });
    const extractLeftSection = (start, end) => {
        const items = [];
        const limit = end !== -1 ? end : rawCualitativos.length;
        for (let i = start + 1; i < limit; i++) {
            const row = rawCualitativos[i];
            if (!row || !row[0]) continue;

            const title = String(row[0]).trim();
            if (title.toLowerCase() === "título" || title.toLowerCase() === "titulo") continue;
            if (title.toUpperCase().includes("DEBILIDADES") || title.toUpperCase().includes("RÚBRICA")) break;

            let info = "";
            const maxCol = recomCol !== -1 ? recomCol : row.length;
            for (let j = 1; j < maxCol; j++) {
                if (row[j] && String(row[j]).trim() !== "") {
                    info = String(row[j]).trim();
                    break;
                }
            }
            if (title !== "") items.push({ title, info });
        }
        return items;
    };

    if (fortalezasIdx !== -1) {
        analysis.fortalezas = extractLeftSection(fortalezasIdx, debilidadesIdx);
    }
    if (debilidadesIdx !== -1) {
        analysis.debilidades = extractLeftSection(debilidadesIdx, rubricaIdx);
    }

    if (recomendacionesIdx !== -1 && recomCol !== -1) {
        const limit = practicasIdx !== -1 ? practicasIdx : (rubricaIdx !== -1 ? rubricaIdx : rawCualitativos.length);
        for (let i = recomendacionesIdx + 2; i < limit; i++) {
            const row = rawCualitativos[i];
            if (!row) continue;

            const inmediato = String(row[recomCol] || "").trim();
            const mediano = String(row[recomCol + 1] || "").trim();
            const largo = String(row[recomCol + 2] || "").trim();

            if (inmediato.toUpperCase().includes("INMEDIATO") || inmediato.toUpperCase().includes("PRÁCTICA")) continue;

            if (inmediato || mediano || largo) {
                analysis.recomendaciones.push({ inmediato, mediano, largo });
            }
        }
    }

    if (practicasIdx !== -1 && practCol !== -1) {
        const limit = rubricaIdx !== -1 ? rubricaIdx : rawCualitativos.length;
        for (let i = practicasIdx + 2; i < limit; i++) {
            const row = rawCualitativos[i];
            if (!row) continue;

            const practica = String(row[practCol] || "").trim();
            const descripcion = String(row[practCol + 1] || "").trim();
            const resultados = String(row[practCol + 2] || "").trim();

            if (practica.toUpperCase().includes("PRÁCTICA") || practica.toUpperCase().includes("RÚBRICA")) continue;

            if (practica || descripcion || resultados) {
                analysis.practicas.push({ practica, descripcion, resultados });
            }
        }
    }

    return analysis;
};