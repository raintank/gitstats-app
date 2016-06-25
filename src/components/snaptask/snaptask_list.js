
function slugify(str) {
	var slug = str.replace("@", "at").replace("&", "and").replace(".", "_").replace("/\W+/", "");
	return slug;
}

class SnapTaskListCtrl {
  constructor($scope, $injector, backendSrv, alertSrv) {
  	this.backendSrv = backendSrv;
    this.alertSrv = alertSrv;
    this.pageReady = false;
    this.tasks = [];

    this.getTasks();
  }

  getTasks() {
    var self = this;
    return this.backendSrv.get("api/plugin-proxy/raintank-gitstats-app/tasks", {metric: "/raintank/apps/gitstats/*"})
    .then((resp) => {
      self.tasks = resp.body;
			self.pageReady = true;
    });
  }

  removeTask(task) {
  	var self = this;
    return this.backendSrv.delete("api/plugin-proxy/raintank-gitstats-app/tasks/"+task.id).then((resp) => {
      if (resp.meta.code !== 200) {
        self.alertSrv.set("failed to delete task", resp, 'error', 10000);
      }
      self.getTasks();
    });
  }

  stopTask(task) {
    var self = this;
  	task.enabled = false;
    return this.backendSrv.put("api/plugin-proxy/raintank-gitstats-app/tasks", task).then((resp) => {
      if (resp.meta.code !== 200) {
        self.alertSrv.set("failed to stop task", resp, 'error', 10000);
        self.getTasks();
      }
    });
  }
  startTask(task) {
    var self = this;
  	task.enabled = true;
    return this.backendSrv.put("api/plugin-proxy/raintank-gitstats-app/tasks", task).then((resp) => {
      if (resp.meta.code !== 200) {
        self.alertSrv.set("failed to start task", resp, 'error', 10000);
        self.getTasks();
      }
    });
  }

  taskDashboard(task) {
  	var type =this.getType(task)
  	if ( type === "monitoringJob") {
  		return "dashboard/db/gitstats-user?&var-monitor=" + slugify(task.config['/raintank/apps/gitstats'].user);
  	} else if (type == "zone") {
  		return "dashboard/db/gitstats-repo?&var-zone=" + slugify(task.config['/raintank/apps/gitstats'].repo);
  	}
  }

  taskLabel(task) {
  	var user = task.config['/raintank/apps/gitstats'].user;
    if (user === "") {
      user = "*";
    }
    var repo = task.config['/raintank/apps/gitstats'].repo;
    if (repo === "") {
      repo = "*";
    }
    return "Github Stats: "+user+"/"+repo
  }
}

SnapTaskListCtrl.templateUrl = 'public/plugins/raintank-gitstats-app/components/snaptask/partials/snaptask_list.html';
export {SnapTaskListCtrl};
