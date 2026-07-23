/** Générateur de noms de rugbymen pour le bouton « dé » de la création. */

const PRENOMS = [
  "Antoine", "Baptiste", "Romain", "Julien", "Maxime", "Thomas", "Louis",
  "Damian", "Sione", "Tevita", "Manu", "Ardie", "Beauden", "Owen", "Finn",
  "Cheslin", "Faf", "Pieter", "Handré", "Bundee", "Johnny", "Tadhg",
  "Gaël", "Camille", "Grégory", "Sébastien", "Mathieu", "Yoann", "Virimi",
  "Emiliano", "Santiago", "Nicolás", "Marika", "Semi", "Levani",
];

const NOMS = [
  "Dupont", "Ntamack", "Alldritt", "Ollivon", "Fickou", "Danty", "Marchand",
  "Penaud", "Jelonch", "Willemse", "Vakatawa", "Bielle-Biarrey", "Ramos",
  "Kolisi", "Etzebeth", "Am", "Kolbe", "de Klerk", "Pollard", "Mapimpi",
  "Sexton", "Furlong", "Aki", "Doris", "van der Flier", "Ringrose",
  "Barrett", "Savea", "Cane", "Smith", "Retallick", "Mo'unga", "Ioane",
  "Farrell", "Itoje", "Tuilagi", "May", "Ford", "Genge", "Curry",
  "Cordero", "Matera", "Creevy", "Radradra", "Tuisova", "Nakarawa",
];

const pick = (a) => a[Math.floor(Math.random() * a.length)];

/** Un nom complet « Prénom Nom » tiré au hasard. */
export function nomAleatoire() {
  return `${pick(PRENOMS)} ${pick(NOMS)}`;
}
