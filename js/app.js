(function (angular) {
	'use strict';

	var myApp = angular.module('MyTodoMvc', ['angularLocalStorage']);

	myApp.controller('MainController', ['$scope','$location','storage',function ($scope,$location,storage) {
		//$scope.todos = [{
		//	id: 0.123,
		//	text: '学习',
		//	completed: false
		//}, {
		//	id: 0.22,
		//	text: '游泳',
		//	completed: false
		//}, {
		//	id: 0.232,
		//	text: '睡觉',
		//	completed: true
		//}];

		//从localstorage中get数据，如果不为空，赋值给$scope.todos
		var todoInStore = storage.get('todos');
		$scope.todos = todoInStore || [];
		$scope.todoslength = 0;
		//监听$scope.todos，当它改变时，使用localstorage的set()方法

		$scope.$watch('todos', function () {
			storage.set('todos', $scope.todos);
		}, true);
		// 监控剩余的list    
		$scope.$watch('todos', function () {
			var result1 = [];
				for (var i = 0; i < $scope.todos.length; i++) {
				if ($scope.todos[i].completed === false) {
					result1.push($scope.todos[i]);
				}
			}
			$scope.todoslength = result1.length;
		}, true);

//保证id不会重复
$scope.text = '';
function getId() {
	var id = Math.random();
	for (var i = 0; i < $scope.todos.length; i++) {
		if ($scope.todos[i].id === id) {
			id = getId();
			break;
		}
	}
	return id;
};
		//增加
		$scope.add = function () {
			if (!$scope.text) {
				return;
			}
			$scope.todos.push({
				id: getId(),
				text: $scope.text,
				completed: false
			});
			$scope.text = "";
		};
		//删除
		$scope.remove = function (id) {
			for (var i = 0; i < $scope.todos.length; i++) {
				if ($scope.todos[i].id === id) {
					$scope.todos.splice(i, 1);
					break;
				}
			}
		}
		//全选or全不选
		var now = true;
		$scope.toggle = function () {
			for (var i = 0; i < $scope.todos.length; i++) {
				$scope.todos[i].completed = now;
			}
			now = !now;
		}
		//清空完成的
		var result = [];

		$scope.clear = function () {
			for (var i = 0; i < $scope.todos.length; i++) {
				if ($scope.todos[i].completed === false) {
					result.push($scope.todos[i]);
				}
			}
			$scope.todos = result;

		}
		//编辑
		// 当前编辑哪个元素
		$scope.currentEditingId = -1;
		// -1代表一个肯定不存在的元素，默认没有任何被编辑
		$scope.editing = function(id) {
			$scope.currentEditingId = id;
		};
		$scope.save = function() {
			$scope.currentEditingId = -1;
		};


		// clearcompleted是否显示
		$scope.existCompleted = function() {
			// 该函数一定要有返回值
			for (var i = 0; i < $scope.todos.length; i++) {
				if ($scope.todos[i].completed) {
					return true;
				}
			}
			return false;
		};
		/*锚点切换 配合过滤器 filter: selector : equalCompare */

		$scope.selector = {};
		// 让$scope也有一个指向$location的数据成员
		$scope.$location = $location;
		// watch只能监视属于$scope的成员
		$scope.$watch('$location.path()',function(now, old){
			switch (now){
				case '/active':
				$scope.selector = {completed:false};
				break;
				case '/completed':
				$scope.selector = { completed: true };
				break;
				default:
				$scope.selector = {};
				break;
			}

		});
		// 增强filter过滤器
		$scope.equalCompare = function(source, target) {
			// console.log(source);
			// console.log(target);
			// return false;
			return source === target;
		};




	}]);

})(angular);
