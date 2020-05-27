export const cleanTimeDisplay = (SECONDS) => {
    //create the hours
    let updatedHr = Math.floor(SECONDS / 3600);
    if (updatedHr < 10) { updatedHr = `0${updatedHr}` };
    if (updatedHr < 1) { updatedHr = `00` };

    //create the minutes
    let updatedMin = Math.floor((SECONDS - (updatedHr * 3600)) / 60);
    if (updatedMin < 10) { updatedMin = `0${updatedMin}` };
    if (updatedMin < 1) { updatedMin = `00` };

    //create the seconds
    let updatedSec = SECONDS - ((updatedHr * 3600) + (updatedMin * 60));
    if (updatedSec < 10) { updatedSec = `0${updatedSec}` };
    if (updatedSec < 1) { updatedSec = `00` };

    let rollingTime = `${updatedHr}:${updatedMin}:${updatedSec}`;

    return rollingTime;
}