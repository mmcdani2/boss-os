export type AreaLine = {
  areaName: string;
  applicationType: string;
  foamType: string;
  squareFeet: string;
  averageThicknessIn: string;
};

export type MaterialLine = {
  manufacturer: string;
  lotNumber: string;
  setsUsed: string;
  theoreticalYieldPerSet: string;
};

export type FormState = {
  jobDate: string;
  customerName: string;
  jobNumber: string;
  crewLead: string;
  helpersText: string;
  rigName: string;
  timeOnJob: string;
  ambientTempF: string;
  substrateTempF: string;
  humidityPercent: string;
  downtimeMinutes: string;
  downtimeReason: string;
  otherNotes: string;
  photosUploadedToHcp: boolean;
  areaLines: AreaLine[];
  materialLines: MaterialLine[];
};

export function todayValue() {
  return new Date().toISOString().slice(0, 10);
}

export function emptyAreaLine(): AreaLine {
  return {
    areaName: "",
    applicationType: "",
    foamType: "",
    squareFeet: "",
    averageThicknessIn: "",
  };
}

export function emptyMaterialLine(): MaterialLine {
  return {
    manufacturer: "",
    lotNumber: "",
    setsUsed: "",
    theoreticalYieldPerSet: "",
  };
}

export function createInitialState(): FormState {
  return {
    jobDate: todayValue(),
    customerName: "",
    jobNumber: "",
    crewLead: "",
    helpersText: "",
    rigName: "",
    timeOnJob: "",
    ambientTempF: "",
    substrateTempF: "",
    humidityPercent: "",
    downtimeMinutes: "",
    downtimeReason: "",
    otherNotes: "",
    photosUploadedToHcp: false,
    areaLines: [emptyAreaLine()],
    materialLines: [emptyMaterialLine()],
  };
}

export function cleanString(value: string) {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export function toNumber(value: string) {
  const trimmed = value.trim();

  if (!trimmed.length) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function deriveBoardFeet(squareFeet: string, averageThicknessIn: string) {
  const sf = toNumber(squareFeet);
  const thickness = toNumber(averageThicknessIn);

  if (sf === null || thickness === null) {
    return "";
  }

  return (sf * thickness).toFixed(2);
}

export function deriveTheoreticalTotalYield(setsUsed: string, theoreticalYieldPerSet: string) {
  const sets = toNumber(setsUsed);
  const yieldPerSet = toNumber(theoreticalYieldPerSet);

  if (sets === null || yieldPerSet === null) {
    return "";
  }

  return (sets * yieldPerSet).toFixed(2);
}

export function deriveActualYield(boardFeet: string, setsUsed: string) {
  const bf = toNumber(boardFeet);
  const sets = toNumber(setsUsed);

  if (bf === null || sets === null || sets <= 0) {
    return "";
  }

  return (bf / sets).toFixed(2);
}

export function deriveYieldPercent(boardFeet: string, theoreticalTotalYield: string) {
  const bf = toNumber(boardFeet);
  const theoretical = toNumber(theoreticalTotalYield);

  if (bf === null || theoretical === null || theoretical <= 0) {
    return "";
  }

  return ((bf / theoretical) * 100).toFixed(2);
}

export function buildSprayFoamTotals(form: FormState) {
  const totalBoardFeet = form.areaLines.reduce((sum, line) => {
    const value = Number(deriveBoardFeet(line.squareFeet, line.averageThicknessIn) || 0);
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);

  const setsByFoamType = form.materialLines.reduce<Record<string, number>>((acc, material, index) => {
    const foamType = form.areaLines[index]?.foamType?.trim();
    const setsUsed = Number(material.setsUsed || 0);

    if (!foamType || !Number.isFinite(setsUsed)) {
      return acc;
    }

    acc[foamType] = (acc[foamType] || 0) + setsUsed;
    return acc;
  }, {});

  const foamTypeTotals = Object.entries(setsByFoamType)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([foamType, totalSetsUsed]) => ({
      foamType,
      label: `Total Sets ${foamType
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")} Used`,
      totalSetsUsed: totalSetsUsed.toFixed(2),
    }));

  return {
    totalBoardFeet: totalBoardFeet.toFixed(2),
    foamTypeTotals,
  };
}

export function buildNormalizedAreaLines(form: FormState) {
  return form.areaLines
    .map((line) => ({
      areaName: cleanString(line.areaName),
      applicationType: cleanString(line.applicationType),
      foamType: cleanString(line.foamType),
      squareFeet: line.squareFeet.trim() || null,
      averageThicknessIn: line.averageThicknessIn.trim() || null,
    }))
    .filter(
      (line) =>
        line.areaName ||
        line.applicationType ||
        line.foamType ||
        line.squareFeet ||
        line.averageThicknessIn
    );
}

export function buildNormalizedMaterialLines(form: FormState) {
  return form.materialLines
    .map((line, index) => ({
      areaLineNumber: index + 1,
      manufacturer: cleanString(line.manufacturer),
      lotNumber: cleanString(line.lotNumber),
      setsUsed: line.setsUsed.trim() || null,
      theoreticalYieldPerSet: line.theoreticalYieldPerSet.trim() || null,
    }))
    .filter(
      (line) =>
        line.manufacturer || line.lotNumber || line.setsUsed || line.theoreticalYieldPerSet
    );
}
