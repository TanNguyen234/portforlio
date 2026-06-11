import type { PortfolioData } from "@/lib/portfolio";
import type { Locale } from "@/lib/i18n";

export const localizePortfolio = (
  data: PortfolioData,
  locale: Locale
): PortfolioData => {
  if (locale !== "vi") {
    return data;
  }

  const localized = JSON.parse(JSON.stringify(data)) as PortfolioData;

  if (data.hero.headlineVi) {
    localized.hero.headline = data.hero.headlineVi;
  }
  if (data.hero.roleVi) {
    localized.hero.role = data.hero.roleVi;
  }
  if (data.hero.subheadVi) {
    localized.hero.subhead = data.hero.subheadVi;
  }
  if (data.hero.locationVi) {
    localized.hero.location = data.hero.locationVi;
  }
  if (data.hero.highlightsVi) {
    localized.hero.highlights = data.hero.highlightsVi;
  }

  if (data.about.titleVi) {
    localized.about.title = data.about.titleVi;
  }
  if (data.about.bodyVi) {
    localized.about.body = data.about.bodyVi;
  }
  if (data.about.education.schoolVi) {
    localized.about.education.school = data.about.education.schoolVi;
  }
  if (data.about.education.periodVi) {
    localized.about.education.period = data.about.education.periodVi;
  }
  if (data.about.education.majorVi) {
    localized.about.education.major = data.about.education.majorVi;
  }
  if (data.about.education.descVi) {
    localized.about.education.desc = data.about.education.descVi;
  }


  localized.experience = data.experience.map((item) => ({
    ...item,
    role: item.roleVi ?? item.role,
    summary: item.summaryVi ?? item.summary,
    bullets: item.bulletsVi ?? item.bullets,
  }));

  localized.projects = data.projects.map((project) => ({
    ...project,
    title: project.titleVi ?? project.title,
    description: project.descriptionVi ?? project.description,
    highlights: project.highlightsVi ?? project.highlights,
  }));

  localized.skills.categories = data.skills.categories.map((category) => ({
    ...category,
    title: category.titleVi ?? category.title,
    items: category.itemsVi ?? category.items,
  }));

  if (data.achievementsVi) {
    localized.achievements = data.achievementsVi;
  }

  if (data.contact.emailVi) {
    localized.contact.email = data.contact.emailVi;
  }
  if (data.contact.phoneVi) {
    localized.contact.phone = data.contact.phoneVi;
  }
  if (data.contact.githubVi) {
    localized.contact.github = data.contact.githubVi;
  }
  if (data.contact.linkedinVi) {
    localized.contact.linkedin = data.contact.linkedinVi;
  }
  if (data.contact.cvVi) {
    localized.contact.cv = data.contact.cvVi;
  }
  if (data.contact.locationVi) {
    localized.contact.location = data.contact.locationVi;
  }

  return localized;
};
