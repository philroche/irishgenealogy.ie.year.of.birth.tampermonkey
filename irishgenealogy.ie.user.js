// ==UserScript==
// @name         Add Year of Birth to Multiple Records
// @namespace    http://tampermonkey.net/
// @version      2024-10-10
// @description  Add year of birth for multiple records based on age at death and year of death
// @author       You
// @match        https://civilrecords.irishgenealogy.ie/churchrecords/civil-perform-search.jsp*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=irishgenealogy.ie
// @grant        none
// ==/UserScript==

(function() {
    'use strict';


    function extractYear(dateString) {
        // First, try parsing as a simple year
        if (/^\d{4}$/.test(dateString)) {
            return parseInt(dateString, 10);
        }

        // If not a simple year, try parsing as a full date
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date.getFullYear();
        }

        // If parsing fails, throw an error
        throw new Error('Invalid date string format');
    }
    function calculateBirthYear(ageAtDeath, yearOfDeath) {
        return yearOfDeath - ageAtDeath;
    }

    function addBirthYears() {
        
        // Assuming each person's record is in a list item
        const personRecords = document.querySelectorAll('#results li');

        personRecords.forEach(record => {
            const ageElement = record.querySelector('.right_col table tr:nth-of-type(3) > td');
            const deathYearElement = record.querySelector('.left_col strong:nth-of-type(2)');            

            if (ageElement && deathYearElement) {
                const age = parseInt(ageElement.textContent);
                var deathYear = parseInt(deathYearElement.textContent);                
                deathYear = extractYear(deathYear);
                if (!isNaN(age) && !isNaN(deathYear)) {
                    const birthYear = calculateBirthYear(age, deathYear);
                    const birthYearElement = document.createElement('span');
                    birthYearElement.className = 'birth-year';
                    birthYearElement.textContent = 'Year of birth :' + birthYear;
                    birthYearElement.style.marginLeft = '10px';
                    birthYearElement.style.color = 'red';
                    record.appendChild(birthYearElement);
                }
            }
        });
    }

    // Run the function when the page loads
    window.addEventListener('load', addBirthYears);
})();