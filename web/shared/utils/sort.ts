import {
  Candidate,
  EnrolledStudent,
  EnrolledStudentGrade,
  EnrolledStudentStageGrade,
  RetakerStudent,
  Student,
  StudyProgram
} from 'shared/interfaces';

/** Sort `Students` by `firstSurname` then `secondSurname` and then `names | firstName` */
export const sortStudents = (a: Student, b: Student) => {
  const fsurname1 = a.firstSurname.toLowerCase();
  const fsurname2 = b.firstSurname.toLowerCase();
  const ssurname1 = a.secondSurname.toLowerCase();
  const ssurname2 = b.secondSurname.toLowerCase();
  const fname1 = a.firstName.toLowerCase();
  const fname2 = b.firstName.toLowerCase();
  const statusfsurname = fsurname1.localeCompare(fsurname2);
  if (statusfsurname !== 0) { return statusfsurname; }
  const statusssurname = ssurname1.localeCompare(ssurname2);
  if (statusssurname !== 0) {return statusssurname; }
  const statusnames = fname1.localeCompare(fname2);
  if (statusnames !== 0) {return statusnames; }
  return 0;
};

/** Sort `Candidates` by `firstSurname` then `secondSurname` and then `names | firstName` */
export const sortCandidates = (a: Candidate, b: Candidate) => {
  const s1 = toStudent(a);
  const s2 = toStudent(b);
  return sortStudents(s1, s2);
};

function toStudent(c: Candidate): Student {
  return {
    firstSurname: c.apellidoPaterno || '',
    secondSurname: c.apellidoMaterno || '',
    firstName: c.nombres || ''
  } as Student;
}

type StudentWithin = Partial<EnrolledStudent | EnrolledStudentGrade | RetakerStudent>;

/**
 * Sort `StudentsWithin` by `firstSurname` then `secondSurname` and then `names | firstName`
 *
 * a `StudentWithin` could be:
 * - `EnrolledStudent`
 * - `EnrolledStudentGrade`
 * - `RetakerStudent`
 * - `more...`
 *
 * Because they _might have_ an `Student` object inside of it.
 */
export const sortStudentsWithin = (a: StudentWithin, b: StudentWithin) => {
  const s1 = a.student;
  const s2 = b.student;
  if (!s1 || !s2) {
    return 0;
  }
  return sortStudents(s1, s2);
};

export const sortStudyProgram = (a: StudyProgram, b: StudyProgram, sortBySemester = false) => {
  if (sortBySemester) {
    return (b.order - a.order) && (a.semester - b.semester);
  }
  return b.order - a.order;
};

export const sortStageGrade = (a: EnrolledStudentStageGrade, b: EnrolledStudentStageGrade) => a.stageNumber - b.stageNumber;

type OrderBy<T> = {
  field: keyof T;
  order: 'asc' | 'desc';
  thenBy?: OrderBy<T>;
} | {
  fieldMap: string;
  order: 'asc' | 'desc';
  thenBy?: OrderBy<T>;
};

export const sort = <T> (a: T, b: T, orderBy?: OrderBy<T>): number => {
  if (orderBy != null) {
    let _a: unknown;
    let _b: unknown;
    let _d: 'asc' | 'desc';
    let _orderBy = orderBy;
    let _compare = 0;
    do {
      if ('fieldMap' in _orderBy) {
        if (!/\./.test(_orderBy.fieldMap))
          throw new Error('The path should be separated by dots "." (example: myObj.myOtherObj.myProp)');
        const fieldMap = _orderBy.fieldMap.split('.');
        let tempA = a;
        let tempB = b;
        fieldMap.forEach(field => {
          if (field in tempA) {
            tempA = tempA[field];
            tempB = tempB[field];
          } else {
            throw new Error(`Make sure the fields you're mapping exists on the object, cannot map "${fieldMap.join('.')}"`);
          }
        });
        _a = tempA;
        _b = tempB;
      } else {
        _a = a[_orderBy.field];
        _b = b[_orderBy.field];
      }
      _d = _orderBy.order;
      _compare = compare(_a, _b, _d);
      if (_compare) return _compare;
      _orderBy = _orderBy.thenBy;
    } while (_orderBy != undefined);
    return _compare;
  }
  return compare(a, b);
};

const compare = (a: any, b: any, direction: 'asc' | 'desc' = 'asc'): number => {
  const _a = a as unknown;
  const _b = b as unknown;
  const desc = direction === 'desc';
  switch (typeof a) {
    case 'string':
      if (desc) return (_b as string).localeCompare(_a as string);
      return (_a as string).localeCompare(_b as string);
    case 'number':
      if (desc) return (_b as number) - (_a as number);
      return (_a as number) - (_b as number);
    case 'object':
      if (a instanceof Date) {
        if (desc) return (_b as Date).getTime() - (_a as Date).getTime();
        return (_a as Date).getTime() - (_b as Date).getTime();
      }
      if (a == null) {
        return 0;
      }
      throw new Error(`You shouldn't try to order by an "object", try ordering by a "primitive" or a "Date"`);
    default:
      return 0;
  }
};
