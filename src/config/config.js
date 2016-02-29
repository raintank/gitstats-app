import configTemplate from './config.html!text';

class GitstatsConfigCtrl {
  /** @ngInject */
  constructor($scope, $injector, $q, backendSrv) {
    this.$q = $q;
    this.backendSrv = backendSrv;
    this.appModel.secureJsonData = {
      token: '**********'
    };
    this.tasks = [];
    this.newTask = {};
    this.addNew = false;
    this.GetTasks();

    console.log(this);
  }

  GetTasks() {
    var self = this;

    this.backendSrv.get("/api/plugin-proxy/gitstats-app/api/tasks", {metric: "/raintank/apps/gitstats/*/*/*"}).then(function(resp) {
      self.tasks = resp;
    });
  }

  addNewTask() {
    var self = this;
    var task = {
      "name": "Github Stats: " + this.newTask.owner + "/"+this.newTask.repo,
      "metrics": {"/raintank/apps/gitstats/*/*/*":1},
      "config": {
        "/raintank/apps/gitstats": {
          "repo": this.newTask.repo,
          "owner": this.newTask.owner,
          "access_token": this.newTask.access_token
        }
      },
      "interval": 60,
      "route": { "type": "any", "config": {}},
      "enabled": true
    };

    this.backendSrv.post("/api/plugin-proxy/gitstats-app/api/tasks", task).then(function(resp) {
      self.GetTasks();
      self.cancelNewTask();
    });
  }

  removeTask(task) {
    var self = this;
    this.backendSrv.delete("/api/plugin-proxy/gitstats-app/api/tasks/"+task.id).then(function(resp) {
      self.GetTasks();
    });
  }

  cancelNewTask() {
    this.newTask = {};
    this.addNew = false;
  }

  toggleAddNew() {
    this.addNew = true;
  }
}

GitstatsConfigCtrl.template = configTemplate;

export {
  GitstatsConfigCtrl as ConfigCtrl
};

