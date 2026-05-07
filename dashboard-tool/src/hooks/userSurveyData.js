import { useState } from "react";
import { parseExcel } from "../data/parser";
import {
    getGlobalAverage,
    getDimensionAverages,
    getHierarchyAverages,
    getGap,
    getRadarAndGapData,
    getQualitativeMatrix
} from "../utils/calculations";

export const useSurveyData = () => {
    const [surveyData, setSurveyData] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadExcel = async (file) => {
        try {
            setLoading(true);
            const { rawData, rawCualitativos } = await parseExcel(file);

            //cálculos
            const globalAvg = getGlobalAverage(rawData);
            const dimensions = getDimensionAverages(rawData);
            const hierarchy = getHierarchyAverages(rawData);
            const gap = getGap(hierarchy);
            const { radarData, gapsPerDimension } = getRadarAndGapData(rawData);
            const qualMatrix = getQualitativeMatrix(rawCualitativos);

            setSurveyData({
                raw: rawData,
                globalAvg,
                dimensions,
                hierarchy,
                gap,
                radarData,
                gapsPerDimension,
                qualMatrix
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