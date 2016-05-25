import configTemplate from './config.html!text';

class GitstatsConfigCtrl {
  /** @ngInject */
    constructor($scope, $injector, backendSrv) {
    this.backendSrv = backendSrv;
    this.validKey = false;
    this.appEditCtrl.setPreUpdateHook(this.preUpdate.bind(this));
    this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));

    if (this.appModel.jsonData === null) {
      this.appModel.jsonData = {};
    }
    if (!this.appModel.secureJsonData) {
      this.appModel.secureJsonData = {};
    }
    if (this.appModel.enabled) {
      this.validateKey();
    }
  }

  validateKey() {
    var self = this;
    var p = this.backendSrv.get("/api/plugin-proxy/raintank-gitstats-app/api/tasks", {metric: "/raintank/apps/gitstats/*"});
    p.then((resp) => {
      self.validKey = true;
      self.tasks = resp.body;
    }, () => {
      if (self.appModel.enabled) {
        self.appModel.jsonData.apiKeySet = false;
        self.appModel.secureJsonData.apiKey = "";
        self.errorMsg = "invlid apiKey";
      }
    });
    return p;
  }

  preUpdate() {
    var model = this.appModel;
    if (!model.enabled) {
      return Promise.resolve();
    }

    if (!model.jsonData.apiKeySet && !model.secureJsonData.apiKey) {
      model.enabled = false;
      return Promise.reject("apiKey not set.");
    }
    // if the apiKey is being set, check and make sure that
    // we have initialized our datasource and dashboards.
    if (model.secureJsonData.apiKey) {
      model.jsonData.apiKeySet = true;
    }

    return this.initDatasource();
  }

  postUpdate() {
    if (!this.appModel.enabled) {
      return Promise.resolve();
    }
    var self = this;
    return this.validateKey()
    .then(() => {
      return self.appEditCtrl.importDashboards();
    });
  }

  initDatasource() {
    var self = this;
    //check for existing datasource.
    var p = self.backendSrv.get('/api/datasources');
    p.then(function(results) {
      var foundGraphite = false;
      var foundElastic = false;
      _.forEach(results, function(ds) {
        if (foundGraphite && foundElastic) { return; }
        if (ds.name === "raintank") {
          foundGraphite = true;
        }
        if (ds.name === "raintankEvents") {
          foundElastic = true;
        }
      });
      var promises = [];
      if (!foundGraphite) {
        // create datasource.
        var graphite = {
          name: 'raintank',
          type: 'graphite',
          url: 'api/plugin-proxy/raintank-gitstats-app/graphite',
          access: 'direct',
          jsonData: {}
        };
        promises.push(self.backendSrv.post('/api/datasources', graphite));
      }
      if (!foundElastic) {
        // create datasource.
        var elastic = {
          name: 'raintankEvents',
          type: 'elasticsearch',
          url: 'api/plugin-proxy/raintank-gitstats-app/elasticsearch',
          access: 'direct',
          database: '[events-]YYYY-MM-DD',
          jsonData: {
            esVersion: 1,
            interval: "Daily",
            timeField: "timestamp"
          }
        };
        promises.push(self.backendSrv.post('/api/datasources', elastic));
      }
      return Promise.all(promises);
    });
    return p;
  }

  addNewTask() {
    var self = this;
    var task = {
      "name": "Github Stats: " + this.newTask.owner + "/"+this.newTask.repo,
      "metrics": {"/raintank/apps/gitstats/*":0},
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

    this.backendSrv.post("/api/plugin-proxy/raintank-gitstats-app/api/tasks", task).then(function(resp) {
      self.validateKey();
      self.cancelNewTask();
    });
  }

  removeTask(task) {
    var self = this;
    this.backendSrv.delete("/api/plugin-proxy/raintank-gitstats-app/api/tasks/"+task.id).then(function(resp) {
      self.validateKey();
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

