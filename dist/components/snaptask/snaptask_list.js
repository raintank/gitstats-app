"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var _createClass, SnapTaskListCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function slugify(str) {
    var slug = str.replace("@", "at").replace("&", "and").replace(".", "_").replace("/\W+/", "");
    return slug;
  }

  return {
    setters: [],
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

      _export("SnapTaskListCtrl", SnapTaskListCtrl = function () {
        function SnapTaskListCtrl($scope, $injector, backendSrv, alertSrv) {
          _classCallCheck(this, SnapTaskListCtrl);

          this.backendSrv = backendSrv;
          this.alertSrv = alertSrv;
          this.pageReady = false;
          this.tasks = [];

          this.getTasks();
        }

        _createClass(SnapTaskListCtrl, [{
          key: "getTasks",
          value: function getTasks() {
            var self = this;
            return this.backendSrv.get("api/plugin-proxy/raintank-gitstats-app/tasks", { metric: "/raintank/apps/gitstats/*" }).then(function (resp) {
              self.tasks = resp.body;
              self.pageReady = true;
            });
          }
        }, {
          key: "removeTask",
          value: function removeTask(task) {
            var self = this;
            return this.backendSrv.delete("api/plugin-proxy/raintank-gitstats-app/tasks/" + task.id).then(function (resp) {
              if (resp.meta.code !== 200) {
                self.alertSrv.set("failed to delete task", resp, 'error', 10000);
              }
              self.getTasks();
            });
          }
        }, {
          key: "stopTask",
          value: function stopTask(task) {
            var self = this;
            task.enabled = false;
            return this.backendSrv.put("api/plugin-proxy/raintank-gitstats-app/tasks", task).then(function (resp) {
              if (resp.meta.code !== 200) {
                self.alertSrv.set("failed to stop task", resp, 'error', 10000);
                self.getTasks();
              }
            });
          }
        }, {
          key: "startTask",
          value: function startTask(task) {
            var self = this;
            task.enabled = true;
            return this.backendSrv.put("api/plugin-proxy/raintank-gitstats-app/tasks", task).then(function (resp) {
              if (resp.meta.code !== 200) {
                self.alertSrv.set("failed to start task", resp, 'error', 10000);
                self.getTasks();
              }
            });
          }
        }, {
          key: "taskDashboard",
          value: function taskDashboard(task) {
            var type = this.getType(task);
            if (type === "monitoringJob") {
              return "dashboard/db/gitstats-user?&var-monitor=" + slugify(task.config['/raintank/apps/gitstats'].user);
            } else if (type == "zone") {
              return "dashboard/db/gitstats-repo?&var-zone=" + slugify(task.config['/raintank/apps/gitstats'].repo);
            }
          }
        }, {
          key: "taskLabel",
          value: function taskLabel(task) {
            var user = task.config['/raintank/apps/gitstats'].user;
            if (user === "") {
              user = "*";
            }
            var repo = task.config['/raintank/apps/gitstats'].repo;
            if (repo === "") {
              repo = "*";
            }
            return "Github Stats: " + user + "/" + repo;
          }
        }]);

        return SnapTaskListCtrl;
      }());

      SnapTaskListCtrl.templateUrl = 'public/plugins/raintank-gitstats-app/components/snaptask/partials/snaptask_list.html';

      _export("SnapTaskListCtrl", SnapTaskListCtrl);
    }
  };
});
//# sourceMappingURL=snaptask_list.js.map
