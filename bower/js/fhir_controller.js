angular.module('FHIRapp.controllers',['ngSanitize']).

    controller('reportSelectController', function($scope, FHIRqueryservice) {
    
    //Official Report Categories from HL7/FHIR standard
        $scope.repCat = 
            [
                
                {"code":"CH","display":"Chemistry"},
                {"code":"HM","display":"Hematology"},
                {"code":"LAB","display":"Laboratory"},
                {"code":"RAD","display":"Radiology"},
                {"code":"RC","display":"Respiratory Care (therapy)"},
            
            ];


        $scope.fetch = function() {
            var urlparams = {};

            if ($scope.name) {
                urlparams.subject = "Patient/" + $scope.name;
            }
            if ($scope.status) {
                urlparams.status = $scope.status;
            }

            urlparams.service = $scope.reportType;
            
            FHIRqueryservice.getPatientReports(urlparams).success(function (response) {
               
                $scope.reports = response.entry;
                $scope.totalResults = response.totalResults;
                $scope.navlinks = $scope.navButton(response.link);
                $scope.reportBody = '';
                console.log(response);
            });

        }

        $scope.navSnapshot = function (url) {
            FHIRqueryservice.getSnapshot(url)
                .success(function (response) {
                    $scope.reports = response.entry;
                    console.log(response);
                    $scope.navlinks = $scope.navButton(response.link);

                });
        }

        $scope.navButton = function (navlink) {
            var links = [];
            for(var i=0; i < navlink.length; ++i) {
                if (navlink[i].rel === "self" || navlink[i].rel === "fhir-base") {
                    //Do nothing
                }
                else {
                    links.push(navlink[i]);
                }
            }
            //console.log(links);
            return links;
        }
        
        $scope.setStylebyStatus = function (status) {
            var style = {};
            if (status === 'partial') {
                style["background-color"] = "#FFFFCC";
            }
            else {
                style["background-color"] = "white";
            }
            return style;
        }

        $scope.displayReport = function (text, title, identifier) {
            $scope.reportBody = text;
            $scope.reportTitle = title;
            $scope.accession = identifier;
        }
    
}).

controller('reportController', function($scope, $routeParams, FHIRqueryservice) {
    
    $scope.id = $routeParams.id;

    var urlparams = {};
    urlparams.subject = "Patient/" + $routeParams.id;

    $scope.selectedRow = null;

    $scope.setClickedRow = function (index) {
       //$scope.selectedRow = index;
         //$scope.selectedRow = ($scope.selectedRow == index) ? null : index;

         if ($scope.selectedRow == index) {
            $scope.selectedRow = null;
            $scope.reportBody = '';
         } else {
            $scope.selectedRow = index;
         }
        //console.log("Clicked row# " + index);
    }

     FHIRqueryservice.getPatient($scope.id)
        .success(function (response) {
            console.log(response);
            $scope.name = response.name[0];
            $scope.mrn = response.identifier[0].value;
            $scope.DOB = response.birthDate;
            $scope.gender = response.gender.coding[0].display;
        });

    FHIRqueryservice.getPatientReports(urlparams)
        .success(function (response) {
            $scope.reports = response.entry;
            $scope.totalResults = response.totalResults;
            $scope.navlinks = $scope.navButton(response.link);
            $scope.reportBody = '';
            console.log(response);
        });

        $scope.setLocalDate = function (date) {
            var mydate = new Date(date + "UTC");
            var newDate = new Date(mydate.getTime()+mydate.getTimezoneOffset()*60*1000);

            var offset = mydate.getTimezoneOffset() / 60;
            var hours = mydate.getHours();

            newDate.setHours(hours - offset);

            return newDate; 
        }

        $scope.displayfullName = function (name) {
            //console.log(name);
            var family = name.family ? name.family[0] : '';
            var given = name.given ? name.given[0] : '';
            //console.log(family)
            return family + ", " + given;
        }

       $scope.navSnapshot = function (url) {
            FHIRqueryservice.getSnapshot(url)
                .success(function (response) {
                    $scope.reports = response.entry;
                    console.log(response);
                    $scope.navlinks = $scope.navButton(response.link);

                });
        }

        $scope.navButton = function (navlink) {
            var links = [];
            for(var i=0; i < navlink.length; ++i) {
                if (navlink[i].rel === "self" || navlink[i].rel === "fhir-base") {
                    //Do nothing
                }
                else {
                    links.push(navlink[i]);
                }
            }
            //console.log(links);
            return links;
        }
        
        $scope.setStylebyStatus = function (status) {
            var style = {};
            if (status === 'partial') {
                style["background-color"] = "#FFFFCC";
            }
            else {
                style["background-color"] = "white";
            }
            return style;
        }

        $scope.displayReport = function (text, title, identifier) {
            $scope.reportBody = text;
            $scope.reportTitle = title;
            $scope.accession = identifier;
        }
}).


controller('patientController', function($scope, FHIRqueryservice) {

        $scope.fetchPatients = function() {
            var urlparams = {};

            if ($scope.familyname) {
                urlparams.family = $scope.familyname;
            }
            if ($scope.patientID) {
                urlparams.identifier = $scope.patientID;
            }
            if ($scope.gender) {
                urlparams.gender = $scope.gender;
            }
        
            FHIRqueryservice.getPatients(urlparams)
                .success(function (response) {
                    $scope.patients = response.entry;
                    $scope.totalResults = response.totalResults;
                    $scope.navlinks = $scope.navButton(response.link);
                    console.log(response);
            });
        }

        
        $scope.parseName = function (patient) {
            var n = patient.id.lastIndexOf('/');
            var id = patient.id.substring(n + 1);

            return id;
        }

        $scope.displayfullName = function (name) {
            var family = name.family ? name.family[0] : '';
            var given = name.given ? name.given[0] : '';
            return family + ", " + given;
        }

        $scope.navSnapshot = function (url) {
            FHIRqueryservice.getSnapshot(url)
                .success(function (response) {
                    $scope.patients = response.entry;
                    console.log(response);
                    $scope.navlinks = $scope.navButton(response.link);

                });
        }

        $scope.navButton = function (navlink) {
            var links = [];
            for(var i=0; i < navlink.length; ++i) {
                if (navlink[i].rel === "self" || navlink[i].rel === "fhir-base") {
                    //Do nothing
                }
                else {
                    links.push(navlink[i]);
                }
            }
            //console.log(links);
            return links;
        }

}).

controller('studyViewController', function($scope, $routeParams, FHIRqueryservice) {
    $scope.accession = $routeParams.id;

    var urlparams = {};

    urlparams.accession = $scope.accession;


    FHIRqueryservice.getStudy(urlparams)
        .success(function (response) {
            console.log(response);
            var study = response.entry[0].content;
            $scope.studydate = study.dateTime;
            $scope.studydescription = study.description;
            $scope.totalseries = study.numberOfSeries;
            $scope.totalimages = study.numberOfInstances;
            $scope.subject = study.subject.reference;
            $scope.series = study.series;
        });

        FHIRqueryservice.getPatient($scope.subject)
        .success(function (response) {
            console.log(response);
            $scope.name = response.name[0];
            $scope.mrn = response.identifier[0].value;
            $scope.DOB = response.birthDate;
            $scope.gender = response.gender.coding[0].display;
        });
});