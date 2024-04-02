/* Pages types ⬇⬇⬇ */

import { extend } from 'hammerjs';
import { ShareReplayConfig } from 'rxjs/internal/operators/shareReplay';

export interface MenuLink {
  label: string;
  iconType: 'pg' | 'letter' | 'material' | 'fe' | 'fa' | 'cib' | 'cil' | 'cif';
  /**
   * See the references for corresponding icon type.
   * @see http://pages.revox.io/dashboard/cheatsheet/ for `pg`
   * @see https://material.io/resources/icons/?style=baseline for `material`
   * @see https://fontawesome.com/icons?d=gallery for `fa`
   * @see https://feathericons.com/ for `fe`
   * @see core-incons for `cib`
   */
  iconName: string;
  details?: string;
  routerLink?: string;
  externalLink?: string;
  target?: '_blank' | string;
  toggle?: 'close' | 'open';
  thumbNailClass?: string;
  submenu?: MenuLink[];
  profiles?: number[];
}

/** @see https://angular2-tree.readme.io/docs/options-1 */
export interface TreeViewNode {
  /**
   * Unique ID for the node.
   * If one is not supplied it will be created by the tree library.
   */
  id?: string;
  /** Will be displayed by default in the tree. */
  name: string;
  /**
   * An array of the node's children.
   * Each child is an object with the same structure as the parent node.
   */
  children?: TreeViewNode[];
  /** For async data load. Denotes that this node might have children, even when 'children' attr is empty. */
  hasChildren?: boolean;
  /**
   * Determines whether the node starts as expanded by default. Notice that this field is not bindable,
   * meaning that changing it doesn't affect the tree and vice versa.
   */
  isExpanded?: boolean;
  data?: any;
}

/** @see https://angular2-tree.readme.io/v8.2.0/docs/options */
export interface TreeViewOptions {
  /**
   * Rewire which trigger causes which action using this attribute, or create custom actions / event bindings.
   * @see https://angular2-tree.readme.io/docs/action-mapping
   */
  actionMapping?: any;
  /**
   * Specify if dragging tree nodes is allowed.
   * This could be a boolean, or a function that receives a `TreeNode` and returns a boolean
   *
   * **Default value: `true`**
   */
  allowDrag?: boolean | ((node: TreeViewNode) => boolean);
  /**
   * Boolean flag to allow adding and removing is-dragging-over and is-dragging-over-disabled classes.
   * If set to false it will not add the above mentioned classes and you should handle the styling yourself
   * with css and in the `actionMapping ➡ mouse ➡ dragEnter, dragLeave`
   *
   * **Default value: `true`**
   */
  allowDragoverStyling?: boolean;
  /**
   * Specify whether dropping inside the tree is allowed. Optional types:
   * - boolean
   * -A function that receives the dragged element, and the drop location (parent node and index inside the parent),
   * and returns true or false.
   *
   * **Default value: `true`**
   */
  allowDrop?:
  | boolean
  | ((
    element: any,
    to: { parent: TreeViewNode; index: number },
    event?: any
  ) => boolean);
  /**
   * Increase of expand animation speed (described in multiply per 17 ms).
   *
   * **Default value: `1.2`**
   */
  animateAcceleration?: number;
  /**
   * Boolean whether or not to animate expand / collapse of nodes.
   *
   * **Default value: `false`**
   */
  animateExpand?: boolean;
  /**
   * Speed of expand animation (described in pixels per 17 ms).
   *
   * **Default value: `30`**
   */
  animateSpeed?: number;
  /**
   * A string representing the attribute of the node that contains the array of children.
   *
   * **Default value: `'children'`**
   *
   * For example, if your nodes have a `nodes` attribute, that contains the children, use:
   * ```ts
   * options = { childrenField: 'nodes' }
   * ```
   */
  childrenField?: string;
  /**
   * A string representing the attribute of the node to display.
   *
   * **Default value: `name`**
   */
  displayField?: string;
  /**
   * Function for loading a node's children.
   *
   * The function receives a TreeNode, and returns a value or a promise that resolves to the node's children.
   *
   * This function will be called whenever a node is expanded, the hasChildren (options.hasChildrenField) field is true,
   * and the children field is empty. The result will be loaded into the node's children attribute.
   *
   * **Example:**
   * ```ts
   * options = {
   *   getChildren: (node: TreeViewNode) => {
   *     return request('/api/children/' + node.id);
   *   }
   * }
   * ```
   */
  getChildren?: (node: TreeViewNode) => any;
  /**
   * A string representing the attribute of the node that indicates whether there are child nodes.
   *
   * **Default value: `'hasChildren'`**
   *
   * For example, if your nodes have an `isDirectory` attribute that indicates whether there are children, use:
   * ```ts
   * options = { hasChildrenField: 'isDirectory' }
   * ```
   */
  hasChildrenField?: string;
  /**
   * A string representing the attribute of the node that contains the unique ID.
   * This will be used to construct the `path`, which is an array of IDs that point to the node.
   *
   * **Default value: `'id'`**
   *
   * For example, if your nodes have a uuid attribute, that contains the unique key, use:
   * ```ts
   * options = { idField: 'uuid' }
   * ```
   */
  idField?: string;
  /**
   * Specify padding per node (integer). Each node will have padding-left value of level * levelPadding,
   * instead of using the default padding for children.
   *
   * This option is good for example for allowing whole row selection, etc.
   *
   * You can alternatively use the tree-node-level-X classes to give padding on a per-level basis.
   *
   * **Default value: `0`**
   */
  levelPadding?: number;
  /**
   * Specify a function that returns a class per node. Useful for styling the nodes individually.
   *
   * **Example: **
   * ```ts
   * options = {
   *   nodeClass: (node: TreeViewNode) => {
   *     return 'icon-' + node.data.icon;
   *   }
   * }
   * ```
   */
  nodeClass?: (node: TreeViewNode) => string;
  /**
   * For use with `useVirtualScroll` option. Specify a height for nodes in pixels. Could be either:
   * - number
   * - (node: TreeNode) => number
   *
   * **Default value: `22`**
   */
  nodeHeight?: number | ((node: TreeViewNode) => number);
  /** Specifies id of root node (virtualRoot) */
  rootId?: any;
  /**
   * Makes the tree right-to-left. This include direction, expander style,
   * and change key binding (right key collapse and left key expands instead of vice-versa)
   */
  rtl?: boolean;
  /**
   * The HTML element that is the scroll container for the tree.
   * The default behaviour is to wrap the tree with a container that has overflow:
   * hidden, and then the scrolling container is the viewport inside the tree component
   */
  scrollContainer?: HTMLElement;
  /**
   * Whether to scroll to the node to make it visible when it is activated.
   *
   * **Default Value: `true`**
   */
  scrollOnActivate?: boolean;
  /** Whether to display a checkbox next to the node or not */
  useCheckbox?: boolean;
  /** Whether to use master checkboxes mechanism if the useCheckbox is set to true */
  useTriState?: boolean;
  /**
   * Boolean flag to use the virtual scroll option.
   *
   * To use this option, you must supply the height of the container, and the height of each node in the tree.
   *
   * You can also specify height for the dropSlot which is located between nodes.
   *
   * **Default Value: `false`**
   *
   * **Example:**
   * ```ts
   * options = {
   *   useVirtualScroll: true,
   *   nodeHeight: (node: TreeViewNode) => node.myHeight,
   *   dropSlotHeight: 3
   * }
   * ```
   */
  useVirtualScroll?: boolean;
}

/* Utility types ⬇⬇⬇ */
export interface ListWCursor<T> {
  data: {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string;
    prev_page_url: string;
    to: number;
    total: number;
  };
  success: boolean;
  message: any[];
  cursor: string;
}
export interface SimpleList<T> {
  data: T[];
  success: boolean;
  message: any;
}

export interface DialogData<T, U = any> {
  entity: T;
  temporal?: T;
  options: {
    update?: boolean;
    readonly?: boolean;
    cancel?: boolean;
  };
  configuration: Configuration
  extras?: U;
  type_payment?: string;
}



export interface WhereIn<T> {
  field: keyof T;
  values: string[];
}
export interface SortOrder<T> {
  field: keyof T;
  order: 'asc' | 'desc';
}

export interface Range<T> {
  field: keyof T;
  start: string | number | Date;
  end: string | number | Date;
  nonInclusive?: boolean;
}
export interface SearchOptions<T> {
  limit?: number;
  orderBy?: SortOrder<T>;
  cursor?: string;
  range?: Range<T>;
  /** makeRelationship: by default false */
  rel?: boolean;
  in?: WhereIn<T>;
  /** Only on Datastore w/ Documents. It's not currently supported by Firestore */
  globalText?: string;
}
export interface TimeStamps {
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface Model extends TimeStamps {
  id: number;
  arraySearch?: string[];
}

export type FilterParams<T> = Partial<T> & SearchOptions<T>;

export interface AuthResponse {
  accessToken: string;
  code: number;
  user: User;
  user_name: string;
  rol: string;
  configuration: Configuration
}

export interface GenericResponse<T> {
  data: T;
  success: boolean;
  message: any[];
}

export interface Dictionary<T> {
  [x: string]: T;
}

export interface RadioButton {
  label: string;
  value: string;
  /** Fontawesome Icon */
  iconName?: string;
  iconSVG?: string;
  classColor: 'salmon' | 'cyan' | 'purple' | 'gold';
}

export interface Days {
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
}

export const Days: Days = {
  sunday: 'Domingo',
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
};

export interface ControlRecord {
  cycleId: string;
  campusId: string;
  groupId: string;
  studyProgramId?: string;
  /** The name of the entity (name of the class [in Java] or interface [in TS]) */
  entity: string;
  status: 'inactive' | 'on-progress' | 'done';
}

/* End utility types ⬆ */

export interface User {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  password: string;
  status: string;
  email: string;
  profile: number;
  o_profile?: Profile;
  collectorId?: number,
}

export interface Profile {
  id: number;
  name: string;
  // control: number;
  // permissions?: string;
  created_at: Date | string;
  updated_at: Date | string;
}
export interface StringBase64 {
  file: string;
}



export interface ConfigurationCollection extends Model {
  first_percentage: number;
  second_percentage: number;
}

export interface ActiveAccount extends Model {
  id_client: number;
  id_sale: number;
  id_agent: number;
  ammount: number;
  last_payment: Date;
  name_client: string;
  status_sale: string;
  type_sale: string;
  payment: number;
  payment_date: Date | string;
  debt?: number,
  tail?: boolean;
}



export interface SendEmail {
  name: string;
  email: string;
  subject: string,
  content: string,
  file: string,
}



export interface GrouperElements extends Model {
  name: string,
  icon: string,
  elements: Element[]
}

export interface Element extends Model {
  id_grouper: number,
  name: string,
  url: string,
  icon: string,
  assigned?: boolean,
}

export interface ProfileElement extends Model {
  id_profile: number,
  id_element: number,
}

export interface UserElement extends Model {
  id_user: number,
  id_element: number,
}

export interface DataUserElement {
  data: UserElement[]
}

export interface OptionsForUserElement {
  body?: DataUserElement
}

export interface ConfigurationReport {
  id: number,
  name: string,
  direction: string,
  phone: string,
  color_table: string,
  image: string
}


export interface ObjectId {
  id: number;
}

export interface Configuration {
  name: string,
  direction: string,
  phone: string,
  primary_color: string,
  progress_color: string,
  btnlogin_color: string,
  color_table: string,
  image_login: string,
  image_headerlogo: string,
  image_sidebarlogo: string,
  image_bannerlogin: string,
  image_report: string,
  primary_color_back: string,
  white_color: string,
  white_color2: string,
  white_color_back: string,
  calculate_primary_color_light(): string,
  white_color_back2: string,
  calculate_primary_color_light2(): string,
  calculate_hover_primary_color(): string
  search_primary_color: string,
  search_primary_color_back: string
  search_calculate_hover_primary_color(): string,
  color_border_form: string,
  color_border_form_back: string,
}

export interface TransportType extends Model {
  type: string,
}


