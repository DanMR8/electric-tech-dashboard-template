import type { DmrTheme } from "./variables-visuales";

export function crearTemaEcharts(dmrTheme: DmrTheme) {
    const axisCommon = {
        axisLine: { lineStyle: { color: dmrTheme.charts.axis } },
        axisTick: { lineStyle: { color: dmrTheme.charts.axis } },
        axisLabel: {
            color: dmrTheme.charts.axisLabel,
            fontFamily: dmrTheme.typography.fontFamily.numeric,
            fontSize: dmrTheme.typography.numeric.xs.fontSize,
        },
        splitLine: { lineStyle: { color: dmrTheme.charts.gridLine } },
        nameTextStyle: {
            color: dmrTheme.charts.axisLabel,
            fontFamily: dmrTheme.typography.fontFamily.base,
        },
    };

    return {
        color: [...dmrTheme.charts.categorical],
        backgroundColor: "transparent",
        textStyle: {
            color: dmrTheme.textos.secondary,
            fontFamily: dmrTheme.typography.fontFamily.base,
            fontSize: dmrTheme.typography.md.fontSize,
        },
        title: {
            textStyle: {
                color: dmrTheme.textos.primary,
                fontFamily: dmrTheme.typography.fontFamily.base,
                fontSize: dmrTheme.typography.xl.fontSize,
            },
            subtextStyle: { color: dmrTheme.textos.secondary },
        },
        legend: { textStyle: { color: dmrTheme.textos.secondary } },
        categoryAxis: axisCommon,
        valueAxis: axisCommon,
        timeAxis: axisCommon,
        logAxis: axisCommon,
        tooltip: {
            backgroundColor: dmrTheme.charts.tooltip.background,
            borderColor: dmrTheme.charts.tooltip.border,
            textStyle: {
                color: dmrTheme.charts.tooltip.text,
                fontFamily: dmrTheme.typography.fontFamily.numeric,
            },
        },
        financial: {
            positive: dmrTheme.charts.positive,
            negative: dmrTheme.charts.negative,
            projected: dmrTheme.charts.projected,
        },
    } as const;
}
