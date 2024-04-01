import { Component, Inject, OnInit } from '@angular/core';
import { Agent, Branch, DialogData, FilterParams, User } from 'shared/interfaces';
import { Catalog, FilterOption } from 'shared/helpers/catalog';
import { DialogBase } from 'shared/helpers/dialog.base';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgentService } from 'src/app/services/agent.service';
import { AuthenticationService } from 'shared/services/authentication.service';
import { UserService } from 'src/app/services';
import { ClientService } from 'src/app/services/client.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { BranchService } from 'src/app/services/branch.service';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent extends Catalog<Agent, CreateAgentDialogComponent> implements OnInit {
  params: FilterParams<Agent>;
  selectedOption: keyof Agent | any;
  filterOptions: FilterOption<Agent>[];
  users: User[]
  protected validateExtras(entity: Agent): Agent {
    return entity;
  }
  protected getIdFrom(entity: Agent): number {
    return entity.id;
  }
  protected search(id: number): Agent {
    return this.entities.find(p => p.id == id);
  }
  protected getRefDialog(dialogData: DialogData<Agent, any>): MatDialogRef<CreateAgentDialogComponent, Agent> {
    return this.dialog.open(CreateAgentDialogComponent, {
      width: '80%',
      data: dialogData,
      disableClose: true,
      panelClass: ''
    });
  }
  protected restore(): void {
    this.entity = {
      id: 0,
      id_user: null,
      id_branch: null,
      name: '',
      address: '',
      phone: '',
      email: '',
      status: '',
      type: ''
    };
  }

  constructor(
    public service: AgentService,
    public auth: AuthenticationService,
    public matDialog: MatDialog,
    public configurationService: ConfigurationService
  ) {
    super(service, auth, matDialog, null, null, configurationService);
    this.params = {
      limit: 10,
      /*orderBy: {
      field: 'fechaCreacion',
      order: 'asc'
      }*/
    };

    this.filterOptions = [
      {
        label: 'Nombre',
        property: 'name',
      },
      {
        label: 'Status',
        property: 'status',
      },
      {
        label: 'Tipo',
        property: 'type',
      },
    ];
  }

  ngOnInit(): void {
    this.auth.checkPermission('/agents')
    this.logged = typeof this.auth.currentUserValue === 'string' &&
      this.auth.currentUserValue !== '';
    this.user = JSON.parse(localStorage.getItem('user')) as User;
    this.restore();
    this.reload(false, this.params);
  }

  changeSelected() {
    this.params['name'] = null
    this.params['status'] = null
    this.params['type'] = null
  }

}

@Component({
  selector: 'app-create-agent',
  templateUrl: './create-agent-dialog.component.html',
  styleUrls: ['./agent.component.scss']
})
export class CreateAgentDialogComponent extends DialogBase implements OnInit {

  users: User[];
  branches: Branch[];
  nameExist: boolean = false;

  constructor(
    protected service: AgentService,
    protected userService: UserService,
    protected branchService: BranchService,
    public dialogRef: MatDialogRef<AgentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<Agent, null>,
  ) {
    super(dialogRef);
  }
  ngOnInit(): void {
    this.userService.areNotAgents().subscribe(response => {
      this.users = response.data
      if (this.data.options.readonly || this.data.options.update && !this.checkArrayUsers) {
        this.userService.single(this.data.entity.id_user).subscribe(response => {
          this.users.push(response)
        })
      }
    });
    const { entity } = this.data;
    this.searchBranch('')
  }

  searchName($event) {
    this.service.list({ name: this.data.entity.name }).subscribe(response => {
      this.nameExist = response.data.data.length && this.data.entity.id != response.data.data[0].id && response.data.data.some(client => this.data.entity.name == client.name)
    });
  }

  searchBranch(text: string) {
    if (text.length == 0) {
      this.branchService
        .list()
        .subscribe(response => (this.branches = response.data.data));
    } else {
      this.branchService
        .search(text)
        .subscribe(response => (this.branches = response.data.data));
    }
  }


  get readonly() {
    return this.data.options.readonly;
  }
  get checkArrayUsers() {
    let check = this.users.some(user => {
      return user.id == this.data.entity.id_user
    })

    return check;
  }
}