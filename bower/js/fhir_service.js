angular.module('FHIRapp.services', [])
.factory('FHIRqueryservice', function ($http) {

	var fhirAPI = {};
	var fhir_base = "http://fhir.hackathon.siim.org/fhir";
	var fhir_report_url = fhir_base + "/DiagnosticReport";
	var fhir_patient_url = fhir_base + "/Patient";
	var fhir_study_url = fhir_base + "/ImagingStudy"

	fhirAPI.getPatientReports = function (params) {
		return $http.get(fhir_report_url,
		{
			headers: {
            	"Accept" : "application/json"
            },
			params: params
		});	
	}

	fhirAPI.getPatients = function (params) {
		return $http.get(fhir_patient_url,
		{
			headers: {
            	"Accept" : "application/json"
            },
			params: params
		});	
	}

	fhirAPI.getPatient = function (id) {
		return $http.get(fhir_patient_url + '/' + id,
		{
			headers: {
				"Accept" : "application/json"
			}	
		});
	}

	fhirAPI.getSnapshot = function (url) {
		return $http.get(url,
		{
			headers: {
				"Accept" : "application/json"
			}
		});
	}

	fhirAPI.getStudy = function (accession) {
		return $http.get(fhir_study_url,
		{
			headers: {
				"Accept" : "application/json"
			},
			params: accession
		});
	}

	return fhirAPI;

});