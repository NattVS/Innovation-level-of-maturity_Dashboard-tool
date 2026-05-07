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

export const getRadarAndGapData = (data) => {
    const dimensions = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'];
    const hierarchies = ['Estratégico', 'Táctico', 'Operativo'];

    const radarData = dimensions.map(dim => {
        let result = { subject: dim };

        hierarchies.forEach(h => {
            const hRecords = data.filter(r => r.JERARQUÍA === h);

            const values = hRecords.flatMap(r =>
                Object.keys(r)
                    .filter(k => k.startsWith(`${dim}.`))
                    .map(k => Number(r[k]) || 0)
            );

            result[h] = values.length > 0
                ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2))
                : 0;
        });

        return result;
    });

    const gapsPerDimension = radarData.map(item => {
        const valores = [item['Estratégico'], item['Táctico'], item['Operativo']];
        const maximaDesconexion = Math.max(...valores) - Math.min(...valores);

        return {
            dim: item.subject,
            estAvg: item['Estratégico'],
            tacAvg: item['Táctico'],
            opeAvg: item['Operativo'],
            gap: Number(maximaDesconexion.toFixed(2))
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