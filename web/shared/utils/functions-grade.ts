import { CustomGrade, EnrolledStudentStageGrade, ReportCardStudyProgram, StudyProgram } from 'shared/interfaces';

export const roundGrade = (grade: number) => {
   let qualification: number;
   const fixed = (grade * 100).toFixed(2) as unknown;
   const intGrade = Math.trunc(fixed as number);
   if (grade < 5) {
      qualification = 5;
   } else if (grade < 6) {
      qualification = (Math.trunc(intGrade / 10)) / 10;
   } else {
      if (intGrade % 10 >= 5) {
         qualification = (Math.trunc(intGrade / 10) + 1) / 10;
      } else {
         qualification = Math.trunc(intGrade / 10) / 10;
      }
   }
   return qualification;
};

export const getAverageModule = (essg: EnrolledStudentStageGrade[], studyPrograms?: StudyProgram[], moduleCredits?: number) => {
   if (essg.length) {
      if ( moduleCredits ) {
         const neg = essg.filter(value => value.grade < 6);
         if (neg.length > 0) {
            return 5.0;
         }

         let avg = 0;
         essg.forEach(studentGrade => {
            const program = studyPrograms.find(sp => sp.id == studentGrade.studyProgramId);
            avg = avg + (studentGrade.grade * program.credits) / moduleCredits;
         });
         return roundGrade(avg);
      }

      return roundGrade(essg.reduce( (prev, current) => prev + current.grade, 0) / essg.length);
   }
   return null;
};

export const isFinding = (stageNumber: number, essg: EnrolledStudentStageGrade[]) => {
   if (essg.length) {
      const sgrade = essg.find( grade => grade.stageNumber === stageNumber);
      if (sgrade && sgrade.status === 'NP') {
        sgrade.grade = 0;
      }
      return sgrade;
   }
   return null;
};

export const findGrade = <T, K extends keyof T>(items: T[], key: K, value: T[K], partialNumber?: number): number => {
   if (items) {
      const exist = items.filter( a => {
         if (partialNumber && a['stageNumber']) {
            return a[key] === value && a['stageNumber'] === partialNumber;
         } else {
            return a[key] === value;
         }
      });

      if (exist.length > 0) {
         if (exist[0]['status'] && exist[0]['status'] === 'NP') {
            return 0;
         }
         return exist[0]['grade'];
      }
      return -1;
   }
   return -1;
};

export const getTotalFouls = (essg: EnrolledStudentStageGrade[]) => {
   if (essg.length) {
      const result = essg.reduce( (prev, current) => prev + current.absences, 0);
      return result > 0 ? result : null;
   }
   return null;
};

export const getAverageForProgram = (items: Array<CustomGrade | ReportCardStudyProgram>, property: string) => {
   const avg = items
                  .filter(item => !item.ignoreProgram )
                  .map(item => (item['EXT'] && isProperty(property)) ? item['EXT'] : item[property])
                  .filter(Boolean);
   if (avg.length) {
      return truncGrade(avg.reduce((a, b) => {
         if (!isTypeOfNumber(b) && checkEXTorCI(b)) {
            return a + extractNumber(b);
         }

         if (isTypeOfNumber(b)) {
            return a + b;
         }
         return a;
      }, 0) / avg.length);
   }
   return null;
};

export const truncGrade = (value: number) => {
   const trunc = Math.trunc(value);
   const rest = (value - trunc).toPrecision(2);
   const valueDecimal = rest.split('.')[1];
   const firstDigit = valueDecimal.substr(0, 1);
   const isZero = Number(firstDigit) === 0 ? 0 : (Math.trunc(Number(valueDecimal) / 10) / 10);
   return (trunc + isZero).toPrecision(2) as unknown as number;
};

export const checkEXTorCI = (grade: string) => {
   return grade.endsWith('EXT') || grade.endsWith('CI');
};

export const extractNumber = (grade: string) => {
   return parseFloat(grade.split(' ')[0]);
};

export const isTypeOfNumber = (value: number | string): boolean => {
   return typeof value === 'number';
};

export const isNP = (item: EnrolledStudentStageGrade) => {
   if (item.status === 'NP') {
      return 0;
   }
   return item.grade;
};

export const existValue = (
   value: number,
   messageError: string = 'N/D',
   messageOk?: string | number,
   condition?: boolean
   ): number | string => {
   if (value !== -1) {
      if (condition) {
         return messageError;
      }
      return messageOk ? messageOk : value;
   }
   return messageError;
};

export const includePrograms = (type: 'basic' | 'propaedeutic' | 'submodule' | 'module' | 'extracurricular') => {
   return ['submodule', 'extracurricular'].includes(type);
};

export const isProperty = (property: string): boolean => {
   return 'C' === property;
};
