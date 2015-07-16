angular.module('FHIRapp', 
[
	'FHIRapp.controllers',
	'FHIRapp.services',
	'ngRoute',
	'ngSanitize'
]).
config(['$routeProvider', function ($routeProvider) {
	$routeProvider.
		when("/Reports/:id", {
				templateUrl: "partials/reportView.html", 
				controller: "reportController"
			}).
		//when("/Studies/:id"), {templateUrl: "partials/studyView.html", controller: "studyController"}.
		when("/Patients", {
				templateUrl: "partials/patients.html",
				controller: "patientController"
			}).
		when("/Study/:id", {
				templateUrl: "partials/studyView.html",
				controller: "studyViewController"
		}).
		otherwise({redirectTo: "/Patients"});
}]);
