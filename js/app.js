
// Define the module and its routing
var chordApp = angular.module('chordApp', ['ngRoute']);

chordApp.config(function($routeProvider) {
    $routeProvider.when('/', {
            templateUrl : "pages/home.html",
            controller  : 'mainController'
    });

});

// create the controller and inject Angular's $scope
chordApp.controller('mainController', function ($scope) {

    // getChord function returns the indexes for the selected chord
    $scope.getChord = function() {

        $scope.clearKeys();
        $scope.chordNotes = [];
        $scope.rootNoteIndex = $scope.getRootIndex($scope.chordRoot);
        $scope.chordNotes.push($scope.rootNoteIndex);

        switch($scope.chordType) {

            case 'Major':
                $scope.drawChord($scope.major);
                break;

            case 'Minor':
                $scope.drawChord($scope.minor);
                break;

            case 'Minor 7th':
                $scope.drawChord($scope.minor7th);
                break;

            case 'Major 7th':
                $scope.drawChord($scope.major7th);
                break;

            case '7th':
                $scope.drawChord($scope.seventh);
                break;

            case 'Major 6th':
                $scope.drawChord($scope.major6th);
                break;

            case 'Minor 6th':
                $scope.drawChord($scope.minor6th);
                break;

            case 'Sus2':
                $scope.drawChord($scope.sus2);
                break;

            case 'Sus4':
                $scope.drawChord($scope.sus4);
                break;
        }
    };

    // Draw the array of notes for the chord
    $scope.drawChord = function(indexes) {
        $scope.drawNote($scope.rootNoteIndex, 0);
        $scope.otherIndexes = indexes;
        angular.forEach($scope.otherIndexes, function(index) {
            $scope.drawNote($scope.rootNoteIndex + index, 0)
        });
    };

    // Draw a single note on the keyboard
    $scope.drawNote = function(index) {
        var selector = '#key' + index;
        console.log(selector);
        var key = angular.element(document.querySelector(selector));

        if (key.hasClass('black')) {
            key.addClass('black_selected');
        } else {
            key.addClass('white_selected');
        }
    };

    // Reset the keyboard
    $scope.clearKeys = function() {
        angular.element(document.getElementsByClassName('key')).removeClass('white_selected');
        angular.element(document.getElementsByClassName('black')).removeClass('black_selected');
    };

    // Find the index from the note
    $scope.getRootIndex = function(rootNote) {
        return $scope.chordRoots.indexOf(rootNote);
    };

    // Find the note name from the index
    $scope.getNoteFromIndex = function(index) {
        return $scope.chordRoots[index];
    };

    // Initialise the keyboard - defaults to C Major chord
    var init = function () {

        // Turn the keyboard into a piano
        document.onkeypress = function(e) {
            var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
            if ('undefined' !== typeof $scope.keyStrokeMap[e.keyCode]) {
                $scope.playNote($scope.keyStrokeMap[e.keyCode]);
            }
        }

        // Define some variables
        $scope.chordRoot = "C";
        $scope.chordType = "Major";

        $scope.chordRoots = [
            "C","C#","D","D#","E","F","F#","G","G#","A","A#","B"
        ];

        $scope.keyStrokeMap = new Array();

        // Key strokes from A onwards for first octave
        $scope.keyStrokeMap[97] = 0;  // C
        $scope.keyStrokeMap[119] = 1; // C#
        $scope.keyStrokeMap[115] = 2; // D
        $scope.keyStrokeMap[101] = 3; // D#
        $scope.keyStrokeMap[100] = 4; // E
        $scope.keyStrokeMap[102] = 5; // F
        $scope.keyStrokeMap[116] = 6; // F#
        $scope.keyStrokeMap[103] = 7; // G
        $scope.keyStrokeMap[121] = 8; // G#
        $scope.keyStrokeMap[104] = 9; // A
        $scope.keyStrokeMap[117] = 10; // A#
        $scope.keyStrokeMap[106] = 11; // B

        // Key strokes from Shift A onwards for second octave
        $scope.keyStrokeMap[65] = 12; // C
        $scope.keyStrokeMap[87] = 13; // C#
        $scope.keyStrokeMap[83] = 14; // D
        $scope.keyStrokeMap[69] = 15; // D#
        $scope.keyStrokeMap[68] = 16; // E
        $scope.keyStrokeMap[70] = 17; // F
        $scope.keyStrokeMap[84] = 18; // F#
        $scope.keyStrokeMap[71] = 19; // G
        $scope.keyStrokeMap[89] = 20; // G#
        $scope.keyStrokeMap[72] = 21; // A
        $scope.keyStrokeMap[85] = 22; // A#
        $scope.keyStrokeMap[74] = 23; // B

        $scope.chordTypes = [
            {v:"Major",o:"Major"},
            {v:"Minor",o:"Minor"},
            {v:"Major 7th",o:"Major 7th"},
            {v:"7th",o:"7th"},
            {v:"Minor 7th",o:"Minor 7th"},
            {v:"Major 6th",o:"Major 6th"},
            {v:"Minor 6th",o:"Minor 6th"},
            {v:"Sus4",o:"Sus 4"},
            {v:"Sus2",o:"Sus 2"}
        ];

        // Tone mapping for each chord type
        // Assumes root note = 1
        $scope.major = [4,7];
        $scope.minor = [3,7];
        $scope.minor7th = [3,7,10];
        $scope.major7th = [4,7,11];
        $scope.seventh = [4,7,10];
        $scope.major6th = [4,7,9];
        $scope.minor6th = [3,7,9];
        $scope.sus2 = [2,7];
        $scope.sus4 = [5,7];

        $scope.getChord();
    };

    // Actually play the MP3 sounds for a chord
    $scope.playChord = function() {

        $scope.playNote($scope.rootNoteIndex);

        angular.forEach($scope.otherIndexes, function(index) {
            $scope.playNote($scope.rootNoteIndex + index);
        });
    };

    // Actually play the MP3 for a single note used by playChord
    $scope.playNote = function(index) {
        var sid = "s" + index;
        const audio = document.querySelector("audio[id=" + sid + "]");
        audio.currentTime = 0;
        audio.play();
    };
    
    init();
});
