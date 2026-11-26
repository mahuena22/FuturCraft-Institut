export type CampusImage = { src: string; alt: string };

export const campusImagesBySlug: Record<string, { label: string; images: CampusImage[] }> = {
  "developpement-web-fullstack": {
    label: "Étudiants en développement web",
    images: [
      { src: "/images/campus/dev/01.jpg", alt: "Étudiants en développement web pendant un atelier pratique" },
      { src: "/images/campus/dev/04.jpg", alt: "Apprenants en programmation travaillant sur un projet web" },
      { src: "/images/campus/dev/07.jpg", alt: "Session de codage en développement web à FuturCraft" },
      { src: "/images/campus/dev/10.jpg", alt: "Étudiants en développement web en salle informatique" },
    ],
  },
  "photographie-cadrage-et-montage-video": {
    label: "Étudiants en audiovisuel",
    images: [
      { src: "/images/campus/audiovisuel/01.jpg", alt: "Étudiants en audiovisuel pendant un exercice de prise de vue" },
      { src: "/images/campus/audiovisuel/02.jpg", alt: "Atelier pratique de cadrage et production audiovisuelle" },
      { src: "/images/campus/audiovisuel/04.jpg", alt: "Apprenants en audiovisuel en séance de terrain" },
      { src: "/images/campus/audiovisuel/06.jpg", alt: "Étudiants en photographie et montage vidéo à FuturCraft" },
    ],
  },
  "maintenance-informatique-et-reseau": {
    label: "Étudiants en maintenance & réseau",
    images: [
      { src: "/images/campus/maintenance/01.jpg", alt: "Étudiants en maintenance informatique pendant un atelier matériel" },
      { src: "/images/campus/maintenance/03.jpg", alt: "Diagnostic et maintenance d'équipements informatiques" },
      { src: "/images/campus/cybersecurite/02.jpg", alt: "Atelier pratique réseau informatique" },
      { src: "/images/campus/maintenance/05.jpg", alt: "Apprenants en maintenance informatique et réseau" },
    ],
  },
};

export function getCampusImagesForSlug(slug: string) {
  return campusImagesBySlug[slug];
}
