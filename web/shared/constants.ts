import { User, Dictionary } from './interfaces';
import moment from 'moment';

export enum Profile {
  /** Administrador */
  ADMIN = 1,
  /** Cobratario */
  COBRATARIO,
  /** Vendedor */
  VENDEDOR,
  /** Bodeguero */
  BODEGUERO,
  /** Capturista */
  CAPTURISTA,
  /** Vendedor/Cobratario */
  VENDEDOR_COBRATARIO
}

export enum PARTIALS {
  FIRSTPARTIAL = 1,
  SECONDPARTIAL,
  THIRDPARTIAL,
  /**
   * All Partial (P1, P2, P3)
   */
  ALLPARTIAL,
  ONLYFINAL,
  /**
   * All Partial (P1, P2, P3)
   * +
   * Ordinary
   * +
   * Final
   */
  ALLPARTIALOF
}

export function isProfile(user: User, profile: Profile) {
  if (!user || !profile) return false;
  return user.profile == profile;
}

/**
 * Font Color anf FillColor
 */
export const Silver = '#a7abac';
export const LightGray = '#C0C0C0';
export const Orange = '#f36c24';
export const MatteBlack = '#333638';
export const White = '#ffffff';
export const Black = '#000000';
export const RedFailed = '#FF0000';
export const DefaultBorderColor =  '#d4d4d4';

/**
 * Color Palette
 */
export const Purple = '#A63496';
export const Gold = '#F7BC35';
export const Salmon = '#FA7268';
export const Gray = '#4D4D4D';
export const Cyan = '#00CAC0';
export const Yellow = '#FFF200';
export const Pink = '#FF61B7';


export const getYear = (date, dateShort = false) =>  moment(date).format(`${dateShort ? 'YY' : 'YYYY'}`);
export const calculateGeneration = (enrollment: string): string => {
  const currentCentury = moment().year().toString().substr(0, 2);
  const YY = enrollment.substr(0, 2);
  const completedYear = parseInt(`${currentCentury}${YY}`);
  return `${completedYear} - ${completedYear + 3} `;
};

export const getFormatDate = (date) => moment(date).format('DD/MM/YYYY');
export const age = (date) => {
  const now = moment();
  const birthday = moment(date);

  return now.diff(birthday, 'year');
};

/**
 * Types of incidents
 * proposed by the `CECyTEC`
 */
export const TYPE_OF_INCIDENCE = {
  academic: 'Académico',
  health: 'Salud',
  economic: 'Económico',
  psychological: 'Psicológico',
  family: 'Familiar/Personal',
  behavioral: 'Conductal',
  other: 'Otro'
};

export function getTypeIncidence(type): string {
  switch (type) {
    case 'academic':
    case 'health':
    case 'economic':
    case 'psychological':
    case 'family':
    case 'behavioral':
    case 'other':
      return TYPE_OF_INCIDENCE[type];
    default:
      return '';
  }
}

export const TYPE_OF_SHIFTS = {
  morning: 'Matutino',
  evening: 'Vespertino'
};

export const STATUS_PREREGISTRATION = [
  {
    id: 1,
    name: 'Online - SEDUC'
  },
  {
    id: 2,
    name: 'Online - Manual'
  },
  {
    id: 3,
    name: 'SEDUC - Portal'
  },
  {
    id: 4,
    name: 'Manual - Portal'
  },
  {
    id: 5,
    name: 'Otro (importado)'
  }
];

export const getShift = (shift: string) => {
  switch (shift) {
    case 'morning':
    case 'evening':
      return TYPE_OF_SHIFTS[shift];
    default:
      return shift;
  }
};

export enum MimeTypes {
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  PDF = 'application/pdf',
  JPG = 'image/jpg',
  PNG = 'image/png'
}

export const schoolLevelStatus = [
  {
    id: true,
    label: 'Terminado'
  },
  {
    id: false,
    label: 'Trunco'
  }
];

const mapToObject = <T, K extends keyof T>(items: Map<T[K], T[]>) => {
  const object: Dictionary<T[]> = {};
  for (const item of [...items]) {
    const [key, value] = item;
    object[key as any] = value;
  }
  return object;
};

export const groupByItems = <T, K extends keyof T>(items: T[], key: K, convertMapToObject = false) => {
  const newItems = new Map<T[K], T[]>();
  items.map((item) => {
    const property = item[key];
    if (!newItems.has(property)) {
      newItems.set(property, items.filter( itemFilter => itemFilter[key] === property));
    }
  });

  return convertMapToObject ? mapToObject(newItems) : newItems;
};

export const padLeft = (value: string, length: number) => {
  return (value.length < length) ? padLeft('0' + value, length) : value;
};

/**
 * Remove elements duplicates
 *
 * by @class Set
 *
 * [... new Set(array)]
 *
 * Not Support Object
 */
export const removeDuplicates = <T>(items: T[]): T[] => {
  let array: T[];
  array = [...new Set<T>(items)];
  return array;
};
