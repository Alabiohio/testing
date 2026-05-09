const categorySlugMap: Record<string, string> = {
  fingerlings: "Fingerlings",
  juveniles: "Juvenile Catfish",
  "table-size": "Fresh Table-Size",
  smoked: "Smoked Catfish",
  broodstock: "Broodstock",
};

export function toCategorySlug(categoryName: string) {
  const normalized = categoryName.trim().toLowerCase();

  if (normalized.includes("fingerling")) return "fingerlings";
  if (normalized.includes("juvenile")) return "juveniles";
  if (normalized.includes("table-size") || normalized.includes("table size")) return "table-size";
  if (normalized.includes("smoked")) return "smoked";
  if (normalized.includes("broodstock")) return "broodstock";

  return normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getCategoryDisplayName(categorySlug: string) {
  return categorySlugMap[categorySlug] || categorySlug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function resolveCategoryName(categorySlug: string, categoryNames: string[]) {
  return categoryNames.find((categoryName) => toCategorySlug(categoryName) === categorySlug) || null;
}
