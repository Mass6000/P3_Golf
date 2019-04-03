let courseHoles = [];

// THIS SECTION GETS THE API DATA FROM THE SOURCE XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//
//     https://golf-courses-api.herokuapp.com/courses
//       Fox Hollow id: 18300
//       Thanksgiving Point id: 11819
//       Spanish Oaks id: 19002
//
//     https://golf-courses-api.herokuapp.com/courses/${courseid}
//       This last URL contains all the information required for the selected course
//

function getGolfCourses() {
    let allGolfCourses;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            allGolfCourses = JSON.parse(this.responseText);
            drawGolfCourses(allGolfCourses);
        }
    };
    xhttp.open("GET", "https://golf-courses-api.herokuapp.com/courses", true);
    xhttp.send();
}

function drawGolfCourses(allGolfCourses) {
    $('.containerCourse').append(`<h1>Course Selections Page</h1>`);
    $('.containerCourse').append(`<h4>Choose a course from the dropdown</h4>`);
    $('.containerCourse').append(`<select name="golfCourses" id="golfCourses"></select>`);
    $('.containerCourse').append(`<noscript><input type="submit" value="Submit"></noscript>`);
    $('.containerCourse').append(`<div id="courseImage"></div>`);
    $('.containerCourse').append(`<button id="courseSubmit" type="button"></button>`); // This button is replace below
    // as I could not figure out a way to keep it below the image without setting it here. XXXXXXXXXXXXXXXXXXXXXXXXXXX




    for (let i = 0; i < allGolfCourses.courses.length; i++) {
        if (i === 0) {
            $('#golfCourses').append(`<option value="${allGolfCourses.courses[i].id}" id="${allGolfCourses.courses[i].id}">${allGolfCourses.courses[i].name}</option>`);
            $('#courseImage').append(`<img id="imageCourse" src="${allGolfCourses.courses[i].image}" alt="Image of the ${allGolfCourses.courses[i].name}">`);
            $('#courseSubmit').replaceWith(`<button id="courseSubmit" onclick="getGolfCourse(${allGolfCourses.courses[i].id})">Complete your selection by pressing here</button>`)
        } else {
            $('#golfCourses').append(`<option value="${allGolfCourses.courses[i].id}" id="${allGolfCourses.courses[i].id}">${allGolfCourses.courses[i].name}</option>`);
        }
    }

    // This is where the individual course is selected XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    $('#golfCourses').change(function () {
        for (let i = 0; i < allGolfCourses.courses.length; i++) {
            if ($(this).val() == allGolfCourses.courses[i].id) {
                $('#imageCourse').replaceWith(`<img id="imageCourse" src="${allGolfCourses.courses[i].image}" alt="Image of the ${allGolfCourses.courses[i].name}">`);
                $('#courseSubmit').replaceWith(`<button id="courseSubmit" onclick="getGolfCourse(${allGolfCourses.courses[i].id})">Submit</button>`);
            }
        }
    });
}

function getGolfCourse(id) {
    let selGolfCourse;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            selGolfCourse = JSON.parse(this.responseText);
            objHoleData(selGolfCourse);
            // todo insert modal function call here "select teebox"
            // todo turn off "Select Your Course" display
            // todo draw course card function call drawCard(); courseHoles is globally defined so I don't need to pass it.
        }
    };
    xhttp.open("GET", `https://golf-courses-api.herokuapp.com/courses/${id}`, true);
    xhttp.send();
}

function objHoleData(selGolfCourse) {
    let holes;
    if (courseHoles.length > 0) {
        courseHoles = [];
    }
    for (let h = 0; h < selGolfCourse.data.holes.length; h++) {
        let teebox,
            allTeebox = [];
        for (let tb = 0; tb < selGolfCourse.data.holes[h].teeBoxes.length; tb++) {
            teebox = new Teebox(selGolfCourse.data.holes[h].teeBoxes[tb]);
            allTeebox.push(teebox);
        }
        holes = new Holes(h + 1, allTeebox);
        courseHoles.push(holes);
    }
}

// THIS SECTION DRAWS AND SETS UP THE SCORECARD  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

function drawCard() {
    let numColumns = 22,
        playerNames = ['One', 'Two', 'Three', 'Four'];

// Working grid here
//Make columns
    for (let c = 0; c < numColumns; c++) {
        $('.theCard').append(`<div id="col${c}" class="column"></div>`);
    }

// Put blocks in the columns
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < numColumns; c++) {
            $('#col' + c).append(`<div id="r${r}c${c}" class="cells"></div>`);
        }
    }

// Put player label and holes numbers at the top of the columns
    $('#r0c0').replaceWith(`<div id="r0c0" class="cells playersColumn">Players:</div>`);
    for (let c = 1; c < 10; c++) {
        $(`#r0c${c}`).html(`${c}`);
    }
    $('#r0c10').html('Out');
    for (let c = 11; c < 20; c++) {
        $(`#r0c${c}`).html(`${c - 1}`);
    }
    $('#r0c20').html('In');
    $('#r0c21').html('Total');

// Put players in the first column
    for (r = 1; r < 6; r++) {
        $(`#r${r}c0`).replaceWith(`<div id="r${r}c0" class="cells playersColumn">${playerNames[r - 1]}</div>`);
    }
}




getGolfCourses();
// drawCard();
