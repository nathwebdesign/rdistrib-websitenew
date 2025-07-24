// Configuration des tarifs Express RP (Région Parisienne)

import { villesExpressRP } from './zones-express-rp';

export interface TarifExpressRP {
  vehicle: string;
  prices: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
}

// Tarifs fixes par type de véhicule et zone
export const tarifsExpressRP: TarifExpressRP[] = [
  {
    vehicle: 'Break',
    prices: {
      A: 45,
      B: 50,
      C: 70,
      D: 90
    }
  },
  {
    vehicle: 'Fourgon',
    prices: {
      A: 70,  // CORRECT selon grille
      B: 80,  // CORRECT selon grille
      C: 100, // CORRECT selon grille
      D: 120  // CORRECT selon grille
    }
  },
  {
    vehicle: 'GV 20m³',
    prices: {
      A: 90,
      B: 105,
      C: 120,
      D: 135
    }
  },
  {
    vehicle: 'Porteur',
    prices: {
      A: 210,
      B: 230,
      C: 260,
      D: 290
    }
  },
  {
    vehicle: 'Semi',
    prices: {
      A: 290,
      B: 300,
      C: 330,
      D: 370
    }
  }
];

// Options supplémentaires pour Express RP
export const supplementOptionsExpressRP = {
  attente: 40, // €/heure
  manutention: 35, // € forfait
  hayon: 40, // € forfait
  matieresDangereuses: 0.25, // 25% du tarif de base
  tva: 0.20 // 20%
};

// Configuration des zones Express RP
export const zonesExpressRP = {
  A: {
    name: 'Zone A',
    departments: ['75', '93', '94'],
    cities: {
      '95': [
        'Argenteuil', 'Bezons', 'Cormeilles-en-Parisis', 'Deuil-la-Barre',
        'Enghien-les-Bains', 'Épinay-sur-Seine', 'Ermont', 'Montmorency',
        'Saint-Gratien', 'Sannois', 'Soisy-sous-Montmorency'
      ]
    }
  },
  B: {
    name: 'Zone B',
    departments: ['92'],
    cities: {
      '77': [
        'Bussy-Saint-Georges', 'Champs-sur-Marne', 'Chelles', 'Claye-Souilly',
        'Lagny-sur-Marne', 'Lognes', 'Meaux', 'Mitry-Mory', 'Noisiel',
        'Pontault-Combault', 'Roissy-en-Brie', 'Torcy', 'Villeparisis'
      ],
      '78': [
        'Carrières-sur-Seine', 'Chatou', 'Conflans-Sainte-Honorine',
        'Houilles', 'Le Vésinet', 'Maisons-Laffitte', 'Montesson',
        'Poissy', 'Saint-Germain-en-Laye', 'Sartrouville'
      ],
      '91': [
        'Athis-Mons', 'Brétigny-sur-Orge', 'Chilly-Mazarin', 'Corbeil-Essonnes',
        'Draveil', 'Évry-Courcouronnes', 'Grigny', 'Juvisy-sur-Orge',
        'Longjumeau', 'Massy', 'Montgeron', 'Morsang-sur-Orge', 'Palaiseau',
        'Ris-Orangis', 'Sainte-Geneviève-des-Bois', 'Savigny-sur-Orge',
        'Vigneux-sur-Seine', 'Viry-Châtillon', 'Yerres'
      ]
    }
  },
  C: {
    name: 'Zone C',
    cities: {
      '77': [
        'Brie-Comte-Robert', 'Combs-la-Ville', 'Coulommiers', 'Fontenay-Trésigny',
        'Le Mée-sur-Seine', 'Melun', 'Montereau-Fault-Yonne', 'Nemours',
        'Ozoir-la-Ferrière', 'Provins', 'Savigny-le-Temple', 'Vaux-le-Pénil'
      ],
      '78': [
        'Élancourt', 'Guyancourt', 'Les Clayes-sous-Bois', 'Mantes-la-Jolie',
        'Mantes-la-Ville', 'Maurepas', 'Montigny-le-Bretonneux', 'Plaisir',
        'Rambouillet', 'Trappes', 'Vélizy-Villacoublay', 'Versailles'
      ],
      '91': [
        'Arpajon', 'Brunoy', 'Crosne', 'Dourdan', 'Épinay-sous-Sénart',
        'Étampes', 'Les Ulis', 'Limours', 'Mennecy', 'Orsay', 'Saint-Michel-sur-Orge',
        'Villebon-sur-Yvette', 'Villemoisson-sur-Orge'
      ],
      '95': [
        'Beaumont-sur-Oise', 'Cergy', 'Écouen', 'Ézanville', 'Franconville',
        'Garges-lès-Gonesse', 'Gonesse', 'Goussainville', 'Herblay-sur-Seine',
        'Jouy-le-Moutier', 'Louvres', 'Montigny-lès-Cormeilles', 'Osny',
        'Pontoise', 'Saint-Ouen-l\'Aumône', 'Sarcelles', 'Taverny',
        'Vauréal', 'Villiers-le-Bel'
      ]
    }
  },
  D: {
    name: 'Zone D',
    cities: {
      '77': [
        'Autres communes du 77'
      ],
      '78': [
        'Autres communes du 78'
      ],
      '91': [
        'Autres communes du 91'
      ],
      '95': [
        'Autres communes du 95'
      ]
    }
  }
};

// Fonction pour déterminer la zone Express RP d'un code postal
export function getExpressRPZone(postalCode: string, cityName?: string): string | null {
  const dept = postalCode.substring(0, 2);
  
  // D'abord, chercher dans la liste des villes Express RP par code postal
  const villeByPostalCode = villesExpressRP.find(ville => 
    ville.codePostal === dept || ville.codePostal === postalCode.substring(0, 3) || ville.codePostal === postalCode
  );
  
  if (villeByPostalCode) {
    return villeByPostalCode.zone;
  }
  
  // Si pas trouvé par code postal, chercher par nom de ville si fourni
  if (cityName) {
    const normalizedCityName = cityName.toUpperCase().trim();
    const villeByName = villesExpressRP.find(ville =>
      ville.nom === normalizedCityName && ville.codePostal === dept
    );
    
    if (villeByName) {
      return villeByName.zone;
    }
  }
  
  // Ensuite, vérifier dans la structure zonesExpressRP
  for (const [zoneCode, zoneData] of Object.entries(zonesExpressRP)) {
    // Vérifier si le département entier est dans la zone
    if ('departments' in zoneData && zoneData.departments?.includes(dept)) {
      return zoneCode;
    }
    
    // Vérifier les villes spécifiques
    if (zoneData.cities && zoneData.cities[dept] && cityName) {
      const normalizedCityName = cityName.toLowerCase().trim();
      const cities = zoneData.cities[dept];
      
      // Pour la zone D, c'est "Autres communes"
      if (zoneCode === 'D' && cities.includes(`Autres communes du ${dept}`)) {
        // Si on arrive ici et qu'on n'a pas trouvé la ville dans les zones A, B, C
        // alors c'est une ville de la zone D
        continue; // On vérifie d'abord les autres zones
      }
      
      // Vérifier si la ville est dans la liste
      if (cities.some(city => city.toLowerCase() === normalizedCityName)) {
        return zoneCode;
      }
    }
  }
  
  // Si on est en Île-de-France mais pas trouvé dans les zones A, B, C
  // et que le département est 77, 78, 91 ou 95, alors c'est zone D
  if (['77', '78', '91', '95'].includes(dept)) {
    return 'D';
  }
  
  return null;
}

// Fonction pour déterminer si c'est une livraison Express RP
export function isExpressRP(departurePostalCode: string, destinationPostalCode: string): boolean {
  const departureDept = departurePostalCode.substring(0, 2);
  const destinationDept = destinationPostalCode.substring(0, 2);
  
  // Express RP si départ de Roissy (95) et destination en Île-de-France
  const ilesDeFranceDepts = ['75', '77', '78', '91', '92', '93', '94', '95'];
  
  // Vérifier si c'est un départ de Roissy (code postal commençant par 95)
  // et destination en Île-de-France
  return departureDept === '95' && ilesDeFranceDepts.includes(destinationDept);
}

// Fonction pour sélectionner le véhicule approprié
export function selectExpressRPVehicle(weight: number, volume: number, nombrePalettes?: number, hauteurMax?: number): string {
  // Volume en m³
  const volumeM3 = volume / 1000000;
  // Hauteur max en cm (si fournie)
  const hauteur = hauteurMax || 0;
  
  console.log('Sélection véhicule Express RP:', {
    weight,
    volumeM3,
    volume,
    nombrePalettes,
    hauteurMax
  });
  
  // Nombre de palettes (défaut à 1 si non spécifié)
  const nbPalettes = nombrePalettes || 1;
  
  // Sélection stricte selon la grille avec les dimensions spécifiques
  // Break: 1 palette 80x120x100 max, poids max 350kg
  if (nbPalettes <= 1 && hauteur <= 100 && weight <= 350) {
    console.log('-> Break sélectionné');
    return 'Break';
  }
  // Fourgon: 3 palettes 80x120x160 max, poids max 1200kg
  else if (nbPalettes <= 3 && hauteur <= 160 && weight <= 1200) {
    console.log('-> Fourgon sélectionné');
    return 'Fourgon';
  }
  // GV 20m³: 7 palettes 80x120x200 max, poids max 800kg (attention: limite poids inférieure au fourgon)
  else if (nbPalettes <= 7 && hauteur <= 200 && weight <= 800) {
    console.log('-> GV 20m³ sélectionné');
    return 'GV 20m³';
  }
  // Si le poids dépasse 800kg mais qu'on a moins de 7 palettes, on passe au Porteur
  // Porteur: 18 palettes 80x120x220 max, poids max 10000kg
  else if (nbPalettes <= 18 && hauteur <= 220 && weight <= 10000) {
    console.log('-> Porteur sélectionné');
    return 'Porteur';
  }
  // Semi: 33 palettes 80x120x240 max, poids max 24000kg
  else {
    console.log('-> Semi sélectionné');
    return 'Semi';
  }
}

// Fonction pour calculer le tarif Express RP
export function calculateExpressRPPrice(
  vehicle: string,
  zone: string,
  options: {
    attente?: number;
    manutention?: boolean;
    hayon?: boolean;
    matieresDangereuses?: boolean;
  }
): {
  basePrice: number;
  supplements: Record<string, number>;
  totalHT: number;
  tva: number;
  totalTTC: number;
} | null {
  // Trouver le tarif du véhicule
  const vehicleTarif = tarifsExpressRP.find(t => t.vehicle === vehicle);
  if (!vehicleTarif || !vehicleTarif.prices[zone as keyof typeof vehicleTarif.prices]) {
    return null;
  }
  
  const basePrice = vehicleTarif.prices[zone as keyof typeof vehicleTarif.prices];
  const supplements: Record<string, number> = {};
  let totalHT = basePrice;
  
  // Ajouter les suppléments
  if (options.attente && options.attente > 0) {
    supplements.attente = options.attente * supplementOptionsExpressRP.attente;
    totalHT += supplements.attente;
  }
  
  if (options.manutention) {
    supplements.manutention = supplementOptionsExpressRP.manutention;
    totalHT += supplements.manutention;
  }
  
  if (options.hayon) {
    supplements.hayon = supplementOptionsExpressRP.hayon;
    totalHT += supplements.hayon;
  }
  
  if (options.matieresDangereuses) {
    supplements.matieresDangereuses = basePrice * supplementOptionsExpressRP.matieresDangereuses;
    totalHT += supplements.matieresDangereuses;
  }
  
  // Calcul TVA
  const tva = totalHT * supplementOptionsExpressRP.tva;
  const totalTTC = totalHT + tva;
  
  return {
    basePrice,
    supplements,
    totalHT,
    tva,
    totalTTC
  };
}