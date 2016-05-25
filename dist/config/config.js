'use strict';

System.register(['./config.html!text', 'lodash'], function (_export, _context) {
  "use strict";

  var configTemplate, _, _createClass, GitstatsConfigCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_configHtmlText) {
      configTemplate = _configHtmlText.default;
    }, function (_lodash) {
      _ = _lodash.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('ConfigCtrl', GitstatsConfigCtrl = function () {
        /** @ngInject */

        function GitstatsConfigCtrl($scope, $injector, backendSrv) {
          _classCallCheck(this, GitstatsConfigCtrl);

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

        _createClass(GitstatsConfigCtrl, [{
          key: 'validateKey',
          value: function validateKey() {
            var self = this;
            var p = this.backendSrv.get("/api/plugin-proxy/raintank-gitstats-app/api/tasks", { metric: "/raintank/apps/gitstats/*" });
            p.then(function (resp) {
              self.validKey = true;
              self.tasks = resp.body;
            }, function () {
              if (self.appModel.enabled) {
                self.appModel.jsonData.apiKeySet = false;
                self.appModel.secureJsonData.apiKey = "";
                self.errorMsg = "invlid apiKey";
              }
            });
            return p;
          }
        }, {
          key: 'preUpdate',
          value: function preUpdate() {
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
        }, {
          key: 'postUpdate',
          value: function postUpdate() {
            if (!this.appModel.enabled) {
              return Promise.resolve();
            }
            var self = this;
            return this.validateKey().then(function () {
              return self.appEditCtrl.importDashboards();
            });
          }
        }, {
          key: 'initDatasource',
          value: function initDatasource() {
            var self = this;
            //check for existing datasource.
            var p = self.backendSrv.get('/api/datasources');
            p.then(function (results) {
              var foundGraphite = false;
              var foundElastic = false;
              _.forEach(results, function (ds) {
                if (foundGraphite && foundElastic) {
                  return;
                }
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
        }, {
          key: 'addNewTask',
          value: function addNewTask() {
            var self = this;
            var task = {
              "name": "Github Stats: " + this.newTask.owner + "/" + this.newTask.repo,
              "metrics": { "/raintank/apps/gitstats/*": 0 },
              "config": {
                "/raintank/apps/gitstats": {
                  "repo": this.newTask.repo,
                  "owner": this.newTask.owner,
                  "access_token": this.newTask.access_token
                }
              },
              "interval": 600,
              "route": { "type": "any", "config": {} },
              "enabled": true
            };

            this.backendSrv.post("/api/plugin-proxy/raintank-gitstats-app/api/tasks", task).then(function () {
              self.validateKey();
              self.cancelNewTask();
            });
          }
        }, {
          key: 'removeTask',
          value: function removeTask(task) {
            var self = this;
            this.backendSrv.delete("/api/plugin-proxy/raintank-gitstats-app/api/tasks/" + task.id).then(function () {
              self.validateKey();
            });
          }
        }, {
          key: 'cancelNewTask',
          value: function cancelNewTask() {
            this.newTask = {};
            this.addNew = false;
          }
        }, {
          key: 'toggleAddNew',
          value: function toggleAddNew() {
            this.addNew = true;
          }
        }]);

        return GitstatsConfigCtrl;
      }());

      GitstatsConfigCtrl.template = configTemplate;

      _export('ConfigCtrl', GitstatsConfigCtrl);
    }
  };
});
//# sourceMappingURL=config.js.map
