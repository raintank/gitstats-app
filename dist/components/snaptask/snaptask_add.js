"use strict";

System.register(["lodash"], function (_export, _context) {
  "use strict";

  var _, _createClass, SnapTaskAddCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
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

      _export("SnapTaskAddCtrl", SnapTaskAddCtrl = function () {
        function SnapTaskAddCtrl($scope, $injector, $q, $location, backendSrv, alertSrv) {
          _classCallCheck(this, SnapTaskAddCtrl);

          this.$q = $q;
          this.$location = $location;
          this.backendSrv = backendSrv;
          this.alertSrv = alertSrv;
          this.$scope = $scope;
          this.pageReady = true;
          this.creatingTasks = false;
          this.error = null;
          this.taskType = "";
          this.access_token = "";
          this.newTask = {};
          this.queuedTask = [];
          this.ns1Token = null;
        }

        _createClass(SnapTaskAddCtrl, [{
          key: "cancel",
          value: function cancel() {
            this.queuedTask = [];
            this.newTak = {};
          }
        }, {
          key: "queueTask",
          value: function queueTask() {
            this.queuedTask.push({
              user: this.newTask.user,
              repo: this.newTask.repo
            });
            this.newTask = {};
          }
        }, {
          key: "create",
          value: function create() {
            var self = this;
            this.creatingTasks = true;
            var promises = [];
            _.forEach(this.queuedTask, function (task) {
              promises.push(self.addTask(task));
            });

            this.$q.all(promises).then(function () {
              console.log("finished creating tasks.");
              self.queuedTask = [];
              self.creatingTasks = false;
              self.$location.path("plugins/raintank-gitstats-app/page/list-tasks");
            }, function (resp) {
              console.log("failed to add all tasks.", resp);
              self.creatingTasks = false;
              self.alertSrv.set("failed to create task", resp, 'error', 10000);
            });
          }
        }, {
          key: "taskLabel",
          value: function taskLabel(task) {
            var user = task.user;
            if (!user) {
              user = "*";
            }
            var repo = task.repo;
            if (!repo) {
              repo = "*";
            }
            return "Github Stats: " + user + "/" + repo;
          }
        }, {
          key: "addTask",
          value: function addTask(t) {
            var _this = this;

            if (this.access_token === "") {
              return this.$q.reject("access_token not set.");
            }
            var task = {
              "name": "gitstats-" + t.user + "/" + t.repo,
              "metrics": { "/raintank/apps/gitstats/*": 0 },
              "config": {
                "/raintank/apps/gitstats": {
                  "access_token": this.access_token,
                  "user": t.user,
                  "repo": t.repo
                }
              },
              "interval": 600,
              "route": { "type": "any" },
              "enabled": true
            };

            return this.backendSrv.post("api/plugin-proxy/raintank-gitstats-app/tasks", task).then(function (resp) {
              if (resp.meta.code !== 200) {
                console.log("request failed.", resp.meta.message);
                return _this.$q.reject(resp.meta.message);
              }
            });
          }
        }]);

        return SnapTaskAddCtrl;
      }());

      SnapTaskAddCtrl.templateUrl = 'public/plugins/raintank-gitstats-app/components/snaptask/partials/snaptask_add.html';

      _export("SnapTaskAddCtrl", SnapTaskAddCtrl);
    }
  };
});
//# sourceMappingURL=snaptask_add.js.map
