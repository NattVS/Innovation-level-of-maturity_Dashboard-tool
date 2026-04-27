import { useState } from "react";
import { parseExcel } from "../data/parser";
import {
    getGlobalAverage,
    getDimensionAverages,
    getHierarchyAverages,
    getGap,
    getRadarAndGapData // <-- Importa la nueva función
} from "../utils/calculations";

export const useSurveyData = () => {
    const [surveyData, setSurveyData] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadExcel = async (file) => {
        try {
            setLoading(true);
            const rawData = await parseExcel(file);

            // cálculos
            const globalAvg = getGlobalAverage(rawData);
            const dimensions = getDimensionAverages(rawData);
            const hierarchy = getHierarchyAverages(rawData);
            const gap = getGap(hierarchy);
            const { radarData, gapsPerDimension } = getRadarAndGapData(rawData); // <-- Calcula los nuevos datos

            setSurveyData({
                raw: rawData,
                globalAvg,
                dimensions,
                hierarchy,
                gap,
                radarData,        // <-- Pásalo al estado
                gapsPerDimension  // <-- Pásalo al estado
            });

        } catch (error) {
            console.error(error);
            alert("Error procesando el archivo");
        } finally {
            setLoading(false);
        }
    };

    return { surveyData, loading, loadExcel };
};