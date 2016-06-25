'use strict';

System.register(['./config/config.js', './components/snaptask/snaptask_list', './components/snaptask/snaptask_add'], function (_export, _context) {
	"use strict";

	var ConfigCtrl, SnapTaskListCtrl, SnapTaskAddCtrl;
	return {
		setters: [function (_configConfigJs) {
			ConfigCtrl = _configConfigJs.ConfigCtrl;
		}, function (_componentsSnaptaskSnaptask_list) {
			SnapTaskListCtrl = _componentsSnaptaskSnaptask_list.SnapTaskListCtrl;
		}, function (_componentsSnaptaskSnaptask_add) {
			SnapTaskAddCtrl = _componentsSnaptaskSnaptask_add.SnapTaskAddCtrl;
		}],
		execute: function () {
			_export('ConfigCtrl', ConfigCtrl);

			_export('SnapTaskListCtrl', SnapTaskListCtrl);

			_export('SnapTaskAddCtrl', SnapTaskAddCtrl);
		}
	};
});
//# sourceMappingURL=module.js.map
