import { IActionMapping, TreeModel, TreeNode } from 'angular-tree-component';
import { forkJoin } from 'rxjs';
import { Profile, isProfile } from 'shared/constants';
import {
  Campus,
  Dictionary,
  Group,
  ScholarCycle,
  StudyProgram,
  Teacher,
  TreeViewNode,
  TreeViewOptions,
  User
} from 'shared/interfaces';
import { sort } from 'shared/utils/sort';
import { StudyProgramService } from 'src/app/services';

const getTeacherName = (teacher: Teacher) => {
  if (!teacher)
    return 'Docente';
  const { name, first_surname: fsname, second_surname: ssname } = teacher;
  return `${name} ${fsname} ${ssname}`;
};

export abstract class Navigation {
  user: User;
  /**
   * Usa esta propiedad para controlar en qué parte de la navegación vas.
   *
   * Por ejemplo:
   *
   * 1. Planteles
   * 2. Grupos
   * 3. Docentes
   * 4. Materias (asignaturas)
   */
  step = 1;
  /* IDs de selección ⬇ */
  cycleId?: string;
  campusId?: string;
  groupId?: string;
  teacherId?: string;
  studyProgramId?: string;
  /** **alias:** `moduleId` */
  parentStudyProgramId?: string;
  /* Entidades privadas ⬇ */
  cycles: ScholarCycle[] = [];
  private $campuses: Campus[] = [];
  private $groups: Group[] = [];
  private $teachers: Teacher[] = [];
  private $studyPrograms: StudyProgram[] = [];
  /* Nodos convertidos a través de las entidades ⬇ */
  campusNodes: TreeViewNode[] = [];
  groupNodes: TreeViewNode[] = [];
  teacherNodes: TreeViewNode[] = [];
  studyProgramNodes: TreeViewNode[] = [];
  /* Entidades seleccionadas (para info.) ⬇ */
  cycle: ScholarCycle;
  campus: Campus;
  group: Group;
  teacher: Teacher;
  studyProgram: StudyProgram;

  cachedStudyPrograms: Dictionary<StudyProgram> = {};
  cachedModules: Dictionary<StudyProgram> = {};

  /** Usa esta propiedad para configurar las variables necesarias en todos los `TreeView` */
  private staticTreeOptions: TreeViewOptions = {
    useCheckbox: false
  };

  defaultTreeOptions: TreeViewOptions = {
    ...this.staticTreeOptions,
    actionMapping: {
      mouse: {
        click: this.defaultMouseClick.bind(this)
      }
    } as IActionMapping
  };

  treeOptionsForStudyProgram: TreeViewOptions = {
    ...this.staticTreeOptions,
    actionMapping: {
      mouse: {
        click: (_tree, node, _event) => {
          const sprogram = node.data.data as StudyProgram;
          const same = node.id == this.studyProgramId;
          switch (sprogram.type) {
            case 'module':
              node.toggleExpanded();
              break;
            case 'submodule':
              if (!same)
                this.onSelectStudyProgram(node.id, node.data.parent);
              break;
            default:
              if (!same)
                this.onSelectStudyProgram(node.id);
          }
          node.setIsActive(true);
        }
      }
    } as IActionMapping,
    getChildren: this.getStudyProgramChildren.bind(this)
  };

  constructor() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  defaultMouseClick(_tree: TreeModel, node: TreeNode, _event: any, ..._rest: any[]): any {
    const { id, data } = node;
    switch (data.kind) {
      case 'Campus':
        this.onSelectCampus(id);
        break;
      case 'Group':
        if (this.isTeacher) {
          this.onSelectGroupByTeacher(id);
        } else {
          this.onSelectGroup(id);
        }
        break;
      case 'Teacher':
        this.onSelectTeacher(id);
        break;
    }
  }

  abstract getStudyProgramChildren(node: TreeViewNode): Promise<TreeViewNode[]>;

  /** Define en este método la lógica al cargar los ciclos escolares */
  abstract loadCycles(): void;
  /** Define en este método la lógica al seleccionar un Campus en específico */
  abstract onSelectCampus(id: string): void;
  /** Define en este método la lógica al seleccionar un Grupo en específico */
  abstract onSelectGroup(id: string): void;
  /** Define en este método la lógica al seleccionar un Grupo en específico (realizado por un docente) */
  abstract onSelectGroupByTeacher(id: string): void;
  /** Define en este método la lógica al seleccionar un Maestro en específico */
  abstract onSelectTeacher(id: string): void;
  /** Define en este método la lógica al seleccionar una Asignatura/Materia en específico */
  abstract onSelectStudyProgram(id: string, moduleId?: string): void;
  /** Define en este método la lógica al seleccionar un paso en específico para la navegación */
  abstract goBack(step?: number): void;

  get canGoBack(): boolean {
    return this.isAdmin;
  }

  get isTeacher(): boolean {
    return isProfile(this.user, Profile.TEACHER);
  }

  get isAdmin(): boolean {
    return isProfile(this.user, Profile.ADMIN);
  }

  get isAcademic(): boolean {
    return isProfile(this.user, Profile.ACADEMIC);
  }

  get campuses() {
    return this.$campuses;
  }

  set campuses(value) {
    this.$campuses = value;
    this.getCampusNodes();
  }

  get groups() {
    return this.$groups;
  }

  set groups(value) {
    this.$groups = value;
    this.$groups.sort((a, b) => sort(a, b, {
      field: 'semester',
      order: 'asc',
      thenBy: {
        field: 'studyPlanName',
        order: 'asc',
        thenBy: {
          field: 'nameGroup',
          order: 'asc'
        }
      }
    }));
    this.getGroupNodes();
  }

  get teachers() {
    return this.$teachers;
  }

  set teachers(value) {
    this.$teachers = value;
    this.getTeacherNodes();
  }

  get studyPrograms() {
    return this.$studyPrograms;
  }

  set studyPrograms(value) {
    this.$studyPrograms = value;
    this.getStudyProgramNodes();
  }

  /* TreeNodes getter functions */
  getCampusNodes(): void {
    let nodes: TreeViewNode[] = [];
    if (this.campuses) {
      const mapper = (campus: Campus) => {
        const { id, campusName: name } = campus;
        return {
          id,
          name,
          data: campus,
          kind: 'Campus'
        } as TreeViewNode;
      };
      nodes = this.campuses.map(mapper);
    }
    this.campusNodes = nodes;
  }

  getGroupNodes(): void {
    let nodes: TreeViewNode[] = [];
    if (this.groups) {
      const mapper = (group: Group) => {
        const { id, nameGroup: name } = group;
        return {
          id,
          name,
          data: group,
          kind: 'Group'
        } as TreeViewNode;
      };
      nodes = this.groups.map(mapper);
    }
    this.groupNodes = nodes;
  }

  getTeacherNodes(): void {
    let nodes: TreeViewNode[] = [];
    if (this.teachers) {
      const mapper = (teacher: Teacher) => {
        const { id } = teacher;
        const name = getTeacherName(teacher);
        return {
          id,
          name,
          data: teacher,
          kind: 'Teacher'
        } as TreeViewNode;
      };
      nodes = this.teachers.map(mapper);
    }
    this.teacherNodes = nodes;
  }

  getStudyProgramNodes(): void {
    let nodes: TreeViewNode[] = [];
    if (this.studyPrograms) {
      const mapper = (studyProgram: StudyProgram) => {
        const { id, name, key } = studyProgram;
        const hasChildren = studyProgram.type === 'module' || studyProgram.studyPrograms != null;
        const children = (hasChildren && studyProgram.studyPrograms) ? studyProgram.studyPrograms.map(s => {
          return {
            id: s.id,
            name: `${s.key}-${s.name}`,
            data: s,
            parent: id
          } as TreeViewNode;
        }) : [];
        return {
          id,
          name: `${key}-${name}`,
          hasChildren,
          children: children.length ? children : null,
          data: studyProgram,
        } as TreeViewNode;
      };
      nodes = this.studyPrograms.map(mapper);
    }
    this.studyProgramNodes = nodes;
  }
}
