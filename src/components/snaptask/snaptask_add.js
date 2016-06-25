import _ from 'lodash';

class SnapTaskAddCtrl {
  constructor($scope, $injector, $q, $location, backendSrv, alertSrv) {
    this.$q = $q;
    this.$location = $location;
    this.backendSrv = backendSrv;
    this.alertSrv = alertSrv;
    this.$scope = $scope;
    this.pageReady = true;
    this.creatingTasks = false;
    this.error = null;
    this.taskType = "";
    this.access_token = ""
    this.newTask = {};
    this.queuedTask = [];
    this.ns1Token = null;
}

  cancel() {
    this.queuedTask = [];
    this.newTak = {};
  }

  queueTask() {
    this.queuedTask.push({
      user: this.newTask.user,
      repo: this.newTask.repo,
    });
    this.newTask = {};
  }

  create() {
    var self = this;
    this.creatingTasks = true;
    var promises = [];
    _.forEach(this.queuedTask, function(task) {
      promises.push(self.addTask(task));
    });

    this.$q.all(promises).then(()=>{
      console.log("finished creating tasks.");
      self.queuedTask = [];
      self.creatingTasks = false;
      self.$location.path("plugins/raintank-gitstats-app/page/list-tasks");
    }, (resp)=>{
      console.log("failed to add all tasks.", resp);
      self.creatingTasks = false;
      self.alertSrv.set("failed to create task", resp, 'error', 10000);
    });
  }

  taskLabel(task) {
    var user = task.user;
    if (!user) {
      user = "*";
    }
    var repo = task.repo;
    if (!repo) {
      repo = "*";
    }
    return "Github Stats: "+user+"/"+repo
  }

  addTask(t) {
    if (this.access_token === "") {
      return this.$q.reject("access_token not set.")
    }
    var task = {
      "name": "gitstats-"+t.user+"/"+t.repo,
      "metrics": {"/raintank/apps/gitstats/*":0},
      "config": {
        "/raintank/apps/gitstats": {
          "access_token": this.access_token,
          "user": t.user,
          "repo": t.repo
        }
      },
      "interval": 600,
      "route": { "type": "any"},
      "enabled": true
    };

    return this.backendSrv.post("api/plugin-proxy/raintank-gitstats-app/tasks", task).then((resp) => {
      if (resp.meta.code !== 200) {
        console.log("request failed.", resp.meta.message);
        return this.$q.reject(resp.meta.message);
      }
    });
  }
}

SnapTaskAddCtrl.templateUrl = 'public/plugins/raintank-gitstats-app/components/snaptask/partials/snaptask_add.html';
export {SnapTaskAddCtrl};
